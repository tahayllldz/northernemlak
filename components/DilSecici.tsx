"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { DILLER } from "@/lib/sozluk";
import { Dil } from "@/lib/tipler";

export default function DilSecici({ dil, koyu = false }: { dil: Dil; koyu?: boolean }) {
  const [acik, setAcik] = useState(false);
  const yol = usePathname();
  const router = useRouter();
  const simdiki = DILLER.find((d) => d.kod === dil)!;

  const degistir = (yeni: Dil) => {
    setAcik(false);
    const parcalar = yol.split("/");
    parcalar[1] = yeni;
    router.push(parcalar.join("/") || `/${yeni}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setAcik((a) => !a)}
        aria-label="Dil"
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition
          ${koyu ? "text-kum-200 hover:bg-white/10" : "text-deniz-700 hover:bg-kum-200"}`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
        </svg>
        {simdiki.kisa}
      </button>
      {acik && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAcik(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[150px] overflow-hidden rounded-lg border border-hat bg-white py-1 kart-golge-yukari">
            {DILLER.map((d) => (
              <button key={d.kod} onClick={() => degistir(d.kod)}
                className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-[13.5px] transition hover:bg-kum-100
                  ${d.kod === dil ? "text-terra-500 font-medium" : "text-murekkep"}`}>
                {d.ad}
                <span className="text-[11px] text-sis">{d.kisa}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
