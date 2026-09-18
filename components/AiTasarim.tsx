"use client";
import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { AiTasarim as Tasarim, Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

export default function AiTasarim(
  { orijinal, tasarimlar, dil }: { orijinal: string; tasarimlar: Tasarim[]; dil: Dil }
) {
  const [aktif, setAktif] = useState(0);
  const [oran, setOran] = useState(58);
  const kutu = useRef<HTMLDivElement>(null);
  const basili = useRef(false);

  const guncelle = useCallback((clientX: number) => {
    const el = kutu.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setOran(Math.min(97, Math.max(3, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const secili = tasarimlar[aktif];

  return (
    <section className="overflow-hidden rounded-xl border border-hat bg-white kart-golge">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hat px-5 py-4 md:px-6">
        <div>
          <p className="etiket mb-1.5 flex items-center gap-2 text-terra-500">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2l1.9 5.7L19.6 9l-5.7 1.9L12 16.6l-1.9-5.7L4.4 9l5.7-1.3L12 2z"/>
            </svg>
            NorthernEmlak AI
          </p>
          <h2 className="baslik text-[23px] leading-tight text-deniz-700 md:text-[26px]">{t("aiBaslik", dil)}</h2>
        </div>
        <p className="max-w-[40ch] text-[12.5px] leading-relaxed text-sis">{t("aiAlt", dil)}</p>
      </div>

      {/* stil sekmeleri */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-hat px-5 py-3 md:px-6">
        {tasarimlar.map((d, i) => (
          <button key={d.stil} onClick={() => setAktif(i)}
            className={`group relative shrink-0 overflow-hidden rounded-lg border-2 transition
              ${i === aktif ? "border-terra-500" : "border-transparent hover:border-kum-300"}`}>
            <div className="relative h-[52px] w-[78px]">
              <Image src={d.gorsel} alt={d.ad[dil]} fill sizes="78px" className="object-cover" />
            </div>
            <span className={`block px-2 py-1.5 text-[11.5px] font-medium whitespace-nowrap transition
              ${i === aktif ? "bg-terra-500 text-white" : "bg-kum-100 text-murekkep group-hover:bg-kum-200"}`}>
              {d.ad[dil]}
            </span>
          </button>
        ))}
      </div>

      {/* karsilastirma */}
      <div
        ref={kutu}
        onPointerDown={(e) => {
          e.preventDefault();
          basili.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          guncelle(e.clientX);
        }}
        onPointerMove={(e) => { if (basili.current) guncelle(e.clientX); }}
        onPointerUp={(e) => {
          basili.current = false;
          try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
        }}
        onPointerCancel={() => { basili.current = false; }}
        onDragStart={(e) => e.preventDefault()}
        style={{ touchAction: "none" }}
        className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden bg-kum-200"
      >
        {/* AI (arka) */}
        <Image src={secili.gorsel} alt={secili.ad[dil]} fill sizes="(max-width:768px) 100vw, 70vw"
          draggable={false} className="pointer-events-none select-none object-cover" priority />

        {/* orijinal (on, kirpilmis) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - oran}% 0 0)` }}>
          <Image src={orijinal} alt={t("orijinal", dil)} fill sizes="(max-width:768px) 100vw, 70vw"
            draggable={false} className="pointer-events-none select-none object-cover" priority />
        </div>

        {/* surgu */}
        <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,.35)]"
          style={{ left: `${oran}%` }}>
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B4D5C" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
            </svg>
          </div>
        </div>

        <span className="pointer-events-none absolute left-3 top-3 etiket rounded bg-white/92 px-2.5 py-1.5 text-deniz-700 backdrop-blur-sm">
          {t("orijinal", dil)}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 etiket rounded bg-terra-500 px-2.5 py-1.5 text-white">
          {secili.ad[dil]}
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded bg-black/55 px-2.5 py-1.5 text-[10.5px] text-white/90 backdrop-blur-sm">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2l1.9 5.7L19.6 9l-5.7 1.9L12 16.6l-1.9-5.7L4.4 9l5.7-1.3L12 2z"/>
          </svg>
          {t("aiRozet", dil)}
        </span>
      </div>

      <p className="px-5 py-3 text-center text-[12px] text-sis md:px-6">
        ← {t("karsilastir", dil)} →
      </p>
    </section>
  );
}
