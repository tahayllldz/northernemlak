import Ustbilgi from "@/components/Ustbilgi";
import FavoriListe from "@/components/FavoriListe";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

export function generateStaticParams() {
  return [{ dil: "tr" }, { dil: "en" }, { dil: "ru" }];
}

export default async function FavorilerSayfasi({ params }: { params: Promise<{ dil: string }> }) {
  const { dil: d } = await params;
  const dil = d as Dil;

  return (
    <>
      <Ustbilgi dil={dil} />
      <div className="h-[68px]" />
      <main id="icerik" className="kapsayici py-8">
        <h1 className="baslik mb-6 text-[28px] text-deniz-700">{t("favoriler", dil)}</h1>
        <FavoriListe dil={dil} />
      </main>
    </>
  );
}
