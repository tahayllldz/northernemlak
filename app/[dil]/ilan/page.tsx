import { Suspense } from "react";
import Ustbilgi from "@/components/Ustbilgi";
import Filtreler from "@/components/Filtreler";
import IlanKarti from "@/components/IlanKarti";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { ilanlariSuz } from "@/lib/yardimci";

export default async function ListeSayfasi({
  params, searchParams,
}: { params: Promise<{ dil: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { dil: d } = await params;
  const sp = await searchParams;
  const dil = d as Dil;

  const liste = ilanlariSuz({
    islem: sp.islem, sehir: sp.sehir, tip: sp.tip,
    max: sp.max ? Number(sp.max) : undefined,
    ai: sp.ai === "1", q: sp.q, sirala: sp.sirala,
  }, dil);

  const baslik = sp.islem === "kiralik" ? t("kiralik", dil) : sp.islem === "satilik" ? t("satilik", dil) : t("tumIlanlar", dil);

  return (
    <>
      <Ustbilgi dil={dil} />
      <div className="h-[68px]" />
      <Suspense fallback={<div className="h-[61px] border-b border-hat" />}>
        <Filtreler dil={dil} adet={liste.length} />
      </Suspense>

      <main id="icerik" className="kapsayici py-8">
        <h1 className="baslik mb-6 text-[28px] text-deniz-700">{baslik}</h1>
        {liste.length === 0 ? (
          <div className="rounded-lg border border-hat bg-white py-20 text-center">
            <p className="text-[15px] text-sis">{t("sonucYok", dil)}</p>
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
