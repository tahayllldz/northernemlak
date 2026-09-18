import { notFound } from "next/navigation";
import Ayarlar from "@/components/Ayarlar";
import Altbilgi from "@/components/Altbilgi";
import { Dil } from "@/lib/tipler";

export function generateStaticParams() {
  return [{ dil: "tr" }, { dil: "en" }, { dil: "ru" }];
}

export default async function DilLayout(
  { children, params }: { children: React.ReactNode; params: Promise<{ dil: string }> }
) {
  const { dil } = await params;
  if (!["tr", "en", "ru"].includes(dil)) notFound();
  return (
    <Ayarlar>
      <div className="flex min-h-dvh flex-col">
        <div className="flex-1">{children}</div>
        <Altbilgi dil={dil as Dil} />
      </div>
    </Ayarlar>
  );
}
