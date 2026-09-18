"use client";
import { Dil } from "@/lib/tipler";
import { fiyatYaz } from "@/lib/yardimci";
import { t } from "@/lib/sozluk";
import { useAyarlar } from "./Ayarlar";

/**
 * Cift para birimi: 101evler fiyatin altinda hem £ hem ₺ gosteriyor ve bu dogru —
 * KKTC'de satici ₺ dusunuyor, alici £ dusunuyor. Bizim ParaSecici birini digerinin
 * yerine koyuyordu; artik ikincil satir hep var.
 */
export function Fiyat({ gbp, kiralik, dil, buyuk = false }: { gbp: number; kiralik?: boolean; dil: Dil; buyuk?: boolean }) {
  const { para } = useAyarlar();
  // GBP seciliyse ikincil olarak yerel para (₺), degilse taban para (£) gosterilir
  const ikincil = para === "GBP" ? "TRY" : "GBP";
  return (
    <div>
      <p className={`baslik leading-none text-deniz-700 ${buyuk ? "text-[36px] md:text-[42px]" : "text-[20px]"}`}>
        {fiyatYaz(gbp, para, dil)}
        {kiralik && <span className="text-[16px] text-sis">{t("ayda", dil)}</span>}
      </p>
      <p className={`font-normal text-sis ${buyuk ? "mt-2 text-[14px]" : "mt-1 text-[12.5px]"}`}>
        ≈ {fiyatYaz(gbp, ikincil, dil)}
        {kiralik && t("ayda", dil)}
      </p>
    </div>
  );
}
