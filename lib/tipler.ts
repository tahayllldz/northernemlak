export type Dil = "tr" | "en" | "ru";
export type Metin = Record<Dil, string>;

export type TapuTipi = "turk-kocani" | "esdeger" | "tmd" | "leasehold";
export type IslemTipi = "satilik" | "kiralik";
export type EmlakTipi = "daire" | "villa" | "rezidans" | "mustakil" | "arsa" | "ticari";

/**
 * Ozellikler kod olarak saklanir, goruntu metni olarak degil.
 * Onceden Turkce metin tutuluyordu ve RU/EN sayfalarda Turkce yaziyordu;
 * ozellik filtresi de coklu dilde calisamazdi. Metinler OZELLIK_ADI'nda.
 */
export type OzellikGrubu = "konfor" | "disMekan" | "manzara" | "arsa";
export type OzellikKodu =
  | "asansor" | "jenerator" | "somine" | "celik-kapi" | "guvenlik-kamerasi"
  | "yangin-alarmi" | "gunes-enerjisi"
  | "ozel-havuz" | "ortak-havuz" | "bahce" | "balkon" | "teras" | "barbeku"
  | "otopark" | "kapali-otopark"
  | "deniz-manzarasi" | "denize-sifir" | "dag-manzarasi" | "doga-manzarasi"
  | "sehir-manzarasi" | "sehir-ici"
  | "yol-erisimi" | "su-altyapisi" | "elektrik-altyapisi" | "su-kuyusu";

/** Danismanin konustugu diller. KKTC alicisi TR/EN/RU/FA/DE karisik;
 *  propertyfinder.ae bunu danisman kartinda gosteriyor, rakipte yok. */
export type KonusulanDil = "tr" | "en" | "ru" | "de" | "fa";

export interface Emlakci {
  slug: string;
  ad: string;
  firma: string;
  kidemYil: number;
  telefon: string;
  whatsapp: string;
  ruhsatNo: string;
  ruhsatDogrulandi: boolean;
  konustuguDiller: KonusulanDil[];
}

export interface AiTasarim {
  stil: "akdeniz" | "modern-minimal" | "iskandinav" | "modern-luks";
  ad: Metin;
  gorsel: string;
}

export interface Ilan {
  id: number;
  slug: string;
  baslik: Metin;
  aciklama: Metin;
  cevrilmis: boolean;          // otomatik ceviri etiketi
  islem: IslemTipi;
  tip: EmlakTipi;
  fiyat: number;               // GBP
  sehir: string;
  bolge: string;
  oda: string;
  banyo: number;
  m2: number;
  binaYasi: number;
  kat?: number;
  toplamKat?: number;
  esyali: "esyali" | "esyasiz" | "yarı";
  tapu: TapuTipi;
  yabanciUygun: boolean;
  aidat?: number;              // GBP / ay
  kdvDahil: boolean;           // fiyata KDV dahil mi — KKTC alicisinin en buyuk surprizi
  ozellikler: OzellikKodu[];
  gorseller: string[];
  kapak: string;
  emlakci: string;             // slug
  yayinTarihi: string;
  guncelleme: string;
  goruntulenme: number;
  vitrin?: boolean;
  aiOdaGorseli?: string;       // bos oda fotografi
  aiTasarimlar?: AiTasarim[];
  konum: { lat: number; lng: number };
}
