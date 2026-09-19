import Ustbilgi from "@/components/Ustbilgi";
import ProjeKarti from "@/components/ProjeKarti";
import { Dil, ProjeDurum } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { PROJELER } from "@/lib/veri";
import { projeDurumAdi } from "@/lib/yardimci";
import Link from "next/link";

export function generateStaticParams() {
  return [{ dil: "tr" }, { dil: "en" }, { dil: "ru" }];
}

const DURUMLAR: ProjeDurum[] = ["on-satis", "insaat", "tamamlandi"];

export default async function ProjeListe({
  params, searchParams,
}: { params: Promise<{ dil: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { dil: d } = await params;
  const sp = await searchParams;
  const dil = d as Dil;

  const secili = DURUMLAR.includes(sp.durum as ProjeDurum) ? (sp.durum as ProjeDurum) : null;
  const liste = secili ? PROJELER.filter((p) => p.durum === secili) : PROJELER;

  const bag = (durum: ProjeDurum | null) =>
    durum ? `/${dil}/proje?durum=${durum}` : `/${dil}/proje`;

  return (
    <>
      <Ustbilgi dil={dil} />
      <div className="h-[68px]" />

      <main id="icerik" className="kapsayici py-8">
        <h1 className="baslik text-[28px] text-deniz-700">{t("projelerBaslik", dil)}</h1>
        <p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed text-sis">{t("projelerAlt", dil)}</p>

        <div className="cip-serit mt-6">
          <Link href={bag(null)} aria-current={!secili ? "page" : undefined}
            className={`cip-dugme ${!secili ? "bg-deniz-700 text-kum-50" : ""}`}
            style={!secili ? { borderColor: "var(--color-deniz-700)" } : undefined}>
            {t("hepsi", dil)} ({PROJELER.length})
          </Link>
          {DURUMLAR.map((dd) => {
            const adet = PROJELER.filter((p) => p.durum === dd).length;
            const aktif = secili === dd;
            return (
              <Link key={dd} href={bag(dd)} aria-current={aktif ? "page" : undefined}
                className={`cip-dugme ${aktif ? "bg-deniz-700 text-kum-50" : ""}`}
                style={aktif ? { borderColor: "var(--color-deniz-700)" } : undefined}>
                {projeDurumAdi(dd, dil)} ({adet})
              </Link>
            );
          })}
        </div>

        {liste.length === 0 ? (
          <p className="py-20 text-center text-[15px] text-sis">{t("projeYok", dil)}</p>
        ) : (
          <div className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {liste.map((p, n) => <ProjeKarti key={p.slug} proje={p} dil={dil} oncelik={n < 3} />)}
          </div>
        )}

        <p className="mt-10 max-w-[70ch] border-t border-hat pt-4 text-[12px] leading-relaxed text-sis">
          {t("projeUyari", dil)}
        </p>
      </main>
    </>
  );
}
