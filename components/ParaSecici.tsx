"use client";
import { useState } from "react";
import { ParaBirimi } from "@/lib/yardimci";

const LISTE: ParaBirimi[] = ["GBP", "EUR", "USD", "TRY"];

export default function ParaSecici({ deger, degisti, koyu = false }:
  { deger: ParaBirimi; degisti: (p: ParaBirimi) => void; koyu?: boolean }) {
  const [acik, setAcik] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setAcik((a) => !a)}
        className={`rounded-md px-2.5 py-1.5 text-[13px] font-medium transition
          ${koyu ? "text-kum-200 hover:bg-white/10" : "text-deniz-700 hover:bg-kum-200"}`}>
        {deger}
      </button>
      {acik && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAcik(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[80px] overflow-hidden rounded-lg border border-hat bg-white py-1 kart-golge-yukari">
            {LISTE.map((p) => (
              <button key={p} onClick={() => { degisti(p); setAcik(false); }}
                className={`block w-full px-3.5 py-2 text-left text-[13.5px] transition hover:bg-kum-100
                  ${p === deger ? "text-terra-500 font-medium" : "text-murekkep"}`}>{p}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
