#!/usr/bin/env node
/**
 * GERCEK EV EKLE — kendi fotograflarindan tam ilan uretir.
 *
 *   node scripts/ev-ekle.mjs --klasor="C:/.../fotograflar"
 *   node scripts/ev-ekle.mjs --klasor=... --slug=girne-studyo --baslik="Girne'de eşyalı stüdyo"
 *
 * Ne yapar:
 *   1. Klasordeki fotograflari public/gorsel/ev/ altina kopyalar
 *   2. Ilk fotograftan 4 stilde AI sanal dekorasyon uretir
 *   3. HER fotograftan 360 silindirik panorama uretir  -> her odayi gezebilirsin
 *   4. lib/veri.ts icine ilani ekler (ayni slug varsa gunceller)
 *
 * Fotograflar gercek oldugu icin ilan `gercekGorsel: true` isaretlenir ve
 * "temsili gorsel" damgasi basilmaz. AI ciktilarinda filigran KALIR.
 *
 * UYARI: baska bir sitenin filigranini tasiyan gorsel kullanma. Kendi
 * cektigin ham fotograflari ver.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UST = path.resolve(KOK, "..");
const BASE = "https://generativelanguage.googleapis.com/v1beta";
const AI_MODEL = "gemini-3.1-flash-image";
const PANO_MODEL = "gemini-3.1-flash-image";

const STILLER = [
  { id: "akdeniz",        ad: { tr: "Akdeniz", en: "Mediterranean", ru: "Средиземноморский" },
    prompt: "Mediterranean furniture and soft furnishings: natural linen upholstery, rattan and light oak pieces, terracotta and olive accessories, ceramic vases, olive branches" },
  { id: "modern-minimal", ad: { tr: "Modern Minimal", en: "Modern Minimal", ru: "Модерн-минимализм" },
    prompt: "minimalist furniture and soft furnishings: low-profile neutral seating, no ornament, a single sculptural object, plain textiles, uncluttered surfaces" },
  { id: "iskandinav",     ad: { tr: "İskandinav", en: "Scandinavian", ru: "Скандинавский" },
    prompt: "Scandinavian furniture and soft furnishings: pale birch and ash furniture, chunky wool throws, muted pastel cushions, paper lampshades, potted plants" },
  { id: "modern-luks",    ad: { tr: "Modern Lüks", en: "Modern Luxury", ru: "Современная роскошь" },
    prompt: "luxury furniture and soft furnishings: velvet upholstery, walnut and brass furniture, layered table lamps, heavy drapery, a statement rug" },
];

const AI_PROMPT = (stil) => `Virtually stage this exact room by replacing only the loose furniture and decor with: ${stil}.

THIS IS A PHOTO EDIT, NOT A REDESIGN. The output must be recognisably the SAME room,
photographed from the SAME spot. A viewer must be able to match it to the original
one-to-one.

MUST NOT CHANGE — copy these from the source photograph pixel-faithfully:
- Camera position, angle, focal length, framing and perspective.
- Room geometry: every wall, corner, ceiling line, doorway and opening.
- Wall finishes and cladding, INCLUDING any decorative stone or brick feature wall —
  keep it in the same place, same stone, same shape.
- Flooring: same material, same colour, same plank direction. Do not lay new flooring.
- Wall colour and paint.
- Windows and doors: same number, same size, same position. Do not add or remove any.
- Fixed items: air-conditioning unit, radiators, sockets, switches, thermostat,
  kitchen units, refrigerator, doors and door hardware — all stay exactly where they are.
- Anything visible through a doorway stays identical.
- The television stays on the SAME wall, in the SAME place.

MAY CHANGE: sofas, chairs, tables, rugs, cushions, throws, curtains, wall art,
table lamps, plants and small decorative objects.

Photorealistic interior photography, same time of day and same light direction as
the source, no people, no text, no watermark, no logo.`;

const PANO_PROMPT = `You are given several photographs taken from roughly the same spot in ONE room,
looking in different directions. Stitch them into a SINGLE seamless 360° cylindrical panorama.

Treat this as photo stitching, NOT as image generation:
- Every wall, window, door, kitchen unit, appliance and piece of furniture in the output
  must come from the supplied photographs. Do NOT invent rooms, furniture or windows
  that are not visible in them.
- Keep the real materials and colours: the stone feature wall, the wall paint, the floor
  planks, the kitchen cabinet colour, the curtains, the actual sofas and tables.
- Keep the real lighting: same time of day throughout. If the photographs are taken at
  night with the lights on, the whole panorama is at night. Never mix day and night.
- Where two photographs overlap, blend them. Where a small gap remains, extend the
  adjacent wall, floor and ceiling plainly — a blank stretch of the same wall is far
  better than invented furniture.
- The left edge and the right edge must line up so the image wraps continuously.
- Straight, level horizon through the vertical centre. No fisheye, no mirrors,
  no duplicated copies of the same furniture.

Output: one photorealistic 4:1 panorama, no people, no text, no watermark, no black bars.`;

/** Model PNG degil JPEG donebiliyor; uzantiyi icerige gore ver. */
const uz = (r) => (r?.mime === "image/jpeg" ? "jpeg" : "png");
const yaz = (m = "") => console.log(m);
const bitir = (m) => { console.error("\n  HATA: " + m + "\n"); process.exit(1); };

function envOku() {
  const p = path.join(UST, ".env");
  if (!fs.existsSync(p)) bitir(`.env bulunamadi: ${p}`);
  const env = {};
  for (const s of fs.readFileSync(p, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const x = s.trim();
    if (!x || x.startsWith("#") || !x.includes("=")) continue;
    const i = x.indexOf("=");
    env[x.slice(0, i).trim()] = x.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

async function uret(key, model, prompt, dosyalar, oran) {
  const liste = Array.isArray(dosyalar) ? dosyalar : [dosyalar];
  const parcalar = [{ text: prompt }];
  for (const d of liste) {
    const uz = path.extname(d).toLowerCase();
    const mime = uz === ".png" ? "image/png" : uz === ".webp" ? "image/webp" : "image/jpeg";
    parcalar.push({ inline_data: { mime_type: mime, data: fs.readFileSync(d).toString("base64") } });
  }
  const gen = { responseModalities: ["IMAGE"] };
  if (oran) gen.imageConfig = { aspectRatio: oran };
  const body = { contents: [{ role: "user", parts: parcalar }], generationConfig: gen };
  for (let d = 1; d <= 4; d++) {
    const r = await fetch(`${BASE}/models/${model}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const metin = await r.text();
    if (r.ok) {
      const j = JSON.parse(metin);
      for (const p of j?.candidates?.[0]?.content?.parts || []) {
        const inl = p.inlineData || p.inline_data;
        if (inl?.data) return { ok: true, buf: Buffer.from(inl.data, "base64"), mime: inl.mimeType || inl.mime_type || "image/png" };
      }
      return { ok: false, hata: `gorsel donmedi (${j?.promptFeedback?.blockReason || j?.candidates?.[0]?.finishReason || "?"})` };
    }
    if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 3000 * d)); continue; }
    return { ok: false, hata: `HTTP ${r.status}: ${metin.slice(0, 180)}` };
  }
  return { ok: false, hata: "denemeler tukendi" };
}

(async () => {
  const argv = process.argv.slice(2);
  const arg = (a, v = null) => { const x = argv.find((s) => s.startsWith(`--${a}=`)); return x ? x.slice(a.length + 3) : v; };

  const klasor = arg("klasor");
  if (!klasor) bitir('--klasor="fotograflarin oldugu klasor" gerekli.');
  if (!fs.existsSync(klasor)) bitir(`Klasor yok: ${klasor}`);

  const slug   = arg("slug", "kendi-evim");
  const baslik = arg("baslik", "Gerçek fotoğraflı örnek ilan");
  const sehir  = arg("sehir", "Girne");
  const bolge  = arg("bolge", "Merkez");
  const fiyat  = Number(arg("fiyat", "72000"));
  const m2     = Number(arg("m2", "45"));
  const oda    = arg("oda", "1+0");
  const banyo  = Number(arg("banyo", "1"));
  const islem  = arg("islem", "satilik");
  const tip    = arg("tip", "daire");

  const key = envOku().GOOGLE_API_KEY;
  if (!key) bitir(".env icinde GOOGLE_API_KEY yok.");

  const kaynaklar = fs.readdirSync(klasor)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map((f) => path.join(klasor, f));
  if (!kaynaklar.length) bitir(`Klasorde fotograf yok: ${klasor}`);

  const EV = path.join(KOK, "public", "gorsel", "ev");
  const AI = path.join(KOK, "public", "gorsel", "ai");
  const PANO = path.join(KOK, "public", "gorsel", "360");
  for (const d of [EV, AI, PANO]) fs.mkdirSync(d, { recursive: true });

  yaz(`\n  ${kaynaklar.length} fotograf · AI dekorasyon 4 stil · her fotografa 360 panorama`);
  yaz(`  tahmini maliyet ~$${(4 * 0.039 + kaynaklar.length * 0.067).toFixed(2)}\n`);

  // 1) Fotograflari kopyala
  const gorseller = [];
  kaynaklar.forEach((k, n) => {
    const ad = `${slug}-${String(n + 1).padStart(2, "0")}${path.extname(k).toLowerCase()}`;
    fs.copyFileSync(k, path.join(EV, ad));
    gorseller.push(`/gorsel/ev/${ad}`);
    yaz(`  kopyalandi  ${ad}`);
  });

  // 2) AI sanal dekorasyon — ilk fotograf uzerinden
  const anaFoto = path.join(EV, path.basename(gorseller[0]));
  const aiTasarimlar = [];
  /** Uretilmis dosyayi uzantisindan bagimsiz bul (model PNG de JPEG de donebiliyor) */
  const varOlan = (klasor, govde) =>
    ["jpeg", "png", "webp"].map((e) => `${govde}.${e}`).find((f) => fs.existsSync(path.join(klasor, f)));

  for (const s of STILLER) {
    const govde = `${slug}__${s.id}`;
    let dosya = varOlan(AI, govde);
    if (dosya) yaz(`  atlandi     ai/${dosya}`);
    else {
      const r = await uret(key, AI_MODEL, AI_PROMPT(s.prompt), anaFoto);
      if (!r.ok) { yaz(`  AI HATA     ${s.id}  ${r.hata}`); continue; }
      dosya = `${govde}.${uz(r)}`;
      fs.writeFileSync(path.join(AI, dosya), r.buf);
      yaz(`  AI          ${s.id}  ${(r.buf.length / 1024).toFixed(0)}KB  ${r.mime}`);
    }
    aiTasarimlar.push({ stil: s.id, ad: s.ad, gorsel: `/gorsel/ai/${dosya}` });
  }

  // 3) TEK panorama — butun fotograflardan. Tek fotograftan 360 uretmek modeli
  //    odanin %70'ini uydurmaya zorluyordu ve her seferinde baska bir ev cikiyordu.
  const panoramalar = [];
  {
    const govde = `${slug}-360`;
    let dosya = varOlan(PANO, govde);
    if (dosya) yaz(`  atlandi     360/${dosya}`);
    else {
      const girdiler = gorseller.map((g) => path.join(EV, path.basename(g)));
      const r = await uret(key, PANO_MODEL, PANO_PROMPT, girdiler, "4:1");
      if (r.ok) {
        dosya = `${govde}.${uz(r)}`;
        fs.writeFileSync(path.join(PANO, dosya), r.buf);
        yaz(`  360         ${dosya}  ${(r.buf.length / 1024).toFixed(0)}KB  ${r.mime}`);
      } else yaz(`  360 HATA    ${r.hata}`);
    }
    if (dosya) panoramalar.push(`/gorsel/360/${dosya}`);
  }

  // 4) Ilani veri.ts'e yaz
  const veriYolu = path.join(KOK, "lib", "veri.ts");
  let veri = fs.readFileSync(veriYolu, "utf8");
  const idler = [...veri.matchAll(/id: (\d+),/g)].map((m) => Number(m[1]));
  const slugYeri = veri.indexOf(`slug: "${slug}"`);
  const mevcut = slugYeri >= 0;
  // RegExp yerine duz metin: kacis katmanlari id'yi NaN yapiyordu ve kayit ikiye katlaniyordu.
  const id = mevcut
    ? Number(veri.slice(veri.lastIndexOf("id: ", slugYeri) + 4, slugYeri).replace(/\D/g, ""))
    : Math.max(...idler) + 1;
  const bugun = new Date().toISOString().slice(0, 10);

  const kayit = `  {
    id: ${id}, slug: "${slug}",
    baslik: { tr: ${JSON.stringify(baslik)}, en: ${JSON.stringify(baslik)}, ru: ${JSON.stringify(baslik)} },
    aciklama: { tr: "Gerçek fotoğraflarla hazırlanmış örnek ilan. AI sanal dekorasyon ve 360° gezinti bu fotoğraflardan üretildi.", en: "Sample listing built from real photographs. AI staging and the 360° tour were generated from these photos.", ru: "Объявление с реальными фотографиями. AI-дизайн и 360° тур созданы из этих фото." },
    cevrilmis: false,
    islem: "${islem}", tip: "${tip}", fiyat: ${fiyat},
    sehir: "${sehir}", bolge: "${bolge}",
    oda: "${oda}", banyo: ${banyo}, m2: ${m2}, binaYasi: 5, kdvDahil: true,
    esyali: "esyali", tapu: "turk-kocani", tapuAsama: "devredildi", yabanciUygun: true,
    ozellikler: ["asansor", "balkon", "sehir-ici", "otopark"],
    kapak: "${gorseller[0]}",
    gercekGorsel: true,
    gorseller: ${JSON.stringify(gorseller)},
    emlakci: "taha-yildiz",
    yayinTarihi: "${bugun}", guncelleme: "${bugun}",
    goruntulenme: 1,
    vitrin: true,
    aiOdaGorseli: "${gorseller[0]}",${panoramalar.length ? `\n    gezinti360: "${panoramalar[0]}",\n    gezintiOdalari: ${JSON.stringify(panoramalar)},` : ""}
    aiTasarimlar: ${JSON.stringify(aiTasarimlar)},
    konum: { lat: 35.3364, lng: 33.3192 },
  },
`;

  if (mevcut) {
    /* Mevcut kaydi otomatik DEGISTIRMIYORUZ. Parantez sayarak TS dosyasi
       duzenlemek veri.ts'i iki kez bozdu (kayit ucledi, id NaN oldu).
       Yeni kayit dosyaya yazilir, elle degistirilir. */
    const cikti = path.join(KOK, "scripts", `${slug}.ilan.txt`);
    fs.writeFileSync(cikti, kayit);
    yaz(`\n  ilan zaten var (#${id}) — veri.ts'e DOKUNULMADI.`);
    yaz(`  Yeni kayit: ${cikti}`);
    yaz(`  lib/veri.ts icindeki eski kaydi bununla degistir.`);
  } else {
    const son = veri.lastIndexOf("];");
    veri = veri.slice(0, son) + kayit + veri.slice(son);
    fs.writeFileSync(veriYolu, veri);
    yaz(`\n  ilan eklendi (#${id})`);
  }
  yaz(`  /tr/ilan/${slug}\n`);
})();
