import { Dil, Ilan } from "./tipler";
import { t } from "./sozluk";

/**
 * TOPLAM MALIYET HESABI
 *
 * Neden var: KKTC'de yabanci alicinin en buyuk surprizi ilan fiyatinin
 * uzerine binen vergi ve harclar. £150.000 gordugu ilan ona £168.000'e
 * patliyor. 101evler'de de, propertyfinder/bayut'ta da bunun karsiligi yok
 * (bkz. analiz/arayuz-analizi.md 1.9). Tapu seffafligi konumlandirmamizin
 * dogal devami.
 *
 * ORANLAR PROTOTIP VARSAYILANIDIR. Yayin oncesi bir KKTC avukatina
 * dogrulatilmali ve tercihen yonetim panelinden duzenlenebilir olmali.
 * Arayuz bu belirsizligi kullanicidan saklamiyor: her kalem orani ile
 * birlikte gorunur ve "tahmini" ibaresi her yerde duruyor.
 */
export const ORANLAR = {
  kdv: 0.05,              // KDV — yalnizca KDV'li satici (mutaahhit) ilk devrinde
  devirStandart: 0.06,    // Tapu devir harci — standart
  devirIlkHak: 0.03,      // Tapu devir harci — bir kereye mahsus indirimli hak
  damga: 0.005,           // Damga pulu — sozlesme bedeli uzerinden
} as const;

/** Orana bagli olmayan, yaklasik sabit kalemler (GBP). */
export const SABITLER = {
  avukat: 1500,
  izinBasvurusu: 500,     // yabanci alici icin satin alma izni basvurusu
} as const;

/** Yuzde gosterimi dile gore: TR "%6", EN/RU "6%". */
function oranYaz(oran: number, dil: Dil) {
  const yerel = dil === "tr" ? "tr-TR" : dil === "ru" ? "ru-RU" : "en-GB";
  const sayi = (oran * 100).toLocaleString(yerel, { maximumFractionDigits: 2 });
  return dil === "tr" ? `%${sayi}` : `${sayi}%`;
}

export interface MaliyetKalemi {
  anahtar: string;
  ad: string;
  aciklama: string;
  tutar: number;
  oran?: string;
}

export interface MaliyetSecenek {
  ilkAlimHakki: boolean;   // devir harcinda %3 hakkini kullaniyor mu
  yabanciAlici: boolean;   // satin alma izni basvurusu gerekiyor mu
}

export function maliyetHesapla(ilan: Ilan, dil: Dil, secenek: MaliyetSecenek) {
  const fiyat = ilan.fiyat;
  const kalemler: MaliyetKalemi[] = [];

  // KDV — yalnizca fiyata dahil degilse eklenir
  if (!ilan.kdvDahil) {
    kalemler.push({
      anahtar: "kdv",
      ad: t("mKdv", dil),
      aciklama: t("mKdvNot", dil),
      oran: oranYaz(ORANLAR.kdv, dil),
      tutar: fiyat * ORANLAR.kdv,
    });
  }

  const devirOran = secenek.ilkAlimHakki ? ORANLAR.devirIlkHak : ORANLAR.devirStandart;
  kalemler.push({
    anahtar: "devir",
    ad: t("mDevir", dil),
    aciklama: secenek.ilkAlimHakki ? t("mDevirIlkNot", dil) : t("mDevirNot", dil),
    oran: oranYaz(devirOran, dil),
    tutar: fiyat * devirOran,
  });

  kalemler.push({
    anahtar: "damga",
    ad: t("mDamga", dil),
    aciklama: t("mDamgaNot", dil),
    oran: oranYaz(ORANLAR.damga, dil),
    tutar: fiyat * ORANLAR.damga,
  });

  kalemler.push({
    anahtar: "avukat",
    ad: t("mAvukat", dil),
    aciklama: t("mAvukatNot", dil),
    tutar: SABITLER.avukat,
  });

  if (secenek.yabanciAlici) {
    kalemler.push({
      anahtar: "izin",
      ad: t("mIzin", dil),
      aciklama: t("mIzinNot", dil),
      tutar: SABITLER.izinBasvurusu,
    });
  }

  const ekToplam = kalemler.reduce((s, k) => s + k.tutar, 0);
  return { fiyat, kalemler, ekToplam, toplam: fiyat + ekToplam };
}
