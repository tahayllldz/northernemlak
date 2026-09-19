import { Suspense } from "react";
import Link from "next/link";
import Ustbilgi from "@/components/Ustbilgi";
import Filtreler from "@/components/Filtreler";
import IlanKarti from "@/components/IlanKarti";
import SonBakilanlar from "@/components/SonBakilanlar";
import Sayfalama, { SAYFA_BOYU } from "@/components/Sayfalama";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { filtreOku, ilanlariSuz, aktifFiltreSayisi } from "@/lib/yardimci";

export default async function ListeSayfasi({
  params, searchParams,
}: { params: Promise<{ dil: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { dil: d } = await params;
  const sp = await searchParams;
  const dil = d as Dil;

  const tumu = ilanlariSuz(filtreOku(sp), dil);
  const filtreVar = aktifFiltreSayisi(sp) > 0;

  const toplamSayfa = Math.max(1, Math.ceil(tumu.length / SAYFA_BOYU));
  const sayfa = Math.min(Math.max(1, Number(sp.sayfa) || 1), toplamSayfa);
  const liste = tumu.slice((sayfa - 1) * SAYFA_BOYU, sayfa * SAYFA_BOYU);

  const baslik = sp.islem === "kiralik" ? t("kiralik", dil)
    : sp.islem === "satilik" ? t("satilik", dil)
    : t("tumIlanlarBaslik", dil);

  return (
    <>
      <Ustbilgi dil={dil} />
      <div className="h-[68px]" />
      <Suspense fallback={<div className="h-[152px] border-b border-hat" />}>
        <Filtreler dil={dil} adet={tumu.length} />
      </Suspense>

      <main id="icerik" className="kapsayici py-8">
        <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="baslik text-[28px] text-deniz-700">{baslik}</h1>
          {toplamSayfa > 1 && (
            <span className="text-[13px] text-sis">
              {t("sayfa", dil)} {sayfa} / {toplamSayfa}
            </span>
          )}
        </div>

        {tumu.length === 0 ? (
          <div className="mx-auto max-w-[460px] py-20 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"
              className="mx-auto text-kum-300" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <p className="mt-4 text-[16px] text-murekkep">{t("sonucYok", dil)}</p>
            {filtreVar && (
              <Link href={`/${dil}/ilan`}
                className="mt-5 inline-block rounded-md bg-deniz-700 px-5 py-2.5 text-[14px] font-medium text-kum-50 transition hover:bg-deniz-900">
                {t("filtreyiTemizle", dil)}
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {liste.map((i, n) => <IlanKarti key={i.id} ilan={i} dil={dil} oncelik={n < 4} />)}
            </div>

            <Sayfalama dil={dil} sayfa={sayfa} toplamSayfa={toplamSayfa} sorgu={sp} />

            {/* Ucretli yerlesim ifsasi — funda.nl yapiyor, 101evler yapmiyor. */}
            {liste.some((i) => i.vitrin) && (
              <p className="mt-10 max-w-[70ch] border-t border-hat pt-4 text-[12px] leading-relaxed text-sis">
                {t("vitrinIfsa", dil)}
              </p>
            )}
          </>
        )}

        <SonBakilanlar dil={dil} />
      </main>
    </>
  );
}
