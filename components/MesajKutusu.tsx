"use client";
import { useEffect, useRef, useState } from "react";
import { Dil, Emlakci } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

/**
 * "Mesaj gonder" dugmesi olu duruyordu — tiklaninca hicbir sey olmuyordu.
 * Prototipte sunucu yok, o yuzden metin WhatsApp'a aktariliyor ve bu durum
 * kullaniciya aciklaniyor. Faz 1'de lead sistemine baglanir.
 */
export default function MesajKutusu({
  e, dil, ilanBaslik, ilanYolu,
}: { e: Emlakci; dil: Dil; ilanBaslik?: string; ilanYolu?: string }) {
  const [acik, setAcik] = useState(false);
  const [metin, setMetin] = useState("");
  const kutuRef = useRef<HTMLDivElement>(null);
  const ilkRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!acik) return;
    setMetin(t("mesajYerTutucu", dil));
    ilkRef.current?.focus();
    const tus = (ev: KeyboardEvent) => { if (ev.key === "Escape") setAcik(false); };
    document.addEventListener("keydown", tus);
    const eski = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", tus); document.body.style.overflow = eski; };
  }, [acik, dil]);

  const gonder = () => {
    const parcalar = [metin.trim()];
    if (ilanBaslik) parcalar.push(`\n${ilanBaslik}`);
    if (ilanYolu && typeof window !== "undefined") parcalar.push(`${window.location.origin}${ilanYolu}`);
    window.open(`https://wa.me/${e.whatsapp}?text=${encodeURIComponent(parcalar.join("\n"))}`, "_blank", "noopener");
    setAcik(false);
  };

  return (
    <>
      <button type="button" onClick={() => setAcik(true)}
        className="w-full rounded-md border border-hat bg-white py-2.5 text-[14px] text-murekkep transition hover:bg-kum-100">
        {t("mesajGonder", dil)}
      </button>

      {acik && (
        <>
          <div className="panel-fon" onClick={() => setAcik(false)} aria-hidden />
          <div ref={kutuRef} className="panel" role="dialog" aria-modal="true" aria-label={t("mesajBaslik", dil)}>
            <div className="panel-tutamac" />
            <div className="panel-bas">
              <h2 className="baslik text-[19px] text-deniz-700">{t("mesajBaslik", dil)}</h2>
              <button type="button" onClick={() => setAcik(false)} aria-label={t("kapat", dil)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-sis transition hover:bg-kum-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="panel-govde pt-4">
              <p className="mb-3 text-[13px] text-murekkep">{e.ad} · {e.firma}</p>
              <textarea ref={ilkRef} value={metin} onChange={(ev) => setMetin(ev.target.value)}
                rows={5} aria-label={t("mesajBaslik", dil)}
                className="alan resize-y leading-relaxed" />
              <p className="mt-3 text-[11.5px] leading-relaxed text-sis">{t("mesajAciklama", dil)}</p>
            </div>

            <div className="panel-alt">
              <button type="button" onClick={() => setAcik(false)}
                className="text-[13.5px] text-sis underline-offset-2 transition hover:text-terra-500 hover:underline">
                {t("kapat", dil)}
              </button>
              <button type="button" onClick={gonder} disabled={!metin.trim()}
                className="flex items-center gap-2 rounded-md bg-deniz-700 px-5 py-2.5 text-[14px] font-medium text-kum-50 transition hover:bg-deniz-900 disabled:opacity-50">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
                </svg>
                {t("whatsappGonder", dil)}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
