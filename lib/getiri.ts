import { Dil, Ilan } from "./tipler";
import { ILANLAR } from "./veri";
import { maliyetHesapla } from "./maliyet";
import { odaSayisi } from "./yardimci";

/**
 * KIRA GETIRISI — KKTC'ye ozel mevsimsel model.
 *
 * KKTC alicisinin buyuk kismi yatirimci. Gazimagusa ve Iskele'nin kira piyasasi
 * universite takvimiyle calisiyor (DAU, UKU): donemde dolu, yazin bos.
 * Rightmove/funda getiri hesabi yapmiyor; propertyfinder mortgage hesapliyor
 * (KKTC'de mortgage yok). Mevsimsel kira modeli hicbir portalda yok.
 *
 * Kira tahmini UYDURULMUYOR: ayni sehir + tip + benzer oda sayisindaki kendi
 * kiralik ilanlarimizin medyani aliniyor. Yeterli ornek yoksa hesap gosterilmez.
 */

/** Universite kentleri — kira yaz aylarinda duser */
const OGRENCI_SEHIRLERI = ["Gazimağusa", "İskele", "Lefkoşa"];

export const GIDER_ORANLARI = {
  yonetim: 0.08,   // emlak yonetimi / kiracı bulma
  bakim: 0.05,     // yillik bakim karsiligi
} as const;

export interface GetiriSonuc {
  ornekSayisi: number;
  aylikKira: number;        // dolu ay kirasi (GBP)
  yazKirasi: number | null; // ogrenci kentlerinde dusuk sezon
  yillikBrut: number;
  yillikNet: number;
  alimMaliyeti: number;
  brutGetiri: number;       // %
  netGetiri: number;        // %
  geriOdemeYil: number;
  ogrenciSehri: boolean;
}

/** Ayni sehir + tip + +-1 oda araligindaki kiralik ilanlarin medyani */
function kiraTahmini(ilan: Ilan) {
  const hedefOda = odaSayisi(ilan.oda);
  const benzer = ILANLAR.filter(
    (k) =>
      k.islem === "kiralik" &&
      k.sehir === ilan.sehir &&
      Math.abs(odaSayisi(k.oda) - hedefOda) <= 1
  );
  const havuz = benzer.length >= 2
    ? benzer
    : ILANLAR.filter((k) => k.islem === "kiralik" && Math.abs(odaSayisi(k.oda) - hedefOda) <= 1);

  if (havuz.length < 2) return null;

  // m2 basina kira medyani -> bu mulkun m2'siyle olcekle
  const birim = havuz.map((k) => k.fiyat / Math.max(1, k.m2)).sort((a, b) => a - b);
  const orta = birim.length % 2
    ? birim[(birim.length - 1) / 2]
    : (birim[birim.length / 2 - 1] + birim[birim.length / 2]) / 2;

  return { aylik: Math.round(orta * ilan.m2), ornek: havuz.length };
}

export function getiriHesapla(ilan: Ilan, dil: Dil): GetiriSonuc | null {
  if (ilan.islem !== "satilik" || ilan.tip === "arsa") return null;
  const tahmin = kiraTahmini(ilan);
  if (!tahmin) return null;

  const ogrenciSehri = OGRENCI_SEHIRLERI.includes(ilan.sehir);
  const aylikKira = tahmin.aylik;
  const yazKirasi = ogrenciSehri ? Math.round(aylikKira * 0.6) : null;

  // Ogrenci kentlerinde 9 ay tam + 3 ay dusuk sezon; digerlerinde 11 ay (1 ay bosluk)
  const yillikBrut = ogrenciSehri
    ? aylikKira * 9 + (yazKirasi ?? 0) * 3
    : aylikKira * 11;

  const aidatYillik = (ilan.aidat ?? 0) * 12;
  const yillikNet = Math.round(
    yillikBrut * (1 - GIDER_ORANLARI.yonetim - GIDER_ORANLARI.bakim) - aidatYillik
  );

  const alimMaliyeti = Math.round(
    maliyetHesapla(ilan, dil, { ilkAlimHakki: false, yabanciAlici: true }).toplam
  );

  return {
    ornekSayisi: tahmin.ornek,
    aylikKira,
    yazKirasi,
    yillikBrut: Math.round(yillikBrut),
    yillikNet,
    alimMaliyeti,
    brutGetiri: (yillikBrut / alimMaliyeti) * 100,
    netGetiri: (yillikNet / alimMaliyeti) * 100,
    geriOdemeYil: yillikNet > 0 ? alimMaliyeti / yillikNet : 0,
    ogrenciSehri,
  };
}
