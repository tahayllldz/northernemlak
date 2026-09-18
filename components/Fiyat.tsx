"use client";
import { Dil } from "@/lib/tipler";
import { fiyatYaz } from "@/lib/yardimci";
import { t } from "@/lib/sozluk";
import { useAyarlar } from "./Ayarlar";

export function Fiyat({ gbp, kiralik, dil, buyuk = false }: { gbp: number; kiralik?: boolean; dil: Dil; buyuk?: boolean }) {
  const { para } = useAyarlar();
  return (
    <p className={`baslik leading-none text-deniz-700 ${buyuk ? "text-[36px] md:text-[42px]" : "text-[20px]"}`}>
      {fiyatYaz(gbp, para, dil)}
      {kiralik && <span className="text-[16px] text-sis">{t("ayda", dil)}</span>}
      {para !== "GBP" && <span className="ml-2 align-middle text-[13px] font-normal text-kum-400">≈ {fiyatYaz(gbp, "GBP", dil)}</span>}
    </p>
  );
}
