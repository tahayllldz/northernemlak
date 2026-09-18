/**
 * Tek seferlik goc: lib/veri.ts icindeki `ozellikler` alani Turkce GORUNTU METNI
 * tutuyordu, bu yuzden Rusca/Ingilizce sayfada Turkce yaziyordu ve ozellik
 * filtresi coklu dilde calisamazdi. Metinleri kodlara cevirir.
 *
 *   node scripts/ozellik-gocu.mjs
 *
 * Idempotent: zaten kod olan degerlere dokunmaz.
 */
import fs from "node:fs";

const HARITA = {
  "Asansör": "asansor",
  "Jeneratör": "jenerator",
  "Şömine": "somine",
  "Çelik kapı": "celik-kapi",
  "Güvenlik kamerası": "guvenlik-kamerasi",
  "Yangın alarmı": "yangin-alarmi",
  "Güneş enerjisi": "gunes-enerjisi",
  "Özel havuz": "ozel-havuz",
  "Ortak havuz": "ortak-havuz",
  "Bahçe": "bahce",
  "Balkon": "balkon",
  "Teras": "teras",
  "Barbekü": "barbeku",
  "Otopark": "otopark",
  "Kapalı otopark": "kapali-otopark",
  "Deniz manzarası": "deniz-manzarasi",
  "Denize sıfır": "denize-sifir",
  "Dağ manzarası": "dag-manzarasi",
  "Doğa manzarası": "doga-manzarasi",
  "Şehir manzarası": "sehir-manzarasi",
  "Şehir içi": "sehir-ici",
  "Yol": "yol-erisimi",
  "Su altyapısı": "su-altyapisi",
  "Elektrik altyapısı": "elektrik-altyapisi",
  "Su kuyusu": "su-kuyusu",
};

const yol = "lib/veri.ts";
let s = fs.readFileSync(yol, "utf8");
const bilinmeyen = new Set();

s = s.replace(/ozellikler:\s*\[([^\]]*)\]/g, (tam, ic) => {
  const kodlar = ic
    .split(",")
    .map((v) => v.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean)
    .map((v) => {
      if (Object.values(HARITA).includes(v)) return v; // zaten kod
      const k = HARITA[v];
      if (!k) bilinmeyen.add(v);
      return k ?? v;
    });
  return `ozellikler: [${kodlar.map((k) => `"${k}"`).join(", ")}]`;
});

if (bilinmeyen.size) {
  console.error("Haritada olmayan deger:", [...bilinmeyen]);
  process.exit(1);
}

fs.writeFileSync(yol, s);
console.log("ozellikler kodlara cevrildi.");
