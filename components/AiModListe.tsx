"use client";
import { useState } from "react";
import { Dil, Ilan } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import IlanKarti from "./IlanKarti";

/**
 * AI eleme modu anahtari + ilan izgarasi.
 *
 * Uc turdur soyledigim itirazin karsiligi: AI sanal dekorasyon detay sayfasinda
 * gomuluydu, yani kullanici ilani SECTIKTEN SONRA goruyordu. Asil degeri eleme
 * aninda — bos ya da eski dosenmis daireleri listede degerlendirebilmekte.
 */
export default function AiModListe({
  ilanlar, dil,
}: { ilanlar: Ilan[]; dil: Dil }) {
  const [aiMod, setAiMod] = useState(false);
  const aiVarMi = ilanlar.some((i) => i.aiTasarimlar?.length);

  return (
    <>
      {aiVarMi && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setAiMod((v) => !v)} aria-pressed={aiMod}
            className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-medium transition
              ${aiMod ? "bg-terra-500 text-white" : "border border-hat bg-white text-murekkep hover:border-terra-400"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2l1.9 5.7L19.6 9l-5.7 1.9L12 16.6l-1.9-5.7L4.4 9l5.7-1.3L12 2z" />
            </svg>
            {t(aiMod ? "aiModKapat" : "aiModAc", dil)}
          </button>
          {aiMod && (
            <span className="max-w-[58ch] text-[12px] leading-relaxed text-sis">{t("aiModNot", dil)}</span>
          )}
        </div>
      )}

      <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ilanlar.map((i, n) => (
          <IlanKarti key={i.id} ilan={i} dil={dil} oncelik={n < 4} aiMod={aiMod} />
        ))}
      </div>
    </>
  );
}
