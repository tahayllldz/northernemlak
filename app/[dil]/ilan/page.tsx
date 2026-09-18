import { Suspense } from "react";
import Link from "next/link";
import Ustbilgi from "@/components/Ustbilgi";
import Filtreler from "@/components/Filtreler";
import IlanKarti from "@/components/IlanKarti";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { filtreOku, ilanlariSuz, aktifFiltreSayisi } from "@/lib/yardimci";

export default async function ListeSayfasi({
  params, searchParams,
}: { params: Promise<{ dil: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { dil: d } = await params;
  const sp = await searchParams;
  const dil = d as Dil;

  const liste = ilanlariSuz(filtreOku(sp), dil);
  const filtreVar = aktifFiltreSayisi(sp) > 0;

  const baslik = sp.islem === "kiralik" ? t("kiralik", dil)
    : sp.islem === "satilik" ? t("satilik", dil)
    : t("tumIlanlarBaslik", dil);

  return (
    <>
      <Ustbilgi dil={dil} />
      <div className="h-[68px]" />
      <Suspense fallback={<div className="h-[104px] border-b border-hat" />}>
        <Filtreler dil={dil} adet={liste.length} />
      </Suspense>

      <main id="icerik" className="kapsayici py-8">
        <h1 className="baslik mb-6 text-[28px] text-deniz-700">{baslik}</h1>

        {liste.length === 0 ? (
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

            {/* Ucretli yerlesim ifsasi — funda.nl yapiyor, 101evler yapmiyor. */}
            {liste.some((i) => i.vitrin) && (
              <p className="mt-10 max-w-[70ch] border-t border-hat pt-4 text-[12px] leading-relaxed text-sis">
                {t("vitrinIfsa", dil)}
              </p>
            )}
          </>
        )}
      </main>
    </>
  );
}
