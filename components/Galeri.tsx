"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

export default function Galeri({ gorseller, baslik, dil }: { gorseller: string[]; baslik: string; dil: Dil }) {
  const [i, setI] = useState(0);
  const [tamEkran, setTamEkran] = useState(false);
  const git = useCallback(
    (y: number) => setI((v) => (v + y + gorseller.length) % gorseller.length),
    [gorseller.length]
  );

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-kum-200 kart-golge">
        <button type="button" onClick={() => setTamEkran(true)} aria-label={t("tumFotograflar", dil)}
          className="absolute inset-0 z-[1] cursor-zoom-in">
          <Image src={gorseller[i]} alt={baslik} fill priority sizes="(max-width:1024px) 100vw, 66vw" className="object-cover" />
        </button>

        {gorseller.length > 1 && (
          <>
            {([["‹", -1, "left-3", t("oncekiFoto", dil)], ["›", 1, "right-3", t("sonrakiFoto", dil)]] as const).map(([s, y, k, ad]) => (
              <button key={k} onClick={() => git(y)} aria-label={ad} type="button"
                className={`absolute top-1/2 ${k} z-[2] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-[22px] leading-none text-deniz-700 backdrop-blur-sm transition hover:bg-white`}>
                <span aria-hidden>{s}</span>
              </button>
            ))}
            <span className="pointer-events-none absolute bottom-3 left-3 z-[2] rounded bg-black/50 px-2.5 py-1 text-[11.5px] text-white backdrop-blur-sm">
              {i + 1} / {gorseller.length}
            </span>
          </>
        )}
        <span className="damga z-[2]">{t("temsiliGorsel", dil)}</span>
      </div>

      {gorseller.length > 1 && (
        <div className="cip-serit mt-2.5">
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

      {tamEkran && (
        <TamEkran gorseller={gorseller} baslik={baslik} dil={dil} i={i} setI={setI} git={git}
          kapat={() => setTamEkran(false)} />
      )}
    </div>
  );
}

/** Tam ekran galeri: ok tuslari, ESC, odak tuzagi. */
function TamEkran({
  gorseller, baslik, dil, i, setI, git, kapat,
}: {
  gorseller: string[]; baslik: string; dil: Dil;
  i: number; setI: (n: number) => void; git: (y: number) => void; kapat: () => void;
}) {
  const kutuRef = useRef<HTMLDivElement>(null);
  const kapatRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    kapatRef.current?.focus();
    const tus = (e: KeyboardEvent) => {
      if (e.key === "Escape") { kapat(); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); git(-1); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); git(1); return; }
      if (e.key !== "Tab" || !kutuRef.current) return;
      const oge = kutuRef.current.querySelectorAll<HTMLElement>("button");
      if (!oge.length) return;
      const ilk = oge[0], son = oge[oge.length - 1];
      if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
      else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
    };
    document.addEventListener("keydown", tus);
    const eski = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", tus); document.body.style.overflow = eski; };
  }, [git, kapat]);

  return (
    <div ref={kutuRef} className="ekran" role="dialog" aria-modal="true" aria-label={baslik}>
      <div className="ekran-bas">
        <span className="text-[13px] text-white/75">{i + 1} / {gorseller.length}</span>
        <button ref={kapatRef} type="button" onClick={kapat} aria-label={t("kapat", dil)} className="ekran-dugme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="ekran-govde">
        <Image src={gorseller[i]} alt={baslik} fill sizes="100vw" className="object-contain" />
        <span className="damga">{t("temsiliGorsel", dil)}</span>
      </div>

      {gorseller.length > 1 && (
        <>
          <button type="button" onClick={() => git(-1)} aria-label={t("oncekiFoto", dil)}
            className="ekran-dugme absolute left-3 top-1/2 -translate-y-1/2 text-[24px]">
            <span aria-hidden>‹</span>
          </button>
          <button type="button" onClick={() => git(1)} aria-label={t("sonrakiFoto", dil)}
            className="ekran-dugme absolute right-3 top-1/2 -translate-y-1/2 text-[24px]">
            <span aria-hidden>›</span>
          </button>

          <div className="ekran-serit">
            {gorseller.map((g, n) => (
              <button key={g} type="button" onClick={() => setI(n)}
                aria-label={`${t("foto", dil)} ${n + 1}`} aria-current={n === i ? "true" : undefined}
                className={`relative h-[52px] w-[78px] shrink-0 overflow-hidden rounded border-2 transition
                  ${n === i ? "border-terra-500" : "border-transparent opacity-50 hover:opacity-90"}`}>
                <Image src={g} alt="" fill sizes="78px" className="object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
