import Link from "next/link";
import { notFound } from "next/navigation";
import Ustbilgi from "@/components/Ustbilgi";
import IlanKarti from "@/components/IlanKarti";
import MesajKutusu from "@/components/MesajKutusu";
import { Dil } from "@/lib/tipler";
import { t, KONUSULAN_DIL_ADI } from "@/lib/sozluk";
import { EMLAKCILAR, ILANLAR } from "@/lib/veri";
import { fiyatYaz, sehirAdi } from "@/lib/yardimci";

export function generateStaticParams() {
  return ["tr", "en", "ru"].flatMap((dil) => EMLAKCILAR.map((e) => ({ dil, slug: e.slug })));
}

/**
 * Danisman profili. Onceden yoktu: emlakci listesindeki kartlar tiklanamiyordu
 * ve kimsenin portfoyu gorunmuyordu. Emlakciya satilan bir urunde emlakcinin
 * kendi vitrini olmamasi buyuk eksikti.
 */
export default async function EmlakciDetay({ params }: { params: Promise<{ dil: string; slug: string }> }) {
  const { dil: d, slug } = await params;
  const dil = d as Dil;
  const e = EMLAKCILAR.find((x) => x.slug === slug);
  if (!e) notFound();

  const ilanlar = ILANLAR.filter((i) => i.emlakci === e.slug);
  const bas = e.ad.split(" ").map((x) => x[0]).join("").slice(0, 2);
  const satilik = ilanlar.filter((i) => i.islem === "satilik");
  const kiralik = ilanlar.filter((i) => i.islem === "kiralik");
  const ortalama = satilik.length
    ? Math.round(satilik.reduce((s, i) => s + i.fiyat, 0) / satilik.length)
    : 0;
  const bolgeler = [...new Set(ilanlar.map((i) => `${i.bolge}, ${sehirAdi(i.sehir, dil)}`))];

  return (
    <>
      <Ustbilgi dil={dil} />
      <div className="h-[68px]" />

      <main id="icerik" className="kapsayici py-8">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-sis">
          <Link href={`/${dil}`} className="transition hover:text-terra-500">{t("marka", dil)}</Link><span>/</span>
          <Link href={`/${dil}/emlakci`} className="transition hover:text-terra-500">{t("emlakcilar", dil)}</Link><span>/</span>
          <span className="text-murekkep">{e.ad}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[336px_1fr]">
          <aside className="lg:sticky lg:top-[88px] lg:self-start">
            <div className="rounded-xl border border-hat bg-white p-5 kart-golge">
              <div className="flex items-center gap-3.5">
                <div className="baslik flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-deniz-700 text-[19px] text-kum-50">
                  {bas}
                </div>
                <div className="min-w-0">
                  <h1 className="baslik truncate text-[21px] text-murekkep">{e.ad}</h1>
                  <p className="truncate text-[13.5px] text-sis">{e.firma}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="rounded bg-kum-100 px-2 py-1 text-[11.5px] text-deniz-700">
                  {e.kidemYil}{t("yil", dil)}
                </span>
                {e.ruhsatDogrulandi && (
                  <span className="flex items-center gap-1 rounded bg-deniz-50 px-2 py-1 text-[11.5px] text-deniz-700">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t("ruhsatli", dil)}
                  </span>
                )}
                <span className="rounded bg-terra-100 px-2 py-1 text-[11.5px] text-terra-600">{t("demoKayit", dil)}</span>
              </div>
              <p className="mt-2 font-mono text-[10.5px] tracking-tight text-sis">{e.ruhsatNo}</p>

              <p className="mt-3 border-t border-hat pt-3 text-[12.5px] text-sis">
                <span className="text-murekkep">{t("konusulanDiller", dil)}:</span>{" "}
                {e.konustuguDiller.map((k) => KONUSULAN_DIL_ADI[k][dil]).join(", ")}
              </p>

              <div className="mt-4 space-y-2">
                <a href={`https://wa.me/${e.whatsapp}`} target="_blank" rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-hat bg-white py-2.5 text-[14px] font-medium text-murekkep transition hover:bg-kum-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
                  </svg>
                  {t("whatsapp", dil)}
                </a>
                <MesajKutusu e={e} dil={dil} />
              </div>

              <p className="mt-4 border-t border-hat pt-3 text-[11.5px] leading-relaxed text-sis">
                {t("demoKisiNot", dil)}
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hat bg-hat sm:grid-cols-4">
              {([
                [t("danismanIlanlari", dil), String(ilanlar.length)],
                [t("satilik", dil), String(satilik.length)],
                [t("kiralik", dil), String(kiralik.length)],
                ...(ortalama ? [[t("ilanFiyati", dil), fiyatYaz(ortalama, "GBP", dil)] as [string, string]] : []),
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="bg-white px-4 py-3.5">
                  <p className="etiket text-sis">{k}</p>
                  <p className="mt-1 text-[17px] font-medium tabular-nums text-murekkep">{v}</p>
                </div>
              ))}
            </div>

            {bolgeler.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {bolgeler.map((b) => <span key={b} className="cip">{b}</span>)}
              </div>
            )}

            <h2 className="baslik mb-5 mt-9 text-[22px] text-deniz-700">{t("digerIlanlari", dil)}</h2>
            {ilanlar.length === 0 ? (
              <p className="py-10 text-center text-[15px] text-sis">{t("sonucYok", dil)}</p>
            ) : (
              <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
                {ilanlar.map((i, n) => <IlanKarti key={i.id} ilan={i} dil={dil} oncelik={n < 3} />)}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
