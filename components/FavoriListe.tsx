"use client";
import { useState } from "react";
import Link from "next/link";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { ILANLAR } from "@/lib/veri";
import IlanKarti from "./IlanKarti";
import IlanIskelet from "./IlanIskelet";
import { useFavoriler } from "./Favoriler";
import Karsilastirma from "./Karsilastirma";
import Rota from "./Rota";

export default function FavoriListe({ dil }: { dil: Dil }) {
  const { favoriler, hazir } = useFavoriler();
  const [karsilastir, setKarsilastir] = useState(false);

  // Sunucuda bos, istemcide localStorage'dan gelir — arada iskelet goster
  if (!hazir) return <IlanIskelet adet={4} />;

  const liste = ILANLAR.filter((i) => favoriler.includes(i.id));

  if (liste.length === 0) {
    return (
      <div className="mx-auto max-w-[460px] py-20 text-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"
          className="mx-auto text-kum-300" aria-hidden>
          <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13z"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-4 text-[16px] text-murekkep">{t("favoriYok", dil)}</p>
        <Link href={`/${dil}/ilan`}
          className="mt-5 inline-block rounded-md bg-deniz-700 px-5 py-2.5 text-[14px] font-medium text-kum-50 transition hover:bg-deniz-900">
          {t("tumIlanlar", dil)}
        </Link>
      </div>
    );
  }

  return (
    <>
      <Rota ilanlar={liste} dil={dil} />

      {liste.length >= 2 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setKarsilastir((v) => !v)}
            className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-medium transition
              ${karsilastir ? "bg-deniz-700 text-kum-50" : "border border-hat bg-white text-murekkep hover:border-deniz-300"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M9 4v16M15 4v16M4 9h16M4 15h16" strokeLinecap="round" />
            </svg>
            {karsilastir ? t("karsilastirmaKapat", dil) : `${t("ilanKarsilastir", dil)} (${Math.min(liste.length, 6)})`}
          </button>
          {karsilastir && <span className="text-[12.5px] text-sis">{t("karsilastirmaNot", dil)}</span>}
        </div>
      )}

      {karsilastir && (
        <div className="mb-10 overflow-hidden rounded-xl border border-hat">
          <Karsilastirma ilanlar={liste.slice(0, 6)} dil={dil} />
        </div>
      )}

      <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {liste.map((i, n) => <IlanKarti key={i.id} ilan={i} dil={dil} oncelik={n < 4} />)}
      </div>
      <p className="mt-10 max-w-[70ch] border-t border-hat pt-4 text-[12px] leading-relaxed text-sis">
        {t("favoriNot", dil)}
      </p>
    </>
  );
}
