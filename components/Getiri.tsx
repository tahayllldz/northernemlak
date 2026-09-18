"use client";
import { Dil, Ilan } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { fiyatYaz } from "@/lib/yardimci";
import { getiriHesapla } from "@/lib/getiri";
import { useAyarlar } from "./Ayarlar";

/**
 * Yatirim getirisi — universite donemi mevsimselligiyle.
 * Kira tahmini kendi kiralik ilanlarimizin m2 medyanindan gelir; ornek
 * sayisi ekranda yazar ki kullanici neye baktigini bilsin.
 */
export default function Getiri({ ilan, dil }: { ilan: Ilan; dil: Dil }) {
  const { para } = useAyarlar();
  const h = getiriHesapla(ilan, dil);
  if (!h) return null;

  const yaz = (n: number) => fiyatYaz(Math.round(n), para, dil);
  const yuzde = (n: number) =>
    `${n.toLocaleString(dil === "tr" ? "tr-TR" : dil === "ru" ? "ru-RU" : "en-GB", { maximumFractionDigits: 1 })}%`;

  const satirlar: [string, string][] = [
    [t("tahminiKira", dil), `${yaz(h.aylikKira)}${t("ayda", dil)}`],
    ...(h.yazKirasi ? [[t("yazSezonu", dil), `${yaz(h.yazKirasi)}${t("ayda", dil)}`] as [string, string]] : []),
    [t("yillikBrutKira", dil), yaz(h.yillikBrut)],
    [t("yillikNetKira", dil), yaz(h.yillikNet)],
    [t("alimMaliyetiSat", dil), yaz(h.alimMaliyeti)],
  ];

  return (
    <section id="bolum-getiri">
      <h2 className="baslik mb-1.5 text-[22px] text-deniz-700">{t("getiriBaslik", dil)}</h2>
      <p className="mb-4 max-w-[62ch] text-[13.5px] leading-relaxed text-sis">{t("getiriAlt", dil)}</p>

      <div className="overflow-hidden rounded-xl border border-hat bg-white">
        {h.ogrenciSehri && (
          <p className="border-b border-hat bg-terra-100/50 px-5 py-3 text-[12.5px] leading-relaxed text-terra-600">
            {t("ogrenciNot", dil)}
          </p>
        )}

        <ul className="divide-y divide-hat">
          {satirlar.map(([k, v]) => (
            <li key={k} className="flex items-baseline justify-between gap-4 px-5 py-2.5">
              <span className="text-[14px] text-murekkep">{k}</span>
              <span className="shrink-0 text-[14px] font-medium tabular-nums text-murekkep">{v}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-3 gap-px border-t border-hat bg-hat">
          {[
            [t("brutGetiri", dil), yuzde(h.brutGetiri)],
            [t("netGetiri", dil), yuzde(h.netGetiri)],
            [t("geriOdeme", dil), `${h.geriOdemeYil.toFixed(0)} ${t("yilKisa", dil)}`],
          ].map(([k, v]) => (
            <div key={k} className="bg-deniz-50 px-4 py-3.5 text-center">
              <p className="etiket text-deniz-500">{k}</p>
              <p className="baslik mt-1 text-[22px] leading-none tabular-nums text-deniz-700">{v}</p>
            </div>
          ))}
        </div>

        <p className="border-t border-hat px-5 py-2.5 text-[11.5px] leading-relaxed text-sis">
          {h.ornekSayisi} {t("ornekIlan", dil)} · {t("getiriUyari", dil)}
        </p>
      </div>
    </section>
  );
}
