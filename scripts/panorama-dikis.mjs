#!/usr/bin/env node
/**
 * PANORAMA DIKIS OLCUMU
 *
 * 360 gezintinin en gorunur kusuru, panoramanin sol ve sag kenarinin
 * birbirini tutmamasi: kullanici donerken sert bir sicrama goruyor.
 * Bu script kenarlari sayisal olarak karsilastirir.
 *
 *   node scripts/panorama-dikis.mjs public/gorsel/360/xxx.png
 *
 * Cikti: ortalama kanal farki (0-255). Kabaca:
 *   < 12  -> dikis gorunmez, tam 360 olarak oynatilabilir
 *   12-30 -> hafif gorunur
 *   > 30  -> sert dikis; gezintide yatay aci sinirlandirilmali
 *
 * Bagimlilik yok: PNG cozumu zlib ile elle yapiliyor (yerel .node ikilileri
 * bu makinede engelli, sharp/canvas kurulamiyor).
 */
import fs from "node:fs";
import zlib from "node:zlib";

function pngOku(yol) {
  const b = fs.readFileSync(yol);
  if (b.readUInt32BE(0) !== 0x89504e47) throw new Error("PNG degil");
  let o = 8, en = 0, boy = 0, derinlik = 0, renkTipi = 0;
  const parcalar = [];
  while (o < b.length) {
    const uzunluk = b.readUInt32BE(o);
    const tip = b.toString("ascii", o + 4, o + 8);
    const veri = b.subarray(o + 8, o + 8 + uzunluk);
    if (tip === "IHDR") {
      en = veri.readUInt32BE(0); boy = veri.readUInt32BE(4);
      derinlik = veri[8]; renkTipi = veri[9];
      if (derinlik !== 8) throw new Error(`desteklenmeyen bit derinligi: ${derinlik}`);
      if (veri[12] !== 0) throw new Error("interlace destegi yok");
    } else if (tip === "IDAT") parcalar.push(veri);
    else if (tip === "IEND") break;
    o += 12 + uzunluk;
  }
  const kanal = { 0: 1, 2: 3, 4: 2, 6: 4 }[renkTipi];
  if (!kanal) throw new Error(`desteklenmeyen renk tipi: ${renkTipi}`);

  const ham = zlib.inflateSync(Buffer.concat(parcalar));
  const satirBayt = en * kanal;
  const cikti = Buffer.alloc(boy * satirBayt);

  let p = 0;
  for (let y = 0; y < boy; y++) {
    const filtre = ham[p++];
    const satir = ham.subarray(p, p + satirBayt); p += satirBayt;
    const hedef = cikti.subarray(y * satirBayt, (y + 1) * satirBayt);
    const ust = y > 0 ? cikti.subarray((y - 1) * satirBayt, y * satirBayt) : null;
    for (let x = 0; x < satirBayt; x++) {
      const a = x >= kanal ? hedef[x - kanal] : 0;
      const u = ust ? ust[x] : 0;
      const ua = ust && x >= kanal ? ust[x - kanal] : 0;
      let d = satir[x];
      if (filtre === 1) d += a;
      else if (filtre === 2) d += u;
      else if (filtre === 3) d += (a + u) >> 1;
      else if (filtre === 4) {
        const t = a + u - ua;
        const pa = Math.abs(t - a), pu = Math.abs(t - u), pua = Math.abs(t - ua);
        d += pa <= pu && pa <= pua ? a : pu <= pua ? u : ua;
      }
      hedef[x] = d & 0xff;
    }
  }
  return { en, boy, kanal, veri: cikti };
}

const yol = process.argv[2];
if (!yol) { console.error("kullanim: node scripts/panorama-dikis.mjs <png>"); process.exit(1); }

const { en, boy, kanal, veri } = pngOku(yol);
const satirBayt = en * kanal;

/** n piksel genisligindeki kenar seridinin ortalama rengini satir satir alir */
const serit = (baslangic, genislik) => {
  const out = [];
  for (let y = 0; y < boy; y++) {
    let r = 0, g = 0, bl = 0;
    for (let x = baslangic; x < baslangic + genislik; x++) {
      const i = y * satirBayt + x * kanal;
      r += veri[i]; g += veri[i + 1]; bl += veri[i + 2];
    }
    out.push([r / genislik, g / genislik, bl / genislik]);
  }
  return out;
};

const GEN = 6;
const sol = serit(0, GEN);
const sag = serit(en - GEN, GEN);

let toplam = 0, enKotu = 0;
for (let y = 0; y < boy; y++) {
  const f = (Math.abs(sol[y][0] - sag[y][0]) + Math.abs(sol[y][1] - sag[y][1]) + Math.abs(sol[y][2] - sag[y][2])) / 3;
  toplam += f;
  if (f > enKotu) enKotu = f;
}
const ort = toplam / boy;

const yorum = ort < 12 ? "dikis gorunmez — tam 360 oynatilabilir"
  : ort < 30 ? "hafif gorunur dikis"
  : "SERT DIKIS — gezintide yatay aci sinirlandirilmali";

console.log(`\n  ${yol}`);
console.log(`  ${en}x${boy}, ${kanal} kanal`);
console.log(`  kenar farki: ortalama ${ort.toFixed(1)} / en kotu satir ${enKotu.toFixed(1)}`);
console.log(`  -> ${yorum}\n`);
