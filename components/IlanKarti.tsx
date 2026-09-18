"use client";
import Image from "next/image";
import Link from "next/link";
import { Ilan, Dil } from "@/lib/tipler";
import { fiyatYaz, sehirAdi, tipAdi } from "@/lib/yardimci";
import { t } from "@/lib/sozluk";
import { useAyarlar } from "./Ayarlar";

export default function IlanKarti({ ilan, dil, oncelik = false }: { ilan: Ilan; dil: Dil; oncelik?: boolean }) {
  const { para } = useAyarlar();
  const aiVar = !!ilan.aiTasarimlar?.length;

  return (
    <Link href={`/${dil}/ilan/${ilan.slug}`} className="group block">
      <article className="overflow-hidden rounded-[10px] bg-white kart-golge transition-all duration-300 hover:kart-golge-yukari hover:-translate-y-0.5">
        <div className="relative aspect-[4/3] overflow-hidden bg-kum-200">
          <Image src={ilan.kapak} alt={ilan.baslik[dil]} fill sizes="(max-width:768px) 100vw, 33vw"
            priority={oncelik}
            className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {ilan.vitrin && (
              <span className="etiket rounded bg-terra-500 px-2 py-1 text-white">{t("vitrin", dil)}</span>
            )}
            <span className="etiket rounded bg-deniz-900/80 px-2 py-1 text-kum-100 backdrop-blur-sm">
              {t(ilan.islem === "satilik" ? "satilik" : "kiralik", dil)}
            </span>
          </div>

          {aiVar && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded bg-white/92 px-2 py-1 text-[10.5px] font-medium text-deniz-700 backdrop-blur-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l1.9 5.7L19.6 9l-5.7 1.9L12 16.6l-1.9-5.7L4.4 9l5.7-1.3L12 2z"/>
              </svg>
              AI
            </span>
          )}

          <span className="absolute bottom-2 right-2 rounded bg-black/45 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white/80 backdrop-blur-sm">
            {t("temsiliGorsel", dil)}
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="baslik text-[20px] leading-none text-deniz-700">
              {fiyatYaz(ilan.fiyat, para, dil)}
              {ilan.islem === "kiralik" && <span className="text-[13px] text-sis">{t("ayda", dil)}</span>}
            </p>
            <span className="etiket shrink-0 text-sis">{tipAdi(ilan.tip, dil)}</span>
          </div>

          <h3 className="mt-2 line-clamp-2 text-[14.5px] leading-snug text-murekkep transition-colors group-hover:text-terra-500">
            {ilan.baslik[dil]}
          </h3>

          <p className="mt-1.5 flex items-center gap-1 text-[13px] text-sis">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>
            </svg>
            {ilan.bolge}, {sehirAdi(ilan.sehir, dil)}
          </p>

          <div className="mt-3 flex items-center gap-3.5 border-t border-hat pt-3 text-[12.5px] text-sis">
            {ilan.oda !== "—" && <span><b className="font-semibold text-murekkep">{ilan.oda}</b> {t("oda", dil).toLowerCase()}</span>}
            {ilan.banyo > 0 && <span><b className="font-semibold text-murekkep">{ilan.banyo}</b> {t("banyo", dil).toLowerCase()}</span>}
            <span><b className="font-semibold text-murekkep">{ilan.m2}</b> m²</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
