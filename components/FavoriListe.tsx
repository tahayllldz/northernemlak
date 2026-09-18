"use client";
import Link from "next/link";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { ILANLAR } from "@/lib/veri";
import IlanKarti from "./IlanKarti";
import IlanIskelet from "./IlanIskelet";
import { useFavoriler } from "./Favoriler";

export default function FavoriListe({ dil }: { dil: Dil }) {
  const { favoriler, hazir } = useFavoriler();

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
      <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {liste.map((i, n) => <IlanKarti key={i.id} ilan={i} dil={dil} oncelik={n < 4} />)}
      </div>
      <p className="mt-10 max-w-[70ch] border-t border-hat pt-4 text-[12px] leading-relaxed text-sis">
        {t("favoriNot", dil)}
      </p>
    </>
  );
}
