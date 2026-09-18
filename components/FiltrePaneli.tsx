"use client";
import { useEffect, useRef, useState } from "react";
import { Dil, OzellikKodu, TapuTipi } from "@/lib/tipler";
import { t, OZELLIK_GRUPLARI, ozellikAdi } from "@/lib/sozluk";
import { TAPULAR, filtreOku, ilanlariSuz, tapuAdi } from "@/lib/yardimci";

type Taslak = Record<string, string>;

/**
 * Tum filtreler paneli. Mobilde alttan acilir sayfa, masaustunde pencere.
 * Degisiklikler taslakta tutulur, "Goster"e basilinca URL'e yazilir —
 * mobilde her tikta sayfa yenilenmesin diye (Airbnb / funda modeli).
 */
export default function FiltrePaneli({
  dil, baslangic, kapat, uygula,
}: {
  dil: Dil;
  baslangic: Taslak;
  kapat: () => void;
  uygula: (t: Taslak) => void;
}) {
  const [taslak, setTaslak] = useState<Taslak>(baslangic);
  const kutuRef = useRef<HTMLDivElement>(null);
  const ilkRef = useRef<HTMLButtonElement>(null);

  const ayarla = (k: string, v: string) =>
    setTaslak((t) => {
      const y = { ...t };
      if (v) y[k] = v; else delete y[k];
      return y;
    });

  const ozellikler = (taslak.oz ?? "").split(",").filter(Boolean) as OzellikKodu[];
  const ozellikDegis = (kod: OzellikKodu) => {
    const yeni = ozellikler.includes(kod) ? ozellikler.filter((o) => o !== kod) : [...ozellikler, kod];
    ayarla("oz", yeni.join(","));
  };

  const adet = ilanlariSuz(filtreOku(taslak), dil).length;

  // ESC ile kapat + odagi panelde tut
  useEffect(() => {
    ilkRef.current?.focus();
    const tus = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); kapat(); return; }
      if (e.key !== "Tab" || !kutuRef.current) return;
      const odaklanabilir = kutuRef.current.querySelectorAll<HTMLElement>(
        'button, input, select, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!odaklanabilir.length) return;
      const ilk = odaklanabilir[0], son = odaklanabilir[odaklanabilir.length - 1];
      if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
      else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
    };
    document.addEventListener("keydown", tus);
    const eskiTasma = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", tus); document.body.style.overflow = eskiTasma; };
  }, [kapat]);

  const g = (k: string) => taslak[k] ?? "";
  const sayiAlani = (k: string, yerTutucu: string) => (
    <input
      value={g(k)}
      onChange={(e) => ayarla(k, e.target.value.replace(/\D/g, ""))}
      inputMode="numeric" placeholder={yerTutucu} aria-label={yerTutucu}
      className="alan"
    />
  );

  return (
    <>
      <div className="panel-fon" onClick={kapat} aria-hidden />
      <div ref={kutuRef} className="panel" role="dialog" aria-modal="true" aria-label={t("tumFiltreler", dil)}>
        <div className="panel-tutamac" />
        <div className="panel-bas">
          <h2 className="baslik text-[19px] text-deniz-700">{t("tumFiltreler", dil)}</h2>
          <button ref={ilkRef} onClick={kapat} aria-label={t("kapat", dil)} type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-sis transition hover:bg-kum-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="panel-govde">
          <div className="space-y-6 pt-5">
            {/* FIYAT — cift uclu (Rightmove standardi; onceden sadece max vardi) */}
            <div>
              <span className="alan-etiket">{t("fiyatGbp", dil)}</span>
              <div className="flex items-center gap-2.5">
                {sayiAlani("min", t("enAz", dil))}
                <span className="text-sis">—</span>
                {sayiAlani("max", t("enCok", dil))}
              </div>
            </div>

            {/* ODA / BANYO */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="alan-etiket">{t("enAzOda", dil)}</span>
                <div className="cip-serit">
                  {["", "1", "2", "3", "4", "5"].map((n) => (
                    <button key={n || "x"} type="button" onClick={() => ayarla("oda", n)}
                      aria-pressed={g("oda") === n} className="cip-dugme">
                      {n ? `${n}+` : t("farketmez", dil)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="alan-etiket">{t("enAzBanyo", dil)}</span>
                <div className="cip-serit">
                  {["", "1", "2", "3", "4"].map((n) => (
                    <button key={n || "x"} type="button" onClick={() => ayarla("banyo", n)}
                      aria-pressed={g("banyo") === n} className="cip-dugme">
                      {n ? `${n}+` : t("farketmez", dil)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ALAN / BINA YASI */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="alan-etiket">{t("alanAralik", dil)}</span>
                <div className="flex items-center gap-2.5">
                  {sayiAlani("m2min", t("enAz", dil))}
                  <span className="text-sis">—</span>
                  {sayiAlani("m2max", t("enCok", dil))}
                </div>
              </div>
              <div>
                <span className="alan-etiket">{t("enFazlaYas", dil)}</span>
                {sayiAlani("yas", t("farketmez", dil))}
              </div>
            </div>

            {/* TAPU — rakipte yapisal olarak yok, bizim en guclu filtremiz */}
            <div>
              <span className="alan-etiket">{t("tapuTipi", dil)}</span>
              <div className="cip-serit">
                <button type="button" onClick={() => ayarla("tapu", "")}
                  aria-pressed={!g("tapu")} className="cip-dugme">{t("tumTapular", dil)}</button>
                {TAPULAR.map((tp: TapuTipi) => (
                  <button key={tp} type="button" onClick={() => ayarla("tapu", tp)}
                    aria-pressed={g("tapu") === tp} className="cip-dugme">{tapuAdi(tp, dil)}</button>
                ))}
              </div>
              <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[14px] text-murekkep">
                <input type="checkbox" checked={g("yabanci") === "1"}
                  onChange={(e) => ayarla("yabanci", e.target.checked ? "1" : "")}
                  className="h-4 w-4 accent-[#1B4D5C]" />
                {t("yabanciFiltre", dil)}
              </label>
              <label className="mt-2 flex cursor-pointer items-center gap-2.5 text-[14px] text-murekkep">
                <input type="checkbox" checked={g("ai") === "1"}
                  onChange={(e) => ayarla("ai", e.target.checked ? "1" : "")}
                  className="h-4 w-4 accent-[#C4663A]" />
                {t("aiFiltre", dil)}
              </label>
            </div>

            {/* OZELLIKLER — gruplu, yogunlugu yonetmek icin */}
            {(Object.keys(OZELLIK_GRUPLARI) as (keyof typeof OZELLIK_GRUPLARI)[]).map((grup) => (
              <div key={grup}>
                <span className="alan-etiket">{OZELLIK_GRUPLARI[grup].ad[dil]}</span>
                <div className="flex flex-wrap gap-2">
                  {OZELLIK_GRUPLARI[grup].kodlar.map((kod) => (
                    <button key={kod} type="button" onClick={() => ozellikDegis(kod)}
                      aria-pressed={ozellikler.includes(kod)} className="cip-dugme">
                      {ozellikAdi(kod, dil)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-alt">
          <button type="button" onClick={() => setTaslak({})}
            className="text-[13.5px] text-sis underline-offset-2 transition hover:text-terra-500 hover:underline">
            {t("temizle", dil)}
          </button>
          <button type="button" onClick={() => uygula(taslak)}
            className="rounded-md bg-deniz-700 px-5 py-2.5 text-[14px] font-medium text-kum-50 transition hover:bg-deniz-900">
            {adet} {t("sonucuGoster", dil)}
          </button>
        </div>
      </div>
    </>
  );
}
