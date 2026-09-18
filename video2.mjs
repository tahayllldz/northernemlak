import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3200";
const W = 1600, H = 900, FPS = 30;
const KARE = "/tmp/kareler2";
fs.rmSync(KARE, { recursive: true, force: true });
fs.mkdirSync(KARE, { recursive: true });

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const p = await ctx.newPage();

let n = 0;
const kare = async () => {
  await p.screenshot({ path: `${KARE}/${String(++n).padStart(5, "0")}.png`, animations: "disabled" });
};

/* ---- sabitleme: tum gecisler kapali, her sey bizim kontrolumuzde ---- */
const SABIT = `
*,*::before,*::after{transition:none!important;animation:none!important}
html{scroll-behavior:auto!important}
#__ic,#__ih,#__alt,#__kart{transition:none!important}
#__kart{position:fixed;inset:0;z-index:2147483645;background:#1B4D5C;display:flex;flex-direction:column;
align-items:center;justify-content:center;gap:16px;font-family:Inter Variable,system-ui,sans-serif}
#__kart h1{font-family:"Playfair Display Variable",Georgia,serif;font-size:64px;color:#F5F0E8;margin:0;
letter-spacing:-1.2px;font-weight:500;text-align:center;line-height:1.1}
#__kart h1 em{font-style:normal;color:#C4663A}
#__kart p{font-size:19px;color:#9ECBD6;margin:0;max-width:62ch;text-align:center;line-height:1.6}
#__kart .k{font-size:11.5px;letter-spacing:3.4px;text-transform:uppercase;color:#C4663A;margin-bottom:4px}
#__kart .cizgi{width:60px;height:2px;background:#C4663A;margin:6px 0 2px}
#__kart .n{position:absolute;bottom:40px;font-size:11px;letter-spacing:2.2px;text-transform:uppercase;color:rgba(245,240,232,.38)}
#__alt{position:fixed;left:0;right:0;bottom:40px;z-index:2147483644;display:flex;justify-content:center;
pointer-events:none;font-family:Inter Variable,system-ui,sans-serif}
#__alt span{background:rgba(14,44,54,.92);color:#F5F0E8;padding:12px 24px;border-radius:9px;font-size:17.5px;
box-shadow:0 10px 34px rgba(0,0,0,.34);letter-spacing:.1px}
#__vin{position:fixed;inset:0;z-index:2147483643;pointer-events:none;background:#0E2C36}`;

const KUR = `(() => {
  if (!document.getElementById("__st")) {
    const s = document.createElement("style"); s.id="__st"; s.textContent = \`${SABIT}\`;
    document.head.appendChild(s);
  }
  const mk = (id, css, html) => {
    let e = document.getElementById(id);
    if (!e) { e = document.createElement("div"); e.id = id; document.documentElement.appendChild(e); }
    if (css) e.style.cssText = css; if (html !== undefined) e.innerHTML = html;
    return e;
  };
  mk("__ih", "position:fixed;left:0;top:0;width:46px;height:46px;margin:-10px 0 0 -10px;border-radius:50%;background:rgba(196,102,58,.32);z-index:2147483646;pointer-events:none;opacity:0;transform:scale(.5)");
  mk("__ic", "position:fixed;left:0;top:0;width:28px;height:28px;z-index:2147483647;pointer-events:none;filter:drop-shadow(0 2px 5px rgba(0,0,0,.35))",
     '<svg width="28" height="28" viewBox="0 0 24 24"><path d="M5 2l7 18 2.2-7.4L21.6 10z" fill="#fff" stroke="#1B4D5C" stroke-width="1.5" stroke-linejoin="round"/></svg>');
  mk("__alt", null, "<span></span>").style.opacity = 0;
  window.__ic = (x,y) => { for (const id of ["__ic","__ih"]) { const e=document.getElementById(id);
    if (e) e.style.transform = (id==="__ih" ? "scale(1) " : "") + "translate("+x+"px,"+y+"px)"; } };
  window.__halo = (v) => { const e=document.getElementById("__ih"); if(e) e.style.opacity = v; };
  window.__alt = (t, o) => { const e=document.getElementById("__alt");
    if (t !== null && t !== undefined) e.querySelector("span").textContent = t; e.style.opacity = o; };
  window.__kart = (b, a, k, o) => {
    let e = document.getElementById("__kart");
    if (o <= 0) { e?.remove(); return; }
    if (!e) { e = document.createElement("div"); e.id="__kart"; document.documentElement.appendChild(e); }
    if (b !== null) e.innerHTML = '<div class="k">'+(k||"")+'</div><h1>'+b+'</h1><div class="cizgi"></div><p>'+(a||"")+'</p><div class="n">Prototip — ilanlar ve gorseller temsilidir</div>';
    e.style.opacity = o;
  };
  window.__vin = (o) => { let e=document.getElementById("__vin");
    if (o<=0){ e?.remove(); return; }
    if(!e){ e=document.createElement("div"); e.id="__vin"; document.documentElement.appendChild(e); }
    e.style.opacity=o; };
})();`;

const kur = async () => { await p.evaluate(KUR); };

/* ---- yumusatma egrileri ---- */
const easeIO = (t) => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/** sure saniye, fn(t, i) her karede calisir */
async function cek(sure, fn) {
  const adet = Math.max(1, Math.round(sure * FPS));
  for (let i = 0; i < adet; i++) {
    await fn(adet === 1 ? 1 : i / (adet - 1), i);
    await kare();
  }
}
const bekleKare = (sure) => cek(sure, async () => {});

let imX = W/2, imY = H/2;
const imlecKoy = async (x, y) => { imX = x; imY = y; await p.evaluate(([x,y]) => window.__ic(x,y), [x,y]); };

/** imleci suru sure icinde hedefe tasi (kare kare) */
async function imlecTasi(x, y, sure = .55) {
  const bx = imX, by = imY;
  await cek(sure, async (t) => {
    const e = easeIO(t);
    await p.evaluate(([x,y]) => window.__ic(x,y), [Math.round(bx+(x-bx)*e), Math.round(by+(y-by)*e)]);
  });
  imX = x; imY = y;
}
async function haloVur(sure = .38) {
  await cek(sure, async (t) => { await p.evaluate((v) => window.__halo(v), t < .45 ? 1 : 1 - (t-.45)/.55); });
  await p.evaluate(() => window.__halo(0));
}
async function kutuMerkez(sel) {
  const el = p.locator(sel).first();
  const bb = await el.boundingBox();
  return bb ? [Math.round(bb.x+bb.width/2), Math.round(bb.y+bb.height/2), el, bb] : [null,null,el,null];
}
/** imleci gotur, halo, tikla — hepsi kare kare */
async function tiklaK(sel, sonraBekle = .5) {
  const [x, y, el] = await kutuMerkez(sel);
  if (x !== null) await imlecTasi(x, y);
  await haloVur();
  await el.click({ force: true });
  await p.waitForTimeout(120);
  if (sonraBekle) await bekleKare(sonraBekle);
}
async function altyaziGoster(metin, sure) {
  await cek(.28, async (t) => { await p.evaluate(([m,o]) => window.__alt(m,o), [metin, easeOut(t)]); });
  await bekleKare(sure);
  await cek(.24, async (t) => { await p.evaluate(([m,o]) => window.__alt(m,o), [null, 1-easeOut(t)]); });
}
async function kaydirK(hedef, sure = 2) {
  const bas = await p.evaluate(() => window.scrollY);
  await cek(sure, async (t) => { await p.evaluate((y) => window.scrollTo(0, y), Math.round(bas + (hedef-bas)*easeIO(t))); });
}
async function kartGoster(baslik, alt, kicker, tut = 2.2) {
  await p.evaluate(([b,a,k]) => window.__kart(b,a,k,0), [baslik, alt, kicker]);
  await cek(.5, async (t) => { await p.evaluate((o) => window.__kart(null,null,null,o), easeOut(t)); });
  await bekleKare(tut);
  await cek(.55, async (t) => { await p.evaluate((o) => window.__kart(null,null,null,o), 1-easeIO(t)); });
  await p.evaluate(() => window.__kart(null,null,null,0));
}
async function gecisKarart(sure = .35, ters = false) {
  await cek(sure, async (t) => { await p.evaluate((o) => window.__vin(o), ters ? 1-easeOut(t) : easeOut(t)); });
  if (ters) await p.evaluate(() => window.__vin(0));
}

/* ===================== SENARYO ===================== */
await p.goto(`${BASE}/tr`, { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
await kur();
await imlecKoy(W/2, H/2);

// 1 — acilis
await p.evaluate(() => window.__vin(1));
await bekleKare(.3);
await kartGoster("Northern<em>Emlak</em>", "Kuzey Kıbrıs için tasarlanmış emlak platformu", "Beta Studio", 2.6);
await p.evaluate(() => window.__vin(0));

// 2 — ana sayfa
await bekleKare(1.1);
await altyaziGoster("Akdeniz Editoryal — büyük fotoğraf, sakin tipografi", 2.0);
await kaydirK(560, 2.2);
await altyaziGoster("Üç fark: tapu şeffaflığı · altı dil · AI sanal dekorasyon", 2.4);
await kaydirK(1210, 2.0);
await altyaziGoster("Boş odanın dört tasarımı — ana sayfadan görünür", 1.9);
await kaydirK(0, 1.6);

// 3 — arama
await altyaziGoster("Bölge seç, ara", 1.0);
await imlecTasi(300, 512, .6);
await haloVur();
await p.selectOption("select >> nth=0", { label: "Girne" }).catch(() => {});
await bekleKare(.85);
await tiklaK('button[type="submit"]', .2);
await gecisKarart(.3);
await p.waitForLoadState("networkidle");
await p.waitForTimeout(900);
await kur(); await imlecKoy(imX, imY);
await gecisKarart(.4, true);

// 4 — liste
await bekleKare(.8);
await altyaziGoster("Girne · 13 ilan", 1.8);
await kaydirK(620, 2.4);
await bekleKare(.5);
await kaydirK(0, 1.5);
await altyaziGoster("Sadece AI tasarımı olan ilanlar", 1.5);
await tiklaK('button:has-text("AI tasarım mevcut")', .3);
await p.waitForTimeout(700);
await bekleKare(1.6);

// 5 — ilana gir
await tiklaK("article >> nth=0", .2);
await gecisKarart(.3);
await p.waitForLoadState("networkidle");
await p.waitForTimeout(1000);
await kur(); await imlecKoy(W/2, 420);
await gecisKarart(.4, true);

// 6 — galeri
await bekleKare(.9);
await altyaziGoster("İlan detayı", 1.5);
await tiklaK('button[aria-label="›"]', .75);
await tiklaK('button[aria-label="›"]', .9);

// 7 — tapu
await kaydirK(700, 2.0);
await altyaziGoster("KKTC'nin bir numaralı sorusu: tapu tipi", 1.6);
await altyaziGoster("Her ilanda açık — 101evler'de bu alan yok", 2.2);

// 8 — AI TASARIM
await kaydirK(1090, 1.8);
await bekleKare(.6);
await altyaziGoster("Boş odanın dört tasarımı — yapay zekâ ile üretildi", 2.2);

for (const s of ["Modern Minimal", "İskandinav", "Modern Lüks"]) {
  await tiklaK(`button:has-text("${s}")`, .95);
}
await tiklaK('button:has-text("Akdeniz")', .7);

// surgu — kare kare gercek fare olaylari
const [, , , sbb] = await kutuMerkez("section:has-text('NorthernEmlak AI') div.cursor-ew-resize");
if (sbb) {
  const sy = Math.round(sbb.y + sbb.height * 0.52);
  const X = (f) => Math.round(sbb.x + sbb.width * f);
  await imlecTasi(X(.58), sy, .5);
  await p.evaluate(() => window.__halo(1));
  await p.mouse.move(X(.58), sy);
  await p.mouse.down();
  await bekleKare(.25);
  await altyaziGoster("Öncesi / sonrası — mimari birebir korunuyor", .1);

  const duraklar = [.58, .10, .92, .22, .78, .50];
  for (let i = 1; i < duraklar.length; i++) {
    const a = duraklar[i-1], z = duraklar[i];
    await cek(Math.abs(z-a) * 3.1 + .45, async (t) => {
      const f = a + (z-a) * easeIO(t);
      const x = X(f);
      await p.mouse.move(x, sy);
      await p.evaluate(([x,y]) => window.__ic(x,y), [x, sy]);
    });
    await bekleKare(.4);
  }
  await p.mouse.up();
  await p.evaluate(() => window.__halo(0));
  await bekleKare(.5);
  await cek(.24, async (t) => { await p.evaluate(([m,o]) => window.__alt(m,o), [null, 1-easeOut(t)]); });
}

// 9 — dil
await kaydirK(0, 1.6);
await altyaziGoster("Türkçe · İngilizce · Rusça", 1.3);
await tiklaK('header button[aria-label="Dil"]', .45);
await tiklaK('button:has-text("Русский")', .2);
await gecisKarart(.3);
await p.waitForLoadState("networkidle");
await p.waitForTimeout(900);
await kur(); await imlecKoy(imX, imY);
await gecisKarart(.4, true);
await bekleKare(.7);
await altyaziGoster("Aynı ilan, Rusça — başlık, açıklama, arayüz", 2.3);

// 10 — para birimi
await tiklaK('header button:has-text("GBP")', .4);
await tiklaK('button:has-text("TRY")', .6);
await altyaziGoster("Sterlin bazlı fiyat, anlık kur çevrimi", 2.0);
await kaydirK(560, 1.6);
await bekleKare(1.0);

// 11 — kapanis
await gecisKarart(.45);
await kartGoster("Northern<em>Emlak</em>",
  "AI sanal dekorasyon · tapu şeffaflığı · altı dil<br>Kuzey Kıbrıs pazarı için hazır.",
  "Sonraki adım: tam sürüm", 3.2);
await bekleKare(.5);

await b.close();
console.log("KARE:", n, "| sure:", (n / FPS).toFixed(1), "sn");
