#!/usr/bin/env node
/**
 * 360 gezinti icin equirectangular panorama uretir.
 *
 *   node scripts/panorama-uret.mjs               -> varsayilan odalar
 *   node scripts/panorama-uret.mjs --oda=oda-05  -> tek oda
 *
 * NOT: Bunlar GERCEK 360 fotograf degil, AI uretimidir ve sitede
 * "AI ile olusturuldu — temsilidir" filigraniyla gosterilir (CLAUDE.md geregi).
 * Gercek ilanlarda 360 kamera (Insta360 / Ricoh Theta) cikisi kullanilir;
 * goruntuleyici ikisini de ayni sekilde oynatir.
 *
 * Cikti: public/gorsel/360/<oda>__<stil>.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UST = path.resolve(KOK, "..");
const GIRDI = path.join(KOK, "public", "gorsel", "ai");
const CIKTI = path.join(KOK, "public", "gorsel", "360");
const BASE = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = process.env.PANO_MODEL || "gemini-3.1-flash-image";

const PROMPT = `Convert this interior photograph into a single seamless CYLINDRICAL 360 PANORAMA
for a real-estate virtual tour viewer.

Hard requirements:
- Very wide panoramic format, 4:1 aspect ratio.
- Covers a full 360 degrees horizontally: the left edge and the right edge MUST match
  seamlessly so the image can wrap continuously with no visible seam.
- Straight, level horizon running through the vertical centre. No fisheye, no barrel warp.
- Extend the room realistically all the way around: invent the walls behind the original
  camera position, keeping the same style, materials, colour palette, flooring and
  furniture language as the source image.
- Consistent single light source and consistent perspective across the whole width.
- Photorealistic Mediterranean apartment interior, natural daylight, no people,
  no text, no watermark, no logo, no black bars.`;

const yaz = (m = "") => console.log(m);
const bitir = (m) => { console.error("\n  HATA: " + m + "\n"); process.exit(1); };

function envOku() {
  const p = path.join(UST, ".env");
  if (!fs.existsSync(p)) bitir(`.env bulunamadi: ${p}`);
  const env = {};
  for (const s of fs.readFileSync(p, "utf8").replace(/^﻿/, "").split(/\r?\n/)) {
    const t = s.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

async function uret(key, dosya) {
  const veri = fs.readFileSync(dosya);
  const uz = path.extname(dosya).toLowerCase();
  const mime = uz === ".png" ? "image/png" : uz === ".webp" ? "image/webp" : "image/jpeg";
  const body = {
    contents: [{ role: "user", parts: [{ text: PROMPT }, { inline_data: { mime_type: mime, data: veri.toString("base64") } }] }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "4:1" } },
  };
  for (let d = 1; d <= 4; d++) {
    const r = await fetch(`${BASE}/models/${MODEL}:generateContent`, {
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
    return { ok: false, hata: `HTTP ${r.status}: ${metin.slice(0, 200)}` };
  }
  return { ok: false, hata: "tekrar denemeler tukendi" };
}

(async () => {
  const argv = process.argv.slice(2);
  const arg = (a) => { const x = argv.find((v) => v.startsWith(`--${a}=`)); return x ? x.split("=")[1] : null; };
  const key = envOku().GOOGLE_API_KEY;
  if (!key) bitir(".env icinde GOOGLE_API_KEY yok.");

  const tekOda = arg("oda");
  const kaynaklar = fs.readdirSync(GIRDI)
    .filter((f) => f.endsWith("__akdeniz.webp"))
    .filter((f) => !tekOda || f.startsWith(tekOda))
    .sort();

  if (!kaynaklar.length) bitir(`Kaynak bulunamadi: ${GIRDI}`);
  fs.mkdirSync(CIKTI, { recursive: true });

  yaz(`\n  ${kaynaklar.length} panorama uretilecek (~$${(kaynaklar.length * 0.039).toFixed(2)})\n`);

  for (const k of kaynaklar) {
    const hedef = path.join(CIKTI, k.replace(/\.webp$/, ".png"));
    if (fs.existsSync(hedef)) { yaz(`  atlandi  ${k}`); continue; }
    const s = await uret(key, path.join(GIRDI, k));
    if (s.ok) { fs.writeFileSync(hedef, s.buf); yaz(`  tamam    ${k}  ${(s.buf.length / 1024).toFixed(0)}KB`); }
    else yaz(`  HATA     ${k}  ${s.hata}`);
  }
  yaz("");
})();
