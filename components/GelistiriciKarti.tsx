import { Dil, Gelistirici } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

/**
 * GELISTIRICI SICILI
 *
 * Maketten alicinin tek gercek sorusu "teslim eder mi?" ve bu sorunun cevabi
 * hicbir pazarda yayinlanmiyor. PropertyFinder "Developed by X, Delivery Q3 2024"
 * diyor ama sicil vermiyor.
 *
 * Yalnizca tartisilmaz olan yayinlanir: ilan edilen teslim tarihi vs gerceklesen.
 * Yorum yok, puan yok — sayi var.
 */
function sicilNotu(g: Gelistirici) {
  if (g.ortalamaGecikmeAy <= 3 && g.teslimEdilenProje >= 5) return { anahtar: "sicilIyi", sinif: "cip-tapu" } as const;
  if (g.ortalamaGecikmeAy >= 12 || g.teslimEdilenProje <= 2) return { anahtar: "sicilZayif", sinif: "cip-uyari" } as const;
  return { anahtar: "sicilOrta", sinif: "" } as const;
}

export default function GelistiriciKarti({ g, dil }: { g: Gelistirici; dil: Dil }) {
  const sicil = sicilNotu(g);
  const sayilar: [string, string][] = [
    [t("kurulus", dil), String(g.kurulusYili)],
    [t("teslimEdilen", dil), String(g.teslimEdilenProje)],
    [t("teslimKonut", dil), g.teslimEdilenKonut.toLocaleString(dil === "tr" ? "tr-TR" : dil === "ru" ? "ru-RU" : "en-GB")],
    [t("ortGecikme", dil), g.ortalamaGecikmeAy === 0 ? t("gecikmeYok", dil) : `${g.ortalamaGecikmeAy} ${t("tapuAy", dil)}`],
    [t("devamEden", dil), String(g.devamEdenProje)],
  ];

  return (
    <section id="bolum-gelistirici">
      <h2 className="baslik mb-1.5 text-[22px] text-deniz-700">{t("gelistiriciBaslik", dil)}</h2>
      <p className="mb-4 max-w-[62ch] text-[13.5px] leading-relaxed text-sis">{t("gelistiriciAlt", dil)}</p>

      <div className="overflow-hidden rounded-xl border border-hat bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hat px-5 py-4">
          <p className="baslik text-[19px] text-deniz-700">{g.ad}</p>
          <span className={`cip ${sicil.sinif}`}>{t(sicil.anahtar, dil)}</span>
        </div>

        <div className="grid grid-cols-2 gap-px bg-hat sm:grid-cols-5">
          {sayilar.map(([k, v]) => (
            <div key={k} className="bg-white px-4 py-3.5">
              <p className="etiket text-sis">{k}</p>
              <p className="mt-1 text-[17px] font-medium tabular-nums text-murekkep">{v}</p>
            </div>
          ))}
        </div>

        <p className="border-t border-hat px-5 py-2.5 text-[11.5px] leading-relaxed text-sis">
          {t("gelistiriciUyari", dil)}
        </p>
      </div>
    </section>
  );
}
