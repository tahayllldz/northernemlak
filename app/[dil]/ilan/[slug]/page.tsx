import Link from "next/link";
import { notFound } from "next/navigation";
import Ustbilgi from "@/components/Ustbilgi";
import Galeri from "@/components/Galeri";
import AiTasarim from "@/components/AiTasarim";
import EmlakciKarti from "@/components/EmlakciKarti";
import DetayUst from "@/components/DetayUst";
import MobilIletisim from "@/components/MobilIletisim";
import Konum from "@/components/Konum";
import Maliyet from "@/components/Maliyet";
import Gezinti360 from "@/components/Gezinti360";
import TapuZinciri from "@/components/TapuZinciri";
import GelistiriciKarti from "@/components/GelistiriciKarti";
import Getiri from "@/components/Getiri";
import Altyapi from "@/components/Altyapi";
import BenzerUyari from "@/components/BenzerUyari";
import SesliTur from "@/components/SesliTur";
import SonBakilanlar, { SonBakilanKaydet } from "@/components/SonBakilanlar";
import IlanKarti from "@/components/IlanKarti";
import { Fiyat } from "@/components/Fiyat";
import { Dil } from "@/lib/tipler";
import { t, ozellikAdi } from "@/lib/sozluk";
import { ILANLAR } from "@/lib/veri";
import { emlakciBul, gelistiriciBul, ilanBul, sehirAdi, tipAdi, tapuAdi, tarihYaz, tazelikYaz, m2FiyatYaz, odaYaz, alanYaz } from "@/lib/yardimci";

export function generateStaticParams() {
  return ["tr", "en", "ru"].flatMap((dil) => ILANLAR.map((i) => ({ dil, slug: i.slug })));
}

export default async function IlanDetay({ params }: { params: Promise<{ dil: string; slug: string }> }) {
  const { dil: d, slug } = await params;
  const dil = d as Dil;
  const ilan = ilanBul(slug);
  if (!ilan) notFound();
  const e = emlakciBul(ilan.emlakci);
  const gelistirici = gelistiriciBul(ilan.gelistirici);

  const benzer = ILANLAR.filter((x) => x.id !== ilan.id && (x.sehir === ilan.sehir || x.tip === ilan.tip)).slice(0, 4);
  // Not: m2 fiyati sunucuda GBP olarak yazilir; para birimi secimi istemci tarafinda.
  const m2Fiyat = m2FiyatYaz(ilan.fiyat, ilan.m2, "GBP", dil);

  const bolumler = [
    { id: "bolum-tapu", ad: t("tapuTipi", dil) },
    { id: "bolum-tapu-zinciri", ad: t("tapuZinciri", dil) },
    ...(gelistirici ? [{ id: "bolum-gelistirici", ad: t("gelistiriciBaslik", dil) }] : []),
    ...(ilan.gezinti360 ? [{ id: "bolum-360", ad: t("gezinti360", dil) }] : []),
    ...(ilan.aiTasarimlar?.length ? [{ id: "bolum-ai", ad: t("aiIleTasarlandi", dil) }] : []),
    { id: "bolum-maliyet", ad: t("maliyetBaslik", dil) },
    ...(ilan.islem === "satilik" && ilan.tip !== "arsa" ? [{ id: "bolum-getiri", ad: t("getiriBaslik", dil) }] : []),
    { id: "bolum-altyapi", ad: t("altyapiBaslik", dil) },
    { id: "bolum-aciklama", ad: t("aciklama", dil) },
    { id: "bolum-ozellikler", ad: t("ozellikler", dil) },
    { id: "bolum-konum", ad: t("konum", dil) },
  ];

  const kunye: [string, string][] = [
    [t("oda", dil), odaYaz(ilan.oda, dil)],
    [t("banyo", dil), String(ilan.banyo)],
    [t(ilan.tip === "arsa" ? "arsaBuyuklugu" : "alan", dil), alanYaz(ilan.m2, ilan.tip, dil)],
    ...(ilan.islem === "satilik" && m2Fiyat ? [[t("m2Fiyat", dil), m2Fiyat] as [string, string]] : []),
    [t("binaYasi", dil), ilan.binaYasi === 0 ? "—" : String(ilan.binaYasi)],
    [t("esyaDurumu", dil), t(ilan.esyali === "esyali" ? "esyali" : ilan.esyali === "esyasiz" ? "esyasiz" : "yari", dil)],
    ...(ilan.aidat ? [[t("aidat", dil), `£${ilan.aidat}${t("ayda", dil)}`] as [string, string]] : []),
  ];

  return (
    <>
      <Ustbilgi dil={dil} />
      <div className="h-[68px]" />
      <DetayUst ilan={ilan} dil={dil} bolumler={bolumler} />
      <SonBakilanKaydet id={ilan.id} />

      <main id="icerik" className="kapsayici py-7 pb-28 lg:pb-7">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-sis">
          <Link href={`/${dil}`} className="transition hover:text-terra-500">{t("marka", dil)}</Link><span>/</span>
          <Link href={`/${dil}/ilan?sehir=${encodeURIComponent(ilan.sehir)}`} className="transition hover:text-terra-500">{sehirAdi(ilan.sehir, dil)}</Link><span>/</span>
          <span className="text-murekkep">{ilan.bolge}</span>
          <span className="ml-auto font-mono text-sis">#{ilan.id}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_336px]">
          <div className="min-w-0 space-y-8">
            <Galeri gorseller={ilan.gorseller} baslik={ilan.baslik[dil]} dil={dil} />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="etiket rounded bg-deniz-700 px-2 py-1 text-kum-50">
                  {t(ilan.islem === "satilik" ? "satilik" : "kiralik", dil)}
                </span>
                <span className="etiket rounded bg-kum-200 px-2 py-1 text-deniz-700">{tipAdi(ilan.tip, dil)}</span>
                {ilan.vitrin && <span className="etiket rounded bg-terra-500 px-2 py-1 text-white">{t("vitrin", dil)}</span>}
              </div>

              <h1 className="baslik mt-3 text-[28px] leading-tight text-murekkep md:text-[34px]">{ilan.baslik[dil]}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-[14.5px] text-sis">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>
                </svg>
                {ilan.bolge}, {sehirAdi(ilan.sehir, dil)}
              </p>
              <div className="mt-4"><Fiyat gbp={ilan.fiyat} onceki={ilan.oncekiFiyat} kiralik={ilan.islem === "kiralik"} dil={dil} buyuk /></div>
            </div>

            {/* kunye */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hat bg-hat sm:grid-cols-3">
              {kunye.map(([k, v]) => (
                <div key={k} className="bg-white px-4 py-3.5">
                  <p className="etiket text-sis">{k}</p>
                  <p className="mt-1 text-[16px] font-medium text-murekkep">{v}</p>
                </div>
              ))}
            </div>

            {/* TAPU — farklilastirici */}
            <section id="bolum-tapu" className="overflow-hidden rounded-xl border-2 border-deniz-100 bg-deniz-50">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 px-5 py-4">
                <div>
                  <p className="etiket text-deniz-500">{t("tapuTipi", dil)}</p>
                  <p className="baslik mt-1 text-[21px] text-deniz-700">{tapuAdi(ilan.tapu, dil)}</p>
                </div>
                <div className="h-10 w-px bg-deniz-100" />
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full
                    ${ilan.yabanciUygun ? "bg-deniz-700 text-kum-50" : "bg-terra-500 text-white"}`}>
                    {ilan.yabanciUygun ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                        <path d="M12 8v5M12 16.5v.5" strokeLinecap="round"/><circle cx="12" cy="12" r="9"/></svg>
                    )}
                  </span>
                  <p className="text-[14px] font-medium text-deniz-700">
                    {t(ilan.yabanciUygun ? "yabanciUygun" : "yabanciUygunDegil", dil)}
                  </p>
                </div>
              </div>
              <p className="border-t border-deniz-100 px-5 py-2.5 text-[11.5px] text-deniz-500">{t("tapuNot", dil)}</p>
            </section>

            {/* TAPU ZINCIRI — rakipte karsiligi yok */}
            <TapuZinciri asama={ilan.tapuAsama} dil={dil} />

            {/* GELISTIRICI SICILI — yalnizca proje / sifir konutlarda */}
            {gelistirici && <GelistiriciKarti g={gelistirici} dil={dil} />}

            {/* TOPLAM MALIYET — rakipte karsiligi yok */}
            <Maliyet ilan={ilan} dil={dil} />

            {/* YATIRIM GETIRISI — universite donemi mevsimselligiyle */}
            <Getiri ilan={ilan} dil={dil} />

            {/* 360 GEZINTI */}
            {ilan.gezinti360 && (
              <section id="bolum-360">
                <h2 className="baslik mb-1.5 text-[22px] text-deniz-700">{t("gezinti360", dil)}</h2>
                <p className="mb-4 max-w-[62ch] text-[13.5px] leading-relaxed text-sis">{t("gezinti360Alt", dil)}</p>
                <Gezinti360 kaynak={ilan.gezinti360} dil={dil} baslik={ilan.baslik[dil]} />
              </section>
            )}

            {/* AI TASARIM */}
            {ilan.aiTasarimlar?.length ? (
              <div id="bolum-ai"><AiTasarim orijinal={ilan.aiOdaGorseli!} tasarimlar={ilan.aiTasarimlar} dil={dil} /></div>
            ) : null}

            {/* ACIKLAMA */}
            <section id="bolum-aciklama">
              <h2 className="baslik mb-3 text-[22px] text-deniz-700">{t("aciklama", dil)}</h2>
              <p className="max-w-[70ch] text-[15px] leading-[1.75] text-murekkep/85">{ilan.aciklama[dil]}</p>
              <SesliTur metin={ilan.aciklama[dil]} dil={dil} />
              {ilan.cevrilmis && dil !== "tr" && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded bg-kum-200 px-2.5 py-1 text-[11.5px] text-sis">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>
                  {t("makineCeviri", dil)}
                </p>
              )}
            </section>

            {/* OZELLIKLER */}
            <section id="bolum-ozellikler">
              <h2 className="baslik mb-3 text-[22px] text-deniz-700">{t("ozellikler", dil)}</h2>
              <div className="flex flex-wrap gap-2">
                {ilan.ozellikler.map((o) => (
                  <span key={o} className="flex items-center gap-1.5 rounded-md border border-hat bg-white px-3 py-1.5 text-[13.5px] text-murekkep">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C4663A" strokeWidth="2.6" aria-hidden>
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {ozellikAdi(o, dil)}
                  </span>
                ))}
              </div>
            </section>

            {/* ALTYAPI HAZIRLIGI — jeneratorun neden bir ozellik oldugunu konusuyoruz */}
            <Altyapi ilan={ilan} dil={dil} />

            {/* MUKERRER ILAN SEFFAFLIGI */}
            <BenzerUyari ilan={ilan} dil={dil} />

            <Konum dil={dil} bolge={ilan.bolge} sehir={ilan.sehir} konum={ilan.konum} />

            {/* KUNYE ALT */}
            <section className="rounded-xl border border-hat bg-white px-5 py-4 text-[13px]">
              <div className="grid gap-x-8 gap-y-2.5 sm:grid-cols-3">
                {[[t("ilanNo", dil), `#${ilan.id}`],
                  [t("yayin", dil), `${tazelikYaz(ilan.yayinTarihi, dil)} · ${tarihYaz(ilan.yayinTarihi, dil)}`],
                  [t("guncelleme", dil), `${tazelikYaz(ilan.guncelleme, dil)} · ${tarihYaz(ilan.guncelleme, dil)}`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 sm:block">
                    <span className="text-sis">{k}</span>
                    <span className="font-medium text-murekkep sm:mt-0.5 sm:block">{v}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 border-t border-hat pt-3 text-[12px] text-sis">
                {ilan.goruntulenme.toLocaleString("tr-TR")} {t("goruntulenme", dil)}
              </p>
            </section>
          </div>

          {/* YAN SUTUN */}
          <aside className="lg:sticky lg:top-[136px] lg:self-start">
            <EmlakciKarti e={e} dil={dil} />
          </aside>
        </div>

        {/* BENZER */}
        {benzer.length > 0 && (
          <section className="mt-16">
            <h2 className="baslik mb-5 text-[24px] text-deniz-700">{t("benzerIlanlar", dil)}</h2>
            <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {benzer.map((b) => <IlanKarti key={b.id} ilan={b} dil={dil} />)}
            </div>
          </section>
        )}
        <SonBakilanlar dil={dil} haric={ilan.id} />
      </main>

      <MobilIletisim ilan={ilan} e={e} dil={dil} />
    </>
  );
}
