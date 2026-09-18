import Image from "next/image";
import Link from "next/link";
import Ustbilgi from "@/components/Ustbilgi";
import AramaKutusu from "@/components/AramaKutusu";
import IlanKarti from "@/components/IlanKarti";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { ILANLAR } from "@/lib/veri";
import { SEHIRLER, sehirAdi } from "@/lib/yardimci";

export default async function AnaSayfa({ params }: { params: Promise<{ dil: string }> }) {
  const { dil: d } = await params;
  const dil = d as Dil;

  const vitrin = ILANLAR.filter((i) => i.vitrin);
  const digerler = ILANLAR.filter((i) => !i.vitrin).slice(0, 6 - vitrin.length + 3);
  const oneCikan = [...vitrin, ...digerler].slice(0, 6);
  const aiOrnek = ILANLAR.find((i) => i.aiTasarimlar?.length)!;

  const nedenler = [
    { b: "neden1Baslik", m: "neden1Metin", ikon: "M12 3 4 6.5v5c0 4.6 3.4 8.9 8 9.9 4.6-1 8-5.3 8-9.9v-5L12 3Z|m9 12 2 2 4-4" },
    { b: "neden2Baslik", m: "neden2Metin", ikon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z|M3 12h18|M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" },
    { b: "neden3Baslik", m: "neden3Metin", ikon: "M12 2.5 14 8.3l5.8 2-5.8 2-2 5.8-2-5.8-5.8-2 5.8-2 2-5.8Z|M19 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" },
  ] as const;

  return (
    <>
      <Ustbilgi dil={dil} seffaf />

      {/* KAHRAMAN */}
      <section id="icerik" className="relative min-h-[660px] overflow-hidden md:min-h-[760px]">
        <Image src="/gorsel/ilan/ilan-07.webp" alt="" fill priority sizes="100vw"
          className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-deniz-900/88 via-deniz-900/62 to-deniz-700/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-deniz-900/70 via-transparent to-transparent" />

        <div className="kapsayici relative flex min-h-[660px] flex-col justify-center pt-[68px] pb-16 md:min-h-[760px]">
          <div className="belir">
            <p className="etiket mb-5 flex items-center gap-2.5 text-terra-400">
              <span className="h-px w-8 bg-terra-400" />
              {t("sloganUst", dil)}
            </p>
            <h1 className="baslik max-w-[16ch] whitespace-pre-line text-[42px] leading-[1.06] text-kum-50 sm:text-[56px] md:text-[68px]">
              {t("kahramanBaslik", dil)}
            </h1>
            <p className="mt-6 max-w-[54ch] text-[15.5px] leading-relaxed text-kum-200/85 md:text-[16.5px]">
              {t("kahramanAlt", dil)}
            </p>
          </div>

          <div className="mt-10 belir" style={{ animationDelay: "120ms" }}>
            <AramaKutusu dil={dil} buyuk />
          </div>

          <div className="mt-10 flex flex-wrap gap-x-9 gap-y-4 belir" style={{ animationDelay: "240ms" }}>
            {SEHIRLER.map((s) => {
              const n = ILANLAR.filter((i) => i.sehir === s).length;
              return (
                <Link key={s} href={`/${dil}/ilan?sehir=${encodeURIComponent(s)}`} className="group">
                  <p className="baslik text-[26px] leading-none text-kum-50 transition group-hover:text-terra-400">{n}</p>
                  <p className="mt-1 text-[12.5px] text-kum-200/65">{sehirAdi(s, dil)}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-3 right-4 rounded bg-black/35 px-2 py-1 text-[9.5px] uppercase tracking-wider text-white/70 backdrop-blur-sm">
          {t("prototipUyari", dil)}
        </div>
      </section>

      {/* NEDEN */}
      <section className="border-b border-hat bg-kum-50">
        <div className="kapsayici grid gap-10 py-16 md:grid-cols-3 md:py-20">
          {nedenler.map((n, i) => (
            <div key={i}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C4663A" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {n.ikon.split("|").map((p, j) => <path key={j} d={p} />)}
              </svg>
              <h3 className="baslik mt-4 text-[21px] text-deniz-700">{t(n.b, dil)}</h3>
              <p className="mt-2.5 max-w-[42ch] text-[14.5px] leading-relaxed text-sis">{t(n.m, dil)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI VITRIN */}
      <section className="bg-kum-100">
        <div className="kapsayici py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="etiket mb-4 flex items-center gap-2.5 text-terra-500">
                <span className="h-px w-8 bg-terra-500" />NorthernEmlak AI
              </p>
              <h2 className="baslik max-w-[15ch] text-[34px] leading-[1.12] text-deniz-700 md:text-[44px]">
                {t("aiBaslik", dil)}
              </h2>
              <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-sis">{t("aiAlt", dil)}</p>
              <Link href={`/${dil}/ilan/${aiOrnek.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-deniz-700 px-6 py-3 text-[14px] font-medium text-kum-50 transition hover:bg-deniz-900">
                {t("karsilastir", dil)}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M5 12h13m-5-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-[10px] kart-golge">
                <Image src={aiOrnek.aiOdaGorseli!} alt="" fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover" />
                <span className="absolute left-3 top-3 etiket rounded bg-white/92 px-2 py-1 text-deniz-700">{t("orijinal", dil)}</span>
              </div>
              {aiOrnek.aiTasarimlar!.slice(0, 2).map((a) => (
                <div key={a.stil} className="relative aspect-[4/3] overflow-hidden rounded-[10px] kart-golge">
                  <Image src={a.gorsel} alt={a.ad[dil]} fill sizes="25vw" className="object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2 pt-6 text-[12px] font-medium text-white">
                    {a.ad[dil]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ONE CIKANLAR */}
      <section className="bg-kum-50">
        <div className="kapsayici py-16 md:py-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="baslik text-[30px] text-deniz-700 md:text-[36px]">{t("oneCikanlar", dil)}</h2>
            <Link href={`/${dil}/ilan`}
              className="shrink-0 border-b border-terra-500 pb-0.5 text-[14px] text-terra-500 transition hover:border-deniz-700 hover:text-deniz-700">
              {t("tumIlanlar", dil)}
            </Link>
          </div>
          <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {oneCikan.map((i, n) => <IlanKarti key={i.id} ilan={i} dil={dil} oncelik={n < 3} />)}
          </div>
        </div>
      </section>
    </>
  );
}
