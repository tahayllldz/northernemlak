"use client";
import { useEffect, useRef, useState } from "react";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

/**
 * SESLI ILAN TURU
 *
 * Aciklamayi alicinin kendi dilinde sesli okur. Tarayicinin kendi
 * SpeechSynthesis motoru — sifir bagimlilik, sifir maliyet.
 *
 * Neden: Rus ve Iranli alicilarin onemli kismi yazili Ingilizceyi rahat
 * okumuyor. Emlakta bunu yapan portal yok.
 *
 * Ses bulunamazsa dugme hic gorunmez (yanlis dilde okumaktansa hic okuma).
 */
const YEREL: Record<Dil, string> = { tr: "tr-TR", en: "en-GB", ru: "ru-RU" };

export default function SesliTur({ metin, dil }: { metin: string; dil: Dil }) {
  const [destekli, setDestekli] = useState(false);
  const [okuyor, setOkuyor] = useState(false);
  const sesRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const kontrol = () => {
      const sesler = window.speechSynthesis.getVoices();
      const kok = YEREL[dil].split("-")[0];
      setDestekli(sesler.some((s) => s.lang.toLowerCase().startsWith(kok)));
    };
    kontrol();
    window.speechSynthesis.addEventListener("voiceschanged", kontrol);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", kontrol);
      window.speechSynthesis.cancel();
    };
  }, [dil]);

  const degistir = () => {
    const ss = window.speechSynthesis;
    if (okuyor) { ss.cancel(); setOkuyor(false); return; }
    ss.cancel();
    const u = new SpeechSynthesisUtterance(metin);
    u.lang = YEREL[dil];
    u.rate = 0.98;
    const kok = YEREL[dil].split("-")[0];
    const ses = ss.getVoices().find((s) => s.lang.toLowerCase().startsWith(kok));
    if (ses) u.voice = ses;
    u.onend = () => setOkuyor(false);
    u.onerror = () => setOkuyor(false);
    sesRef.current = u;
    ss.speak(u);
    setOkuyor(true);
  };

  if (!destekli) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" onClick={degistir} aria-pressed={okuyor}
        className={`flex items-center gap-2 rounded-md border px-3.5 py-2 text-[13.5px] font-medium transition
          ${okuyor ? "border-terra-500 bg-terra-500 text-white" : "border-hat bg-white text-murekkep hover:border-deniz-300"}`}>
        {okuyor ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
            <path d="M11 5 6 9H3v6h3l5 4z" strokeLinejoin="round" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
          </svg>
        )}
        {t(okuyor ? "sesliDurdur" : "sesliDinle", dil)}
      </button>
      <span className="max-w-[46ch] text-[11.5px] leading-relaxed text-sis">{t("sesliNot", dil)}</span>
    </div>
  );
}
