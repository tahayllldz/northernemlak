import { Dil, Ilan, TapuTipi } from "./tipler";
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

export interface Filtre {
  islem?: string; sehir?: string; tip?: string; min?: number; max?: number; ai?: boolean; q?: string; sirala?: string;
}

export function ilanlariSuz(f: Filtre, dil: Dil = "tr"): Ilan[] {
  let liste = ILANLAR.slice();
  if (f.islem)  liste = liste.filter((i) => i.islem === f.islem);
  if (f.sehir)  liste = liste.filter((i) => i.sehir === f.sehir);
  if (f.tip)    liste = liste.filter((i) => i.tip === f.tip);
  if (f.min)    liste = liste.filter((i) => i.fiyat >= f.min!);
  if (f.max)    liste = liste.filter((i) => i.fiyat <= f.max!);
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
