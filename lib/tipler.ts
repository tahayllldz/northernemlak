export type Dil = "tr" | "en" | "ru";
export type Metin = Record<Dil, string>;

export type TapuTipi = "turk-kocani" | "esdeger" | "tmd" | "leasehold";
export type IslemTipi = "satilik" | "kiralik";
export type EmlakTipi = "daire" | "villa" | "rezidans" | "mustakil" | "arsa" | "ticari";

export interface Emlakci {
  slug: string;
  ad: string;
  firma: string;
  kidemYil: number;
  telefon: string;
  whatsapp: string;
  ruhsatNo: string;
  ruhsatDogrulandi: boolean;
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
  ozellikler: string[];
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
