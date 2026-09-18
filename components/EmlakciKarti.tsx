"use client";
import { useState } from "react";
import { Dil, Emlakci } from "@/lib/tipler";
import { t, KONUSULAN_DIL_ADI } from "@/lib/sozluk";

export default function EmlakciKarti({ e, dil }: { e: Emlakci; dil: Dil }) {
  const [acik, setAcik] = useState(false);
  const bas = e.ad.split(" ").map((x) => x[0]).join("").slice(0, 2);

  return (
    <div className="rounded-xl border border-hat bg-white p-5 kart-golge">
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-deniz-700 baslik text-[17px] text-kum-50">
          {bas}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium text-murekkep">{e.ad}</p>
          <p className="truncate text-[13px] text-sis">{e.firma}</p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <span className="rounded bg-kum-100 px-2 py-1 text-[11.5px] text-deniz-700">
          {e.kidemYil}{t("yil", dil)}
        </span>
        {e.ruhsatDogrulandi && (
          <span className="flex items-center gap-1 rounded bg-deniz-50 px-2 py-1 text-[11.5px] text-deniz-700">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
              <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("ruhsatli", dil)}
          </span>
        )}
      </div>
      <p className="mt-2 font-mono text-[10.5px] tracking-tight text-sis">{e.ruhsatNo}</p>

      {/* Konustugu diller — KKTC alicisi TR/EN/RU/FA karisik, rakipte yok */}
      <p className="mt-3 border-t border-hat pt-3 text-[12.5px] text-sis">
        <span className="text-murekkep">{t("konusulanDiller", dil)}:</span>{" "}
        {e.konustuguDiller.map((k) => KONUSULAN_DIL_ADI[k][dil]).join(", ")}
      </p>

      <div className="mt-4 space-y-2">
        <button onClick={() => setAcik(true)}
          className="w-full rounded-md bg-deniz-700 py-2.5 text-[14px] font-medium text-kum-50 transition hover:bg-deniz-900">
          {acik ? e.telefon : t("telefonuGoster", dil)}
        </button>
        <a href={`https://wa.me/${e.whatsapp}`} target="_blank" rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-hat bg-white py-2.5 text-[14px] font-medium text-murekkep transition hover:bg-kum-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
            <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.8-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.7-.3z"/>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/>
          </svg>
          {t("whatsapp", dil)}
        </a>
        <button className="w-full rounded-md border border-hat bg-white py-2.5 text-[14px] text-murekkep transition hover:bg-kum-100">
          {t("mesajGonder", dil)}
        </button>
      </div>
    </div>
  );
}
