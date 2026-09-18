import { Dil, Ilan, OzellikKodu } from "@/lib/tipler";
import { t, ozellikAdi } from "@/lib/sozluk";

/**
 * ALTYAPI HAZIRLIGI
 *
 * "Jenerator" ilanlarda bir ozellik olarak duruyor cunku KKTC'de elektrik
 * kesiliyor. Kimse bunu boyle cercevelemiyor — liste icinde bir madde olarak
 * gecip gidiyor. Yerli alici bunu biliyor, yabanci alici tasindiktan sonra
 * ogreniyor.
 *
 * Burada hicbir sey uydurulmuyor: yalnizca ilanin kendi ozellik kodlarina
 * bakiliyor. Bolge bazli kesinti istatistigi icin acik veri yok, o yuzden
 * yok (bkz. analiz/arayuz-analizi.md — uydurma veriyle grafik cizmiyoruz).
 */
const ALTYAPI_KODLARI: OzellikKodu[] = [
  "jenerator", "gunes-enerjisi", "su-kuyusu", "su-altyapisi", "elektrik-altyapisi",
];

export default function Altyapi({ ilan, dil }: { ilan: Ilan; dil: Dil }) {
  const durum = ALTYAPI_KODLARI.map((kod) => ({ kod, var: ilan.ozellikler.includes(kod) }));
  if (!durum.some((d) => d.var)) return null;

  return (
    <section id="bolum-altyapi">
      <h2 className="baslik mb-1.5 text-[22px] text-deniz-700">{t("altyapiBaslik", dil)}</h2>
      <p className="mb-4 max-w-[62ch] text-[13.5px] leading-relaxed text-sis">{t("altyapiAlt", dil)}</p>

      <ul className="grid gap-px overflow-hidden rounded-xl border border-hat bg-hat sm:grid-cols-2">
        {durum.map((d) => (
          <li key={d.kod} className="flex items-center justify-between gap-3 bg-white px-4 py-3">
            <span className={`text-[14px] ${d.var ? "text-murekkep" : "text-sis"}`}>{ozellikAdi(d.kod, dil)}</span>
            {d.var ? (
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-deniz-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("altyapiVar", dil)}
              </span>
            ) : (
              <span className="text-[13px] text-sis">{t("altyapiYok", dil)}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
