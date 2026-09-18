import { notFound } from "next/navigation";
import Ayarlar from "@/components/Ayarlar";
import Altbilgi from "@/components/Altbilgi";
import DilAyarla from "@/components/DilAyarla";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

export function generateStaticParams() {
  return [{ dil: "tr" }, { dil: "en" }, { dil: "ru" }];
}

export default async function DilLayout(
  { children, params }: { children: React.ReactNode; params: Promise<{ dil: string }> }
) {
  const { dil } = await params;
  if (!["tr", "en", "ru"].includes(dil)) notFound();
  const d = dil as Dil;
  return (
    <Ayarlar>
      <DilAyarla dil={d} />
      <a href="#icerik" className="atla">{t("iceriveAtla", d)}</a>
      {/* lang burada: text-transform en yakin lang'e gore calisir.
          Kok <html lang="tr"> sabit kaldigi icin EN/RU sayfalarda
          buyuk harf etiketler Turkce kuralina gore bozuluyordu. */}
      <div lang={d} className="flex min-h-dvh flex-col">
        <div className="flex-1">{children}</div>
        <Altbilgi dil={d} />
      </div>
    </Ayarlar>
  );
}
