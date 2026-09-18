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
export function Fiyat({ gbp, onceki, kiralik, dil, buyuk = false }: { gbp: number; onceki?: number; kiralik?: boolean; dil: Dil; buyuk?: boolean }) {
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
      {onceki && onceki > gbp && (
        <p className="mt-2 flex flex-wrap items-center gap-2">
          <span className="cip cip-uyari">{t("fiyatDustu", dil)}</span>
          <span className="text-[14px] text-sis line-through">{fiyatYaz(onceki, para, dil)}</span>
          <span className="text-[13px] text-terra-600">−{fiyatYaz(onceki - gbp, para, dil)}</span>
        </p>
      )}
    </div>
  );
}
