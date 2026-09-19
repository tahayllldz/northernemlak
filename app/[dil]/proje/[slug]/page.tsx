import Link from "next/link";
import { notFound } from "next/navigation";
import Ustbilgi from "@/components/Ustbilgi";
import Galeri from "@/components/Galeri";
import IlanKarti from "@/components/IlanKarti";
import GelistiriciKarti from "@/components/GelistiriciKarti";
import Konum from "@/components/Konum";
import { Dil } from "@/lib/tipler";
import { t, ozellikAdi } from "@/lib/sozluk";
import { PROJELER } from "@/lib/veri";
import { fiyatYaz, gelistiriciBul, projeIlanlari, projeDurumAdi, sehirAdi, teslimYaz } from "@/lib/yardimci";

export function generateStaticParams() {
  return ["tr", "en", "ru"].flatMap((dil) => PROJELER.map((p) => ({ dil, slug: p.slug })));
}

export default async function ProjeDetay({ params }: { params: Promise<{ dil: string; slug: string }> }) {
  const { dil: d, slug } = await params;
  const dil = d as Dil;
  const proje = PROJELER.find((p) => p.slug === slug);
  if (!proje) notFound();

  const gelistirici = gelistiriciBul(proje.gelistirici);
  const ilanlar = projeIlanlari(proje.slug);
  const yuzde = Math.round((proje.satilan / proje.konutSayisi) * 100);
  const pesinatTutar = Math.round(proje.baslangicFiyat * proje.pesinatOrani);
  const aylikTaksit = proje.taksitAy
    ? Math.round((proje.baslangicFiyat - pesinatTutar) / proje.taksitAy)
    : 0;

  const kunye: [string, string][] = [
    [t("teslimTarihi", dil), teslimYaz(proje.teslim, dil)],
    [t("konutSayisi", dil), String(proje.konutSayisi)],
    [t("satilanOran", dil), `${proje.satilan} (%${yuzde})`],
    [t("baslangicFiyat", dil), fiyatYaz(proje.baslangicFiyat, "GBP", dil)],
    [t("pesinat", dil), `%${Math.round(proje.pesinatOrani * 100)} · ${fiyatYaz(pesinatTutar, "GBP", dil)}`],
    ...(aylikTaksit
      ? [[t("taksitPlani", dil), `${proje.taksitAy} × ${fiyatYaz(aylikTaksit, "GBP", dil)}`] as [string, string]]
      : []),
  ];

  return (
    <>
      <Ustbilgi dil={dil} />
      <div className="h-[68px]" />

      <main id="icerik" className="kapsayici py-7">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-sis">
          <Link href={`/${dil}`} className="transition hover:text-terra-500">{t("marka", dil)}</Link><span>/</span>
          <Link href={`/${dil}/proje`} className="transition hover:text-terra-500">{t("projelerBaslik", dil)}</Link><span>/</span>
          <span className="text-murekkep">{proje.ad}</span>
        </nav>

        <div className="space-y-8">
          <Galeri gorseller={proje.gorseller} baslik={proje.ad} dil={dil} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="etiket rounded bg-deniz-700 px-2 py-1 text-kum-50">
                {projeDurumAdi(proje.durum, dil)}
              </span>
              <span className="etiket rounded bg-kum-200 px-2 py-1 text-deniz-700">
                {t("teslimTarihi", dil)}: {teslimYaz(proje.teslim, dil)}
              </span>
            </div>
            <h1 className="baslik mt-3 text-[28px] leading-tight text-murekkep md:text-[34px]">{proje.ad}</h1>
            <p className="mt-2 text-[14.5px] text-sis">{proje.bolge}, {sehirAdi(proje.sehir, dil)}</p>
          </div>

          {/* Satis ilerlemesi */}
          <div className="overflow-hidden rounded-xl border border-hat bg-white px-5 py-4">
            <div className="flex items-baseline justify-between text-[13px]">
              <span className="text-murekkep">{t("satilanOran", dil)}</span>
              <span className="font-medium tabular-nums text-deniz-700">
                {proje.satilan} / {proje.konutSayisi} · %{yuzde}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-kum-200">
              <div className="h-full rounded-full bg-deniz-500" style={{ width: `${yuzde}%` }} />
            </div>
          </div>

          {/* Kunye */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hat bg-hat sm:grid-cols-3">
            {kunye.map(([k, v]) => (
              <div key={k} className="bg-white px-4 py-3.5">
                <p className="etiket text-sis">{k}</p>
                <p className="mt-1 text-[16px] font-medium text-murekkep">{v}</p>
              </div>
            ))}
          </div>

          {/* Geliştirici sicili — maketten alicinin tek gercek sorusu */}
          {gelistirici && <GelistiriciKarti g={gelistirici} dil={dil} />}

          <section>
            <h2 className="baslik mb-3 text-[22px] text-deniz-700">{t("aciklama", dil)}</h2>
            <p className="max-w-[70ch] text-[15px] leading-[1.75] text-murekkep/85">{proje.aciklama[dil]}</p>
          </section>

          <section>
            <h2 className="baslik mb-3 text-[22px] text-deniz-700">{t("odaSecenek", dil)}</h2>
            <div className="flex flex-wrap gap-2">
              {proje.odaSecenekleri.map((o) => <span key={o} className="cip cip-tapu">{o}</span>)}
            </div>
          </section>

          <section>
            <h2 className="baslik mb-3 text-[22px] text-deniz-700">{t("ozellikler", dil)}</h2>
            <div className="flex flex-wrap gap-2">
              {proje.ozellikler.map((o) => (
                <span key={o} className="flex items-center gap-1.5 rounded-md border border-hat bg-white px-3 py-1.5 text-[13.5px] text-murekkep">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C4663A" strokeWidth="2.6" aria-hidden>
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {ozellikAdi(o, dil)}
                </span>
              ))}
            </div>
          </section>

          <Konum dil={dil} bolge={proje.bolge} sehir={proje.sehir} konum={proje.konum} />

          {ilanlar.length > 0 && (
            <section>
              <h2 className="baslik mb-5 text-[22px] text-deniz-700">{t("projeIlanlari", dil)}</h2>
              <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ilanlar.map((i) => <IlanKarti key={i.id} ilan={i} dil={dil} />)}
              </div>
            </section>
          )}

          <p className="max-w-[70ch] border-t border-hat pt-4 text-[12px] leading-relaxed text-sis">
            {t("projeUyari", dil)}
          </p>
        </div>
      </main>
    </>
  );
}
