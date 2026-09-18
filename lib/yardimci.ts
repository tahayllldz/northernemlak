import { Dil, Ilan, OzellikKodu, TapuTipi } from "./tipler";
import { EMLAKCILAR, ILANLAR } from "./veri";
import { t } from "./sozluk";

export const KURLAR = { GBP: 1, EUR: 1.17, USD: 1.27, TRY: 61.8 } as const;
export type ParaBirimi = keyof typeof KURLAR;

const SIMGE: Record<ParaBirimi, string> = { GBP: "£", EUR: "€", USD: "$", TRY: "₺" };

export function fiyatYaz(gbp: number, para: ParaBirimi = "GBP", dil: Dil = "tr") {
  const deger = Math.round(gbp * KURLAR[para]);
  const yerel = dil === "tr" ? "tr-TR" : dil === "ru" ? "ru-RU" : "en-GB";
  return `${SIMGE[para]}${deger.toLocaleString(yerel)}`;
}

export function tapuAdi(tapu: TapuTipi, dil: Dil) {
  const harita = { "turk-kocani": "turkKocani", esdeger: "esdeger", tmd: "tmd", leasehold: "leasehold" } as const;
  return t(harita[tapu], dil);
}

export const emlakciBul = (slug: string) => EMLAKCILAR.find((e) => e.slug === slug)!;
export const ilanBul = (slug: string) => ILANLAR.find((i) => i.slug === slug);

export const SEHIRLER = [...new Set(ILANLAR.map((i) => i.sehir))];
export const TIPLER = [...new Set(ILANLAR.map((i) => i.tip))];

export const TIP_ADI: Record<string, Record<Dil, string>> = {
  daire:     { tr: "Daire",     en: "Flat",       ru: "Квартира" },
  villa:     { tr: "Villa",     en: "Villa",      ru: "Вилла" },
  rezidans:  { tr: "Rezidans",  en: "Residence",  ru: "Резиденция" },
  mustakil:  { tr: "Müstakil",  en: "Detached",   ru: "Дом" },
  arsa:      { tr: "Arsa",      en: "Land",       ru: "Участок" },
  ticari:    { tr: "Ticari",    en: "Commercial", ru: "Коммерческая" },
};

export const SEHIR_ADI: Record<string, Record<Dil, string>> = {
  "Girne":      { tr: "Girne",      en: "Kyrenia",   ru: "Кирения" },
  "Lefkoşa":    { tr: "Lefkoşa",    en: "Nicosia",   ru: "Никосия" },
  "Gazimağusa": { tr: "Gazimağusa", en: "Famagusta", ru: "Фамагуста" },
  "İskele":     { tr: "İskele",     en: "İskele",    ru: "Искеле" },
  "Güzelyurt":  { tr: "Güzelyurt",  en: "Güzelyurt", ru: "Гюзельюрт" },
};

export const sehirAdi = (s: string, dil: Dil) => SEHIR_ADI[s]?.[dil] ?? s;
export const tipAdi = (tip: string, dil: Dil) => TIP_ADI[tip]?.[dil] ?? tip;

/** m2 birim fiyati. Yatirimcinin tek karsilastirma metrigi; rakipte yok. */
export function m2FiyatYaz(gbp: number, m2: number, para: ParaBirimi = "GBP", dil: Dil = "tr") {
  if (!m2 || m2 <= 0) return null;
  const deger = Math.round((gbp * KURLAR[para]) / m2);
  const yerel = dil === "tr" ? "tr-TR" : dil === "ru" ? "ru-RU" : "en-GB";
  return `${SIMGE[para]}${deger.toLocaleString(yerel)}/m²`;
}

/** Mutlak tarih yerine goreli tazelik: "12 gun once". Guven sinyali. */
export function tazelikYaz(iso: string, dil: Dil, bugun = new Date()) {
  const gun = Math.max(0, Math.floor((bugun.getTime() - new Date(iso).getTime()) / 86_400_000));
  if (gun === 0) return t("bugunEklendi", dil);
  if (gun === 1) return t("dunEklendi", dil);
  if (gun < 14) return `${gun} ${t("gunOnce", dil)}`;
  if (gun < 60) return `${Math.floor(gun / 7)} ${t("haftaOnce", dil)}`;
  return `${Math.floor(gun / 30)} ${t("ayOnce", dil)}`;
}

/** Ilan 30 gunden eskiyse tazeleme dongusu icin isaret (CLAUDE.md Faz 1). */
export const bayatMi = (iso: string, bugun = new Date()) =>
  (bugun.getTime() - new Date(iso).getTime()) / 86_400_000 > 30;

export function tarihYaz(iso: string, dil: Dil) {
  const d = new Date(iso);
  return d.toLocaleDateString(dil === "tr" ? "tr-TR" : dil === "ru" ? "ru-RU" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" });
}

/** "3+1" -> 3 · "1+0" -> 1 · "—" -> 0 */
export const odaSayisi = (oda: string) => {
  const n = parseInt(oda, 10);
  return Number.isFinite(n) ? n : 0;
};

/** Hizli cip olarak disarida duran ozellikler (Airbnb modeli: 5 disarida, gerisi panelde) */
export const HIZLI_OZELLIKLER: OzellikKodu[] = [
  "deniz-manzarasi", "ozel-havuz", "jenerator", "otopark", "bahce",
];

export interface Filtre {
  islem?: string; sehir?: string; tip?: string;
  min?: number; max?: number;
  oda?: number; banyo?: number;
  m2min?: number; m2max?: number; yas?: number;
  tapu?: string; yabanci?: boolean;
  ozellikler?: OzellikKodu[];
  ai?: boolean; q?: string; sirala?: string;
}

/** URL arama parametrelerini Filtre'ye cevirir. Tek dogruluk kaynagi burasi. */
export function filtreOku(sp: Record<string, string | undefined>): Filtre {
  const sayi = (v?: string) => { const n = Number(v); return v && Number.isFinite(n) && n > 0 ? n : undefined; };
  return {
    islem: sp.islem, sehir: sp.sehir, tip: sp.tip, tapu: sp.tapu, q: sp.q, sirala: sp.sirala,
    min: sayi(sp.min), max: sayi(sp.max),
    oda: sayi(sp.oda), banyo: sayi(sp.banyo),
    m2min: sayi(sp.m2min), m2max: sayi(sp.m2max), yas: sayi(sp.yas),
    yabanci: sp.yabanci === "1",
    ai: sp.ai === "1",
    ozellikler: sp.oz ? (sp.oz.split(",").filter(Boolean) as OzellikKodu[]) : undefined,
  };
}

/** Kac filtre aktif — "Filtreler (3)" rozetini besler (The Agency modeli). */
export function aktifFiltreSayisi(sp: URLSearchParams | Record<string, string | undefined>): number {
  const giris = sp instanceof URLSearchParams ? Object.fromEntries(sp.entries()) : sp;
  let n = 0;
  for (const [k, v] of Object.entries(giris)) {
    if (!v || k === "sirala" || k === "q") continue;
    n += k === "oz" ? v.split(",").filter(Boolean).length : 1;
  }
  return n;
}

export function ilanlariSuz(f: Filtre, dil: Dil = "tr"): Ilan[] {
  let liste = ILANLAR.slice();
  if (f.islem)  liste = liste.filter((i) => i.islem === f.islem);
  if (f.sehir)  liste = liste.filter((i) => i.sehir === f.sehir);
  if (f.tip)    liste = liste.filter((i) => i.tip === f.tip);
  if (f.tapu)   liste = liste.filter((i) => i.tapu === f.tapu);
  if (f.min)    liste = liste.filter((i) => i.fiyat >= f.min!);
  if (f.max)    liste = liste.filter((i) => i.fiyat <= f.max!);
  if (f.oda)    liste = liste.filter((i) => odaSayisi(i.oda) >= f.oda!);
  if (f.banyo)  liste = liste.filter((i) => i.banyo >= f.banyo!);
  if (f.m2min)  liste = liste.filter((i) => i.m2 >= f.m2min!);
  if (f.m2max)  liste = liste.filter((i) => i.m2 <= f.m2max!);
  if (f.yas)    liste = liste.filter((i) => i.binaYasi <= f.yas!);
  if (f.yabanci) liste = liste.filter((i) => i.yabanciUygun);
  if (f.ozellikler?.length)
    liste = liste.filter((i) => f.ozellikler!.every((o) => i.ozellikler.includes(o)));
  if (f.ai)     liste = liste.filter((i) => !!i.aiTasarimlar?.length);
  if (f.q) {
    const q = f.q.toLocaleLowerCase("tr");
    liste = liste.filter((i) =>
      i.baslik[dil].toLocaleLowerCase("tr").includes(q) ||
      i.bolge.toLocaleLowerCase("tr").includes(q) ||
      i.sehir.toLocaleLowerCase("tr").includes(q));
  }
  if (f.sirala === "fiyat-artan")  liste.sort((a, b) => a.fiyat - b.fiyat);
  else if (f.sirala === "fiyat-azalan") liste.sort((a, b) => b.fiyat - a.fiyat);
  else liste.sort((a, b) => (a.vitrin === b.vitrin ? b.guncelleme.localeCompare(a.guncelleme) : a.vitrin ? -1 : 1));
  return liste;
}

export const TAPULAR: TapuTipi[] = ["turk-kocani", "esdeger", "tmd", "leasehold"];

/** Her sehirde kac ilan var — bos kategoriye tiklatmamak icin (propertyfinder modeli) */
export const sehirSayilari = () =>
  SEHIRLER.map((s) => ({ sehir: s, adet: ILANLAR.filter((i) => i.sehir === s).length }));

/* ---------------------------------------------------------------
   MESAFELER — harita Faz 1'de. Sahte harita koymak yerine gercek
   hesaplanmis kus ucusu mesafe gosteriyoruz (bkz. analiz/arayuz-analizi.md 5.1).
   --------------------------------------------------------------- */

const ONEMLI_NOKTALAR: Record<string, { lat: number; lng: number }> = {
  "Girne":      { lat: 35.3364, lng: 33.3192 },
  "Lefkoşa":    { lat: 35.1856, lng: 33.3823 },
  "Gazimağusa": { lat: 35.1254, lng: 33.9419 },
  "İskele":     { lat: 35.2896, lng: 33.8903 },
  "Güzelyurt":  { lat: 35.1986, lng: 32.9930 },
};
const ERCAN = { lat: 35.1547, lng: 33.4961 };

/** Haversine, km. */
function kusUcusuKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const kmYaz = (km: number) => (km < 10 ? km.toFixed(1) : String(Math.round(km)));

export function mesafeler(konum: { lat: number; lng: number }, sehir: string, dil: Dil) {
  const liste: { ad: string; km: string }[] = [];
  const merkez = ONEMLI_NOKTALAR[sehir];
  if (merkez) liste.push({ ad: `${sehirAdi(sehir, dil)} — ${t("sehirMerkezi", dil)}`, km: kmYaz(kusUcusuKm(konum, merkez)) });
  liste.push({ ad: t("havalimani", dil), km: kmYaz(kusUcusuKm(konum, ERCAN)) });

  // En yakin diger iki sehir merkezi — yabanci alici cevreyi tanimiyor
  const digerleri = Object.entries(ONEMLI_NOKTALAR)
    .filter(([s]) => s !== sehir)
    .map(([s, n]) => ({ ad: sehirAdi(s, dil), ham: kusUcusuKm(konum, n) }))
    .sort((a, b) => a.ham - b.ham)
    .slice(0, 2)
    .map((x) => ({ ad: x.ad, km: kmYaz(x.ham) }));

  return [...liste, ...digerleri];
}

/**
 * "3+1" yerel bir gosterim; Ingiliz/Rus alici bunu okumayi bilmiyor.
 * TR'de oldugu gibi kalir, diger dillerde acilir. Rakip bunu yapmiyor.
 */
export function odaYaz(oda: string, dil: Dil) {
  if (dil === "tr" || oda === "—") return oda;
  const [yatak, salon] = oda.split("+").map((x) => parseInt(x, 10));
  if (!Number.isFinite(yatak)) return oda;
  if (salon === 0) return dil === "en" ? "Studio" : "Студия";
  const ek = dil === "en" ? `${yatak} bed + lounge` : `${yatak} спальни + гостиная`;
  return `${oda} · ${ek}`;
}

/**
 * KKTC'de arazi donum/evlek ile olculur (1 donum = 1.337,8 m² = 4 evlek).
 * 101evler bunun icin ayri bir "Alan Donusturucu" araci koymus; biz alanin
 * yanina yaziyoruz. Yalnizca arsa ilanlarinda anlamli.
 */
export const M2_DONUM = 1337.8;

export function alanYaz(m2: number, tip: string, dil: Dil) {
  const temel = `${m2.toLocaleString(dil === "tr" ? "tr-TR" : dil === "ru" ? "ru-RU" : "en-GB")} m²`;
  if (tip !== "arsa" || m2 < M2_DONUM / 2) return temel;
  const donum = m2 / M2_DONUM;
  const yerel = dil === "tr" ? "tr-TR" : dil === "ru" ? "ru-RU" : "en-GB";
  return `${donum.toLocaleString(yerel, { maximumFractionDigits: 1 })} ${t("donum", dil)} · ${temel}`;
}
