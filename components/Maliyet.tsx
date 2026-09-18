"use client";
import { useState } from "react";
import { Dil, Ilan } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { fiyatYaz } from "@/lib/yardimci";
import { maliyetHesapla } from "@/lib/maliyet";
import { useAyarlar } from "./Ayarlar";

/**
 * Ilan fiyatinin uzerine binen vergi ve harclar. Rakipte karsiligi yok.
 * Oranlar prototip varsayilani — bilerek gorunur tutuldu, saklanmadi.
 */
export default function Maliyet({ ilan, dil }: { ilan: Ilan; dil: Dil }) {
  const { para } = useAyarlar();
  const [ilkAlimHakki, setIlkAlimHakki] = useState(false);
  const [yabanciAlici, setYabanciAlici] = useState(true);

  const h = maliyetHesapla(ilan, dil, { ilkAlimHakki, yabanciAlici });
  const yaz = (n: number) => fiyatYaz(Math.round(n), para, dil);

  return (
    <section id="bolum-maliyet">
      <h2 className="baslik mb-1.5 text-[22px] text-deniz-700">{t("maliyetBaslik", dil)}</h2>
      <p className="mb-4 max-w-[62ch] text-[13.5px] leading-relaxed text-sis">{t("maliyetAlt", dil)}</p>

      <div className="overflow-hidden rounded-xl border border-hat bg-white">
        {/* Fiyat + KDV durumu */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hat px-5 py-4">
          <div>
            <p className="etiket text-sis">{t("ilanFiyati", dil)}</p>
            <p className="baslik mt-1 text-[24px] leading-none text-deniz-700">{yaz(h.fiyat)}</p>
          </div>
          <span className={`cip ${ilan.kdvDahil ? "cip-tapu" : "cip-uyari"}`}>
            {t(ilan.kdvDahil ? "kdvDahilEtiket" : "kdvHaricEtiket", dil)}
          </span>
        </div>

        {/* Secenekler */}
        <div className="space-y-2.5 border-b border-hat bg-kum-50 px-5 py-3.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-murekkep">
            <input type="checkbox" checked={ilkAlimHakki} onChange={(e) => setIlkAlimHakki(e.target.checked)}
              className="h-4 w-4 accent-[#1B4D5C]" />
            {t("ilkAlimHakki", dil)}
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-murekkep">
            <input type="checkbox" checked={yabanciAlici} onChange={(e) => setYabanciAlici(e.target.checked)}
              className="h-4 w-4 accent-[#1B4D5C]" />
            {t("yabanciAliciyim", dil)}
          </label>
        </div>

        {/* Kalemler */}
        <ul className="divide-y divide-hat">
          {h.kalemler.map((k) => (
            <li key={k.anahtar} className="flex items-start justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <p className="text-[14px] text-murekkep">
                  {k.ad}
                  {k.oran && <span className="ml-2 text-[12px] text-sis">{k.oran}</span>}
                </p>
                <p className="mt-0.5 text-[12px] text-sis">{k.aciklama}</p>
              </div>
              <span className="shrink-0 text-[14px] font-medium tabular-nums text-murekkep">+{yaz(k.tutar)}</span>
            </li>
          ))}
        </ul>

        {/* Toplam */}
        <div className="border-t border-hat bg-deniz-50 px-5 py-4">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[13.5px] text-deniz-700">{t("ekMaliyetler", dil)}</span>
            <span className="text-[14px] font-medium tabular-nums text-deniz-700">+{yaz(h.ekToplam)}</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-deniz-100 pt-2.5">
            <span className="etiket text-deniz-500">{t("toplamOdeme", dil)}</span>
            <span className="baslik text-[26px] leading-none tabular-nums text-deniz-700">{yaz(h.toplam)}</span>
          </div>
        </div>

        <p className="border-t border-hat px-5 py-3 text-[11.5px] leading-relaxed text-sis">
          {t("maliyetUyari", dil)}
        </p>
      </div>
    </section>
  );
}
