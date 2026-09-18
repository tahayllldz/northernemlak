"use client";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Dil, OzellikKodu } from "@/lib/tipler";
import { t, ozellikAdi } from "@/lib/sozluk";
import { SEHIRLER, TIPLER, HIZLI_OZELLIKLER, aktifFiltreSayisi, sehirAdi, sehirSayilari, tipAdi } from "@/lib/yardimci";
import FiltrePaneli from "./FiltrePaneli";

export default function Filtreler({ dil, adet }: { dil: Dil; adet: number }) {
  const sp = useSearchParams();
  const router = useRouter();
  const yol = usePathname();
  const [panelAcik, setPanelAcik] = useState(false);

  const yaz = (p: URLSearchParams) => router.push(p.toString() ? `${yol}?${p}` : yol, { scroll: false });

  const ayarla = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v); else p.delete(k);
    yaz(p);
  };

  const g = (k: string) => sp.get(k) ?? "";
  const kutu = "rounded-md border border-hat bg-white px-3 py-2 text-[13.5px] text-murekkep outline-none transition focus:border-deniz-300 cursor-pointer";

  const secili = (g("oz") || "").split(",").filter(Boolean) as OzellikKodu[];
  const ozellikDegis = (kod: OzellikKodu) => {
    const yeni = secili.includes(kod) ? secili.filter((o) => o !== kod) : [...secili, kod];
    ayarla("oz", yeni.join(","));
  };

  const filtreSayisi = aktifFiltreSayisi(sp);
  const sayilar = sehirSayilari();

  return (
    <>
      <div className="sticky top-[68px] z-20 border-b border-hat bg-kum-50/95 backdrop-blur-md">
        <div className="kapsayici py-3">
          {/* 1. SATIR — birincil filtreler */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-hat bg-white">
              {(["", "satilik", "kiralik"] as const).map((k) => (
                <button key={k || "hepsi"} type="button" onClick={() => ayarla("islem", k)}
                  aria-pressed={g("islem") === k}
                  className={`px-3.5 py-2 text-[13px] font-medium transition
                    ${g("islem") === k ? "bg-deniz-700 text-kum-50" : "text-murekkep hover:bg-kum-100"}`}>
                  {k ? t(k, dil) : t("hepsi", dil)}
                </button>
              ))}
            </div>

            <select aria-label={t("tumSehirler", dil)} value={g("sehir")}
              onChange={(e) => ayarla("sehir", e.target.value)} className={`${kutu} hidden md:block`}>
              <option value="">{t("tumSehirler", dil)}</option>
              {SEHIRLER.map((s) => (
                <option key={s} value={s}>
                  {sehirAdi(s, dil)} ({sayilar.find((x) => x.sehir === s)?.adet ?? 0})
                </option>
              ))}
            </select>

            <select aria-label={t("tumTipler", dil)} value={g("tip")}
              onChange={(e) => ayarla("tip", e.target.value)} className={`${kutu} hidden md:block`}>
              <option value="">{t("tumTipler", dil)}</option>
              {TIPLER.map((x) => <option key={x} value={x}>{tipAdi(x, dil)}</option>)}
            </select>

            {/* Sayi rozeti: hangi filtrenin acik oldugu paneli acmadan gorunur */}
            <button type="button" onClick={() => setPanelAcik(true)}
              className="flex items-center gap-2 rounded-md border border-hat bg-white px-3.5 py-2 text-[13px] font-medium text-murekkep transition hover:border-deniz-300">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              {t("tumFiltreler", dil)}
              {filtreSayisi > 0 && <span className="sayi-rozet">{filtreSayisi}</span>}
            </button>

            {filtreSayisi > 0 && (
              <button type="button" onClick={() => router.push(yol, { scroll: false })}
                className="px-1 text-[13px] text-sis underline-offset-2 transition hover:text-terra-500 hover:underline">
                {t("temizle", dil)}
              </button>
            )}

            <div className="ml-auto flex items-center gap-3">
              <span className="whitespace-nowrap text-[13px] text-sis">
                <b className="font-semibold text-murekkep">{adet}</b> {t("sonuc", dil)}
              </span>
              <select aria-label={t("sirala", dil)} value={g("sirala")}
                onChange={(e) => ayarla("sirala", e.target.value)} className={kutu}>
                <option value="">{t("sonEklenen", dil)}</option>
                <option value="fiyat-artan">{t("fiyatArtan", dil)}</option>
                <option value="fiyat-azalan">{t("fiyatAzalan", dil)}</option>
              </select>
            </div>
          </div>

          {/* 2. SATIR — hizli cipler. Mobilde yatay kayar (tasma degil, kasitli). */}
          <div className="cip-serit mt-2.5">
            <button type="button" onClick={() => ayarla("ai", g("ai") ? "" : "1")}
              aria-pressed={!!g("ai")} className="cip-dugme">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l1.9 5.7L19.6 9l-5.7 1.9L12 16.6l-1.9-5.7L4.4 9l5.7-1.3L12 2z" />
              </svg>
              {t("aiIleTasarlandi", dil)}
            </button>

            <button type="button" onClick={() => ayarla("yabanci", g("yabanci") ? "" : "1")}
              aria-pressed={!!g("yabanci")} className="cip-dugme">
              {t("yabanciUygun", dil)}
            </button>

            {HIZLI_OZELLIKLER.map((kod) => (
              <button key={kod} type="button" onClick={() => ozellikDegis(kod)}
                aria-pressed={secili.includes(kod)} className="cip-dugme">
                {ozellikAdi(kod, dil)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {panelAcik && (
        <FiltrePaneli
          dil={dil}
          baslangic={Object.fromEntries(sp.entries())}
          kapat={() => setPanelAcik(false)}
          uygula={(taslak) => {
            const p = new URLSearchParams();
            for (const [k, v] of Object.entries(taslak)) if (v) p.set(k, v);
            yaz(p);
            setPanelAcik(false);
          }}
        />
      )}
    </>
  );
}
