import Link from "next/link";
import Image from "next/image";
import Ustbilgi from "@/components/Ustbilgi";
import { Dil } from "@/lib/tipler";
import { t, KONUSULAN_DIL_ADI } from "@/lib/sozluk";
import { EMLAKCILAR, ILANLAR } from "@/lib/veri";

export default async function EmlakciListe({ params }: { params: Promise<{ dil: string }> }) {
  const { dil: d } = await params;
  const dil = d as Dil;

  return (
    <>
      <Ustbilgi dil={dil} />
      <div className="h-[68px]" />
      <main id="icerik" className="kapsayici py-10">
        <h1 className="baslik mb-2 text-[32px] text-deniz-700">{t("emlakcilar", dil)}</h1>
        <p className="mb-3 max-w-[56ch] text-[14.5px] text-sis">{t("neden1Metin", dil)}</p>
        <p className="mb-8 max-w-[70ch] text-[12px] leading-relaxed text-sis">{t("demoKisiNot", dil)}</p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EMLAKCILAR.map((e) => {
            const ilanlar = ILANLAR.filter((i) => i.emlakci === e.slug);
            const bas = e.ad.split(" ").map((x) => x[0]).join("").slice(0, 2);
            return (
              <div key={e.slug} className="rounded-xl border border-hat bg-white p-5 kart-golge">
                <Link href={`/${dil}/emlakci/${e.slug}`} className="block">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-deniz-700 baslik text-[17px] text-kum-50">{bas}</div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-murekkep">{e.ad}</p>
                    <p className="truncate text-[13px] text-sis">{e.firma}</p>
                  </div>
                </div>
                </Link>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  <span className="rounded bg-kum-100 px-2 py-1 text-[11.5px] text-deniz-700">{e.kidemYil}{t("yil", dil)}</span>
                  <span className="rounded bg-terra-100 px-2 py-1 text-[11.5px] text-terra-600">{t("demoKayit", dil)}</span>
                  {e.ruhsatDogrulandi && (
                    <span className="flex items-center gap-1 rounded bg-deniz-50 px-2 py-1 text-[11.5px] text-deniz-700">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {t("ruhsatli", dil)}
                    </span>
                  )}
                  <span className="rounded bg-kum-100 px-2 py-1 text-[11.5px] text-deniz-700">{ilanlar.length} {t("ilan", dil)}</span>
                </div>
                <p className="mt-3 text-[12.5px] text-sis">
                  <span className="text-murekkep">{t("konusulanDiller", dil)}:</span>{" "}
                  {e.konustuguDiller.map((k) => KONUSULAN_DIL_ADI[k][dil]).join(", ")}
                </p>
                <div className="mt-4 flex gap-1.5">
                  {ilanlar.slice(0, 3).map((i) => (
                    <Link key={i.id} href={`/${dil}/ilan/${i.slug}`} className="relative h-[58px] flex-1 overflow-hidden rounded-md">
                      <Image src={i.kapak} alt="" fill sizes="110px" className="object-cover transition hover:scale-105" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
