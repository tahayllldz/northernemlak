import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3200";
const W = 1600, H = 900;
const DIR = "/tmp/video";
fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({
  viewport: { width: W, height: H },
  recordVideo: { dir: DIR, size: { width: W, height: H } },
  deviceScaleFactor: 1,
});
const p = await ctx.newPage();

/* ---------- sahte imlec + kart katmani ---------- */
const KATMAN = `
(() => {
  if (document.getElementById("__ic")) return;
  const c = document.createElement("div");
  c.id = "__ic";
  c.style.cssText = "position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;pointer-events:none;transition:transform .55s cubic-bezier(.33,.9,.3,1);will-change:transform";
  c.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M5 2l7 18 2.2-7.4L21.6 10z" fill="#fff" stroke="#1B4D5C" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  document.documentElement.appendChild(c);
  const halo = document.createElement("div");
  halo.id = "__ih";
  halo.style.cssText = "position:fixed;left:0;top:0;width:44px;height:44px;margin:-9px 0 0 -9px;border-radius:50%;background:rgba(196,102,58,.35);z-index:2147483646;pointer-events:none;opacity:0;transition:transform .55s cubic-bezier(.33,.9,.3,1),opacity .3s";
  document.documentElement.appendChild(halo);
  window.__ic = (x, y) => { c.style.transform = 'translate('+x+'px,'+y+'px)'; halo.style.transform = 'translate('+x+'px,'+y+'px)'; };
  window.__ick = () => { halo.style.opacity = 1; setTimeout(() => halo.style.opacity = 0, 320); };
  window.__ic(${W / 2}, ${H / 2});
})();`;

const KART_CSS = `
#__kart{position:fixed;inset:0;z-index:2147483645;background:#1B4D5C;display:flex;flex-direction:column;
align-items:center;justify-content:center;gap:18px;font-family:Inter Variable,system-ui,sans-serif;
opacity:0;transition:opacity .6s ease}
#__kart.g{opacity:1}
#__kart h1{font-family:"Playfair Display Variable",Georgia,serif;font-size:62px;color:#F5F0E8;margin:0;
letter-spacing:-1px;font-weight:500}
#__kart h1 em{font-style:normal;color:#C4663A}
#__kart p{font-size:19px;color:#9ECBD6;margin:0;max-width:60ch;text-align:center;line-height:1.55}
#__kart .k{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#C4663A;margin-bottom:6px}
#__kart .n{position:absolute;bottom:42px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,240,232,.4)}
#__alt{position:fixed;left:0;right:0;bottom:34px;z-index:2147483644;display:flex;justify-content:center;
pointer-events:none;opacity:0;transition:opacity .45s ease;font-family:Inter Variable,system-ui,sans-serif}
#__alt.g{opacity:1}
#__alt span{background:rgba(14,44,54,.9);color:#F5F0E8;padding:11px 22px;border-radius:8px;font-size:17px;
backdrop-filter:blur(6px);box-shadow:0 8px 30px rgba(0,0,0,.3)}`;

const ALTYAZI = `
(() => {
  if (document.getElementById("__alt")) return;
  const s = document.createElement("style"); s.textContent = \`${KART_CSS}\`; document.head.appendChild(s);
  const a = document.createElement("div"); a.id = "__alt"; a.innerHTML = "<span></span>";
  document.documentElement.appendChild(a);
  window.__alt = (t) => { const e = document.getElementById("__alt");
    if (!t) { e.classList.remove("g"); return; } e.querySelector("span").textContent = t; e.classList.add("g"); };
})();`;

const bekle = (ms) => p.waitForTimeout(ms);

async function hazirla() {
  await p.addStyleTag({ content: KART_CSS }).catch(() => {});
  await p.evaluate(ALTYAZI);
  await p.evaluate(KATMAN);
}

let imX = W / 2, imY = H / 2;
async function imlecGit(x, y, ms = 620) {
  imX = x; imY = y;
  await p.evaluate(([x, y]) => window.__ic?.(x, y), [x, y]);
  await p.mouse.move(x, y, { steps: 12 });
  await bekle(ms);
}
async function tikla(sel, ms = 900) {
  const el = p.locator(sel).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await bekle(280);
  const box = await el.boundingBox();
  if (box) await imlecGit(Math.round(box.x + box.width / 2), Math.round(box.y + box.height / 2), 500);
  await p.evaluate(() => window.__ick?.());
  await bekle(160);
  await el.click({ force: true });
  await bekle(ms);
}
async function altyazi(t) { await p.evaluate((x) => window.__alt?.(x), t); }
async function kaydir(hedef, sure = 1800) {
  await p.evaluate(([h, s]) => new Promise((ok) => {
    const bas = window.scrollY, fark = h - bas, t0 = performance.now();
    const e = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const adim = (now) => { const t = Math.min(1, (now - t0) / s);
      window.scrollTo(0, bas + fark * e(t)); t < 1 ? requestAnimationFrame(adim) : ok(); };
    requestAnimationFrame(adim);
  }), [hedef, sure]);
  await bekle(260);
}
async function kart(baslik, alt, kicker, sure = 2600) {
  await p.evaluate(([b, a, k]) => {
    let el = document.getElementById("__kart");
    if (!el) { el = document.createElement("div"); el.id = "__kart"; document.documentElement.appendChild(el); }
    el.innerHTML = '<div class="k">' + (k || "") + '</div><h1>' + b + '</h1><p>' + (a || "") + '</p>' +
                   '<div class="n">Prototip — ilanlar ve gorseller temsilidir</div>';
    requestAnimationFrame(() => el.classList.add("g"));
  }, [baslik, alt, kicker]);
  await bekle(sure);
  await p.evaluate(() => document.getElementById("__kart")?.classList.remove("g"));
  await bekle(700);
  await p.evaluate(() => document.getElementById("__kart")?.remove());
}

/* ===================== SENARYO ===================== */
await p.goto(`${BASE}/tr`, { waitUntil: "networkidle" });
await hazirla();

// 1) acilis karti
await kart("Northern<em>Emlak</em>", "Kuzey Kıbrıs için tasarlanmış emlak platformu", "Beta Studio", 3000);

// 2) ana sayfa
await altyazi("Akdeniz'e göre tasarlanmış bir ana sayfa");
await bekle(1900);
await imlecGit(760, 420);
await altyazi(null);
await kaydir(520, 1700);
await bekle(700);
await altyazi("Üç fark: tapu şeffaflığı · altı dil · AI sanal dekorasyon");
await bekle(2400);
await altyazi(null);

// 3) AI vitrini
await kaydir(1180, 1700);
await bekle(1600);

// 4) arama
await kaydir(0, 1300);
await altyazi("Arama: bölge ve tip seç, sonuçlara git");
await bekle(900);
await p.selectOption('select >> nth=0', { label: "Girne" }).catch(() => {});
await imlecGit(280, 512); await bekle(500);
await p.evaluate(() => window.__ick?.());
await bekle(700);
await tikla('button[type="submit"]', 2400);
await altyazi(null);

// 5) liste
await p.waitForLoadState("networkidle");
await hazirla();
await altyazi("Filtrelenmiş sonuçlar — 4:3 büyük fotoğraf, temiz kart");
await bekle(2000);
await altyazi(null);
await kaydir(560, 1800);
await bekle(1200);
await kaydir(0, 1100);

// 6) AI filtresi
await altyazi("Sadece AI tasarımı olan ilanlar");
await tikla('button:has-text("AI tasarım mevcut")', 2200);
await altyazi(null);
await bekle(900);

// 7) ilana gir
await tikla('article >> nth=1', 2600);
await p.waitForLoadState("networkidle");
await hazirla();

// 8) galeri
await altyazi("İlan detayı");
await bekle(1500);
await altyazi(null);
await tikla('button[aria-label="›"]', 1100);
await tikla('button[aria-label="›"]', 1400);

// 9) tapu
await kaydir(720, 1700);
await altyazi("KKTC'nin bir numaralı sorusu: tapu tipi. Her ilanda açık.");
await bekle(2900);
await altyazi(null);

// 10) AI TASARIM — vurgu
await kaydir(1120, 1500);
await bekle(600);
await altyazi("Boş odanın dört tasarımı — yapay zekâ ile üretildi");
await bekle(2000);
await altyazi(null);

for (const s of ["Modern Minimal", "İskandinav", "Modern Lüks", "Akdeniz"]) {
  await tikla(`button:has-text("${s}")`, 1500);
}

// surgu
await altyazi("Öncesi / sonrası — mimari birebir korunuyor");
const kutu = await p.locator("section:has-text('NorthernEmlak AI') div.cursor-ew-resize").first().boundingBox();
if (kutu) {
  const y = Math.round(kutu.y + kutu.height / 2);
  await imlecGit(Math.round(kutu.x + kutu.width * 0.58), y, 400);
  await p.mouse.down();
  for (const f of [0.5, 0.36, 0.24, 0.16, 0.3, 0.5, 0.68, 0.84, 0.72, 0.55]) {
    const x = Math.round(kutu.x + kutu.width * f);
    await p.evaluate(([x, y]) => window.__ic?.(x, y), [x, y]);
    await p.mouse.move(x, y, { steps: 8 });
    await bekle(230);
  }
  await p.mouse.up();
}
await bekle(1200);
await altyazi(null);

// 11) dil
await kaydir(0, 1200);
await altyazi("Türkçe · İngilizce · Rusça");
await tikla('header button[aria-label="Dil"]', 800);
await tikla('button:has-text("Русский")', 2600);
await p.waitForLoadState("networkidle");
await hazirla();
await altyazi("Aynı ilan, Rusça");
await bekle(2200);
await altyazi(null);

// 12) para birimi
await tikla('header button:has-text("GBP")', 700);
await tikla('button:has-text("TRY")', 1800);
await altyazi("Sterlin bazlı fiyat, anlık kur çevrimi");
await bekle(2000);
await altyazi(null);

// 13) kapanis
await kart("Northern<em>Emlak</em>",
  "AI sanal dekorasyon · tapu şeffaflığı · altı dil<br>Kuzey Kıbrıs pazarı için hazır.",
  "Sonraki adım: tam sürüm", 3600);

await ctx.close();
await b.close();
const dosya = fs.readdirSync(DIR).find((f) => f.endsWith(".webm"));
console.log("VIDEO:", `${DIR}/${dosya}`);
