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

/**
 * TAPU ZINCIRI — mulkun su an sureclerin neresinde oldugu.
 * KKTC'de asil soru tapunun tipi degil, nerede takildigi. Yabanci alici
 * Bakanlar Kurulu iznini beklerken yillar gecebiliyor ve hicbir portal
 * bunu gostermiyor.
 */
export type TapuAsama =
  | "insaat"         // insaat halinde / maketten
  | "kayit"          // sozlesme tapu dairesine kayitli, izin basvurusu yok
  | "izin-bekliyor"  // Bakanlar Kurulu izni surecte
  | "izin-alindi"    // izin cikti, devir bekliyor
  | "devredildi";    // tapu satici adina, temiz devir

/**
 * PROJE / MAKETTEN SATIS KATMANI
 *
 * Analizdeki en buyuk yapisal boslugun karsiligi: 101evler'de "Projeler" ve
 * "Projeden Ikinci El" birinci sinif kategori, propertyfinder'da "Off-plan /
 * Ready / Offplan: Re-Sale" var. KKTC'de yabanciya satisin agirligi maketten.
 * Ustbilgideki Projeler baglantisi daha once ?tip=rezidans'a gidiyordu — sahteydi.
 */
export type ProjeDurum = "on-satis" | "insaat" | "tamamlandi";

export interface Proje {
  slug: string;
  ad: string;
  gelistirici: string;          // slug
  sehir: string;
  bolge: string;
  durum: ProjeDurum;
  teslim: string;               // "2027-Q2" gibi
  konutSayisi: number;
  satilan: number;
  baslangicFiyat: number;       // GBP
  pesinatOrani: number;         // 0.30 -> %30
  taksitAy: number;             // teslime kadar taksit ayi
  odaSecenekleri: string[];
  aciklama: Metin;
  ozellikler: OzellikKodu[];
  kapak: string;
  gorseller: string[];
  konum: { lat: number; lng: number };
}

/** Muteahhit sicili — maketten alicinin tek gercek sorusu: teslim eder mi? */
export interface Gelistirici {
  slug: string;
  ad: string;
  kurulusYili: number;
  teslimEdilenProje: number;
  teslimEdilenKonut: number;
  ortalamaGecikmeAy: number;   // ilan edilen teslim vs gerceklesen
  devamEdenProje: number;
  sonTeslimYili: number;
}

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
  oncekiFiyat?: number;        // fiyat dustuyse eski deger (The Agency modeli)
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
  tapuAsama: TapuAsama;
  gelistirici?: string;        // slug — yalnizca proje/sifir konutlarda
  proje?: string;              // slug — bu ilan bir projenin dairesiyse
  projedenIkinciEl?: boolean;  // "Projeden Ikinci El" — 101evler'in ayri kategorisi
  yabanciUygun: boolean;
  aidat?: number;              // GBP / ay
  depozito?: number;           // GBP — kiralikta
  pesinAy?: number;            // kac ay pesin isteniyor
  minSureAy?: number;          // asgari kira suresi
  kdvDahil: boolean;           // fiyata KDV dahil mi — KKTC alicisinin en buyuk surprizi
  ozellikler: OzellikKodu[];
  gorseller: string[];
  kapak: string;
  gercekGorsel?: boolean;      // gercek mulk fotografi — "temsili" damgasi basilmaz
  emlakci: string;             // slug
  yayinTarihi: string;
  guncelleme: string;
  goruntulenme: number;
  vitrin?: boolean;
  aiOdaGorseli?: string;       // bos oda fotografi
  aiTasarimlar?: AiTasarim[];
  gezinti360?: string;         // 4:1 silindirik panorama (AI uretimi, temsili)
  gezintiOdalari?: string[];   // oda oda 360 — her odayi ayri gezebilmek icin
  konum: { lat: number; lng: number };
}
