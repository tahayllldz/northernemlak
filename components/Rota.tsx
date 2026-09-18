"use client";
import { useState } from "react";
import { Ilan, Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { kusUcusuKm, sehirAdi } from "@/lib/yardimci";

/**
 * GORUNTULEME ROTASI
 *
 * Yabanci alici iki gunlugune ucakla gelip sekiz mulk geziyor. Compass ve
 * Airbnb bunu yapmiyor cunku onlarin alicisi zaten sehirde yasiyor.
 * Ucarak gelen bir pazar icin gercekten faydali.
 *
 * En yakin komsu (nearest neighbour) ile siralanir — optimal degil, ama
 * rastgele sıradan cok daha iyi ve anlasilir.
 */
const HIZ_KMS = 45;        // KKTC yollarinda makul ortalama
const GORUNTULEME_DK = 30; // her mulk icin

export default function Rota({ ilanlar, dil }: { ilanlar: Ilan[]; dil: Dil }) {
  const [acik, setAcik] = useState(false);
  if (ilanlar.length < 2) return null;

  // En batidaki mulkten basla, hep en yakina git
  const kalan = [...ilanlar].sort((a, b) => a.konum.lng - b.konum.lng);
  const sira: Ilan[] = [kalan.shift()!];
  const mesafeler: number[] = [0];
  while (kalan.length) {
    const son = sira[sira.length - 1];
    let enYakin = 0;
    let enKisa = Infinity;
    kalan.forEach((x, n) => {
      const d = kusUcusuKm(son.konum, x.konum);
      if (d < enKisa) { enKisa = d; enYakin = n; }
    });
    mesafeler.push(enKisa);
    sira.push(kalan.splice(enYakin, 1)[0]);
  }

  const toplamKm = mesafeler.reduce((a, b) => a + b, 0);
  const toplamDk = Math.round((toplamKm / HIZ_KMS) * 60 + sira.length * GORUNTULEME_DK);
  const saat = Math.floor(toplamDk / 60);
  const dakika = toplamDk % 60;

  return (
    <div className="mb-10">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setAcik((v) => !v)}
          className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-medium transition
            ${acik ? "bg-deniz-700 text-kum-50" : "border border-hat bg-white text-murekkep hover:border-deniz-300"}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
            <circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" />
            <path d="M8.5 6H14a4 4 0 0 1 0 8h-4a4 4 0 0 0 0 8h5.5" strokeLinecap="round" />
          </svg>
          {acik ? t("rotaKapat", dil) : t("rotaOlustur", dil)}
        </button>
      </div>

      {acik && (
        <div className="overflow-hidden rounded-xl border border-hat bg-white">
          <div className="border-b border-hat px-5 py-4">
            <h2 className="baslik text-[19px] text-deniz-700">{t("rotaBaslik", dil)}</h2>
            <p className="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-sis">{t("rotaAlt", dil)}</p>
          </div>

          <ol className="zincir">
            {sira.map((i, n) => (
              <li key={i.id} className="zincir-adim gecildi">
                <span className="zincir-nokta text-[11px] font-semibold" aria-hidden>{n + 1}</span>
                <span className="zincir-metin">
                  <b className="font-medium text-murekkep">{i.bolge}, {sehirAdi(i.sehir, dil)}</b>
                  {n > 0 && <span className="ml-2 text-sis">+{mesafeler[n].toFixed(1)} km</span>}
                </span>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-2 gap-px border-t border-hat bg-hat">
            <div className="bg-deniz-50 px-4 py-3.5 text-center">
              <p className="etiket text-deniz-500">{t("rotaToplam", dil)}</p>
              <p className="baslik mt-1 text-[21px] leading-none tabular-nums text-deniz-700">{toplamKm.toFixed(0)} km</p>
            </div>
            <div className="bg-deniz-50 px-4 py-3.5 text-center">
              <p className="etiket text-deniz-500">{t("rotaSure", dil)}</p>
              <p className="baslik mt-1 text-[21px] leading-none tabular-nums text-deniz-700">
                {saat}{t("saatKisa", dil)} {dakika}{t("dakKisa", dil)}
              </p>
            </div>
          </div>

          <p className="border-t border-hat px-5 py-2.5 text-[11.5px] leading-relaxed text-sis">{t("rotaNot", dil)}</p>
        </div>
      )}
    </div>
  );
}
