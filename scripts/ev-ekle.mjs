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
const AI_MODEL = "gemini-2.5-flash-image";
const PANO_MODEL = "gemini-3.1-flash-image";

const STILLER = [
  { id: "akdeniz",        ad: { tr: "Akdeniz", en: "Mediterranean", ru: "Средиземноморский" },
    prompt: "warm Mediterranean style: lime-washed walls, natural linen, terracotta and olive tones, rattan and light oak furniture, ceramic details" },
  { id: "modern-minimal", ad: { tr: "Modern Minimal", en: "Modern Minimal", ru: "Модерн-минимализм" },
    prompt: "modern minimalist style: clean lines, neutral greys and off-white, low-profile furniture, almost no ornament, uncluttered" },
  { id: "iskandinav",     ad: { tr: "İskandinav", en: "Scandinavian", ru: "Скандинавский" },
    prompt: "warm Scandinavian style: pale birch and ash wood, soft wool textiles, muted pastels, cosy lighting, plants" },
  { id: "modern-luks",    ad: { tr: "Modern Lüks", en: "Modern Luxury", ru: "Современная роскошь" },
    prompt: "modern luxury style: dark walnut, brushed brass accents, marble surfaces, velvet upholstery, layered warm lighting" },
];

const AI_PROMPT = (stil) => `Virtually stage this room in ${stil}.

Hard requirements:
- Keep the room's architecture EXACTLY: walls, windows, doors, ceiling, floor plan,
  camera angle and perspective must not change.
- Only replace/add furniture, textiles, lighting fixtures and decor.
- Keep the existing natural light direction and window views.
- Photorealistic interior photography, no people, no text, no watermark, no logo.`;

const PANO_PROMPT = `Convert this interior photograph into a single seamless CYLINDRICAL 360 PANORAMA
for a real-estate virtual tour viewer.

Hard requirements:
- Very wide panoramic format, 4:1 aspect ratio.
- Covers a full 360 degrees horizontally: the left edge and the right edge MUST match
  seamlessly so the image wraps continuously with no visible seam.
- Straight, level horizon through the vertical centre. No fisheye, no barrel warp.
- Extend the room realistically all the way around: invent the walls behind the original
  camera position, keeping the same architecture, materials, colour palette, flooring and
  furniture as the source photograph.
- Consistent lighting and perspective across the whole width.
- Photorealistic, no people, no text, no watermark, no logo, no black bars.`;

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

async function uret(key, model, prompt, dosya, oran) {
  const veri = fs.readFileSync(dosya);
  const uz = path.extname(dosya).toLowerCase();
  const mime = uz === ".png" ? "image/png" : uz === ".webp" ? "image/webp" : "image/jpeg";
  const gen = { responseModalities: ["IMAGE"] };
  if (oran) gen.imageConfig = { aspectRatio: oran };
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }, { inline_data: { mime_type: mime, data: veri.toString("base64") } }] }],
    generationConfig: gen,
  };
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
        if (inl?.data) return { ok: true, buf: Buffer.from(inl.data, "base64") };
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
  for (const s of STILLER) {
    const hedef = path.join(AI, `${slug}__${s.id}.png`);
    if (fs.existsSync(hedef)) { yaz(`  atlandi     ai/${slug}__${s.id}`); }
    else {
      const r = await uret(key, AI_MODEL, AI_PROMPT(s.prompt), anaFoto);
      if (r.ok) { fs.writeFileSync(hedef, r.buf); yaz(`  AI          ${s.id}  ${(r.buf.length / 1024).toFixed(0)}KB`); }
      else { yaz(`  AI HATA     ${s.id}  ${r.hata}`); continue; }
    }
    aiTasarimlar.push({ stil: s.id, ad: s.ad, gorsel: `/gorsel/ai/${slug}__${s.id}.png` });
  }

  // 3) Her fotograf icin 360 panorama
  const panoramalar = [];
  for (let n = 0; n < gorseller.length; n++) {
    const kaynak = path.join(EV, path.basename(gorseller[n]));
    const ad = `${slug}-${String(n + 1).padStart(2, "0")}.png`;
    const hedef = path.join(PANO, ad);
    if (fs.existsSync(hedef)) { yaz(`  atlandi     360/${ad}`); panoramalar.push(`/gorsel/360/${ad}`); continue; }
    const r = await uret(key, PANO_MODEL, PANO_PROMPT, kaynak, "4:1");
    if (r.ok) { fs.writeFileSync(hedef, r.buf); panoramalar.push(`/gorsel/360/${ad}`); yaz(`  360         ${ad}  ${(r.buf.length / 1024).toFixed(0)}KB`); }
    else yaz(`  360 HATA    ${ad}  ${r.hata}`);
  }

  // 4) Ilani veri.ts'e yaz
  const veriYolu = path.join(KOK, "lib", "veri.ts");
  let veri = fs.readFileSync(veriYolu, "utf8");
  const idler = [...veri.matchAll(/id: (\d+),/g)].map((m) => Number(m[1]));
  const mevcut = veri.includes(`slug: "${slug}"`);
  const id = mevcut ? Number(veri.match(new RegExp(`id: (\\\\d+), slug: "${slug}"`))?.[1]) : Math.max(...idler) + 1;
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
    emlakci: "selin-k",
    yayinTarihi: "${bugun}", guncelleme: "${bugun}",
    goruntulenme: 1,
    vitrin: true,
    aiOdaGorseli: "${gorseller[0]}",${panoramalar.length ? `\n    gezinti360: "${panoramalar[0]}",\n    gezintiOdalari: ${JSON.stringify(panoramalar)},` : ""}
    aiTasarimlar: ${JSON.stringify(aiTasarimlar)},
    konum: { lat: 35.3364, lng: 33.3192 },
  },
`;

  if (mevcut) {
    const bas = veri.indexOf(`  {\n    id: ${id}, slug: "${slug}"`);
    let d = 0, j = bas;
    for (; j < veri.length; j++) { if (veri[j] === "{") d++; else if (veri[j] === "}") { d--; if (!d) { j += 2; break; } } }
    veri = veri.slice(0, bas) + kayit + veri.slice(j);
    yaz(`\n  ilan guncellendi (#${id})`);
  } else {
    const son = veri.lastIndexOf("];");
    veri = veri.slice(0, son) + kayit + veri.slice(son);
    yaz(`\n  ilan eklendi (#${id})`);
  }
  fs.writeFileSync(veriYolu, veri);
  yaz(`  /tr/ilan/${slug}\n`);
})();
