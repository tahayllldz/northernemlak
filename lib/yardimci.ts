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
