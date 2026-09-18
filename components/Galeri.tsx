"use client";
import Image from "next/image";
import { useState } from "react";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

export default function Galeri({ gorseller, baslik, dil }: { gorseller: string[]; baslik: string; dil: Dil }) {
  const [i, setI] = useState(0);
  const git = (y: number) => setI((v) => (v + y + gorseller.length) % gorseller.length);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-kum-200 kart-golge">
        <Image src={gorseller[i]} alt={baslik} fill priority sizes="(max-width:1024px) 100vw, 66vw" className="object-cover" />
        {gorseller.length > 1 && (
          <>
            {([["‹", -1, "left-3", t("oncekiFoto", dil)], ["›", 1, "right-3", t("sonrakiFoto", dil)]] as const).map(([s, y, k, ad]) => (
              <button key={k} onClick={() => git(y)} aria-label={ad} type="button"
                className={`absolute top-1/2 ${k} flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-[22px] leading-none text-deniz-700 backdrop-blur-sm transition hover:bg-white`}>
                <span aria-hidden>{s}</span>
              </button>
            ))}
            <span className="absolute bottom-3 left-3 rounded bg-black/50 px-2.5 py-1 text-[11.5px] text-white backdrop-blur-sm">
              {i + 1} / {gorseller.length}
            </span>
          </>
        )}
        <span className="absolute bottom-3 right-3 rounded bg-black/45 px-2 py-1 text-[9.5px] uppercase tracking-wider text-white/80 backdrop-blur-sm">
          {t("temsiliGorsel", dil)}
        </span>
      </div>

      {gorseller.length > 1 && (
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {gorseller.map((g, n) => (
            <button key={g} onClick={() => setI(n)} type="button"
              aria-label={`${t("foto", dil)} ${n + 1}`} aria-current={n === i ? "true" : undefined}
              className={`relative h-[62px] w-[92px] shrink-0 overflow-hidden rounded-md border-2 transition
                ${n === i ? "border-terra-500" : "border-transparent opacity-65 hover:opacity-100"}`}>
              <Image src={g} alt="" fill sizes="92px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
