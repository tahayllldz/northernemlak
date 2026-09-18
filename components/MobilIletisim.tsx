"use client";
import { useState } from "react";
import { Dil, Emlakci, Ilan } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { fiyatYaz } from "@/lib/yardimci";
import { useAyarlar } from "./Ayarlar";
import { FavoriDugme } from "./Favoriler";

/**
 * Mobilde sabit alt iletisim cubugu. Onceden kullanici iletisim icin
 * sayfanin basina donmek zorundaydi — mobil donusumun en buyuk kaldiraci.
 */
export default function MobilIletisim({ ilan, e, dil }: { ilan: Ilan; e: Emlakci; dil: Dil }) {
  const { para } = useAyarlar();
  const [acik, setAcik] = useState(false);

  return (
    <div className="alt-cubuk">
      <div className="min-w-0 flex-1">
        <p className="baslik truncate text-[17px] leading-tight text-deniz-700">
          {fiyatYaz(ilan.fiyat, para, dil)}
          {ilan.islem === "kiralik" && <span className="text-[12px] text-sis">{t("ayda", dil)}</span>}
        </p>
        <p className="truncate text-[11.5px] text-sis">{e.ad}</p>
      </div>

      <FavoriDugme id={ilan.id} dil={dil} buyuk />

      <a href={`https://wa.me/${e.whatsapp}`} target="_blank" rel="noreferrer"
        aria-label={t("whatsapp", dil)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-hat bg-white">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
          <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.8-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.7-.3z" />
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
        </svg>
      </a>

      {acik ? (
        <a href={`tel:${e.telefon.replace(/\s/g, "")}`}
          className="flex h-11 shrink-0 items-center rounded-full bg-deniz-700 px-5 text-[14px] font-medium text-kum-50">
          {e.telefon}
        </a>
      ) : (
        <button type="button" onClick={() => setAcik(true)}
          className="flex h-11 shrink-0 items-center rounded-full bg-deniz-700 px-5 text-[14px] font-medium text-kum-50">
          {t("telefonuGoster", dil)}
        </button>
      )}
    </div>
  );
}
