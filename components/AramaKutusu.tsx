"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { SEHIRLER, TIPLER, sehirAdi, tipAdi } from "@/lib/yardimci";

export default function AramaKutusu({ dil, buyuk = false }: { dil: Dil; buyuk?: boolean }) {
  const router = useRouter();
  const [islem, setIslem] = useState("satilik");
  const [sehir, setSehir] = useState("");
  const [tip, setTip] = useState("");
  const [max, setMax] = useState("");

  const gonder = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams({ islem });
    if (sehir) p.set("sehir", sehir);
    if (tip) p.set("tip", tip);
    if (max) p.set("max", max);
    router.push(`/${dil}/ilan?${p}`);
  };

  const sec = "w-full bg-transparent text-[14px] text-murekkep outline-none appearance-none cursor-pointer";
  const alan = "flex-1 min-w-0 px-4 py-3 md:py-3.5";

  return (
    <div className={buyuk ? "w-full max-w-[880px]" : "w-full"}>
      <div className="mb-2 inline-flex overflow-hidden rounded-t-lg bg-white/12 p-1 backdrop-blur-sm">
        {(["satilik", "kiralik"] as const).map((k) => (
          <button key={k} onClick={() => setIslem(k)}
            className={`rounded px-5 py-2 text-[13.5px] font-medium transition
              ${islem === k ? "bg-kum-50 text-deniz-700" : "text-kum-100 hover:bg-white/10"}`}>
            {t(k, dil)}
          </button>
        ))}
      </div>

      <form onSubmit={gonder}
        className="flex flex-col divide-y divide-hat rounded-lg bg-kum-50 kart-golge-yukari md:flex-row md:items-stretch md:divide-x md:divide-y-0">
        <label className={alan}>
          <span className="etiket mb-0.5 block text-sis">{t("bolgelerBaslik", dil)}</span>
          <select value={sehir} onChange={(e) => setSehir(e.target.value)} className={sec}>
            <option value="">{t("tumSehirler", dil)}</option>
            {SEHIRLER.map((s) => <option key={s} value={s}>{sehirAdi(s, dil)}</option>)}
          </select>
        </label>

        <label className={alan}>
          <span className="etiket mb-0.5 block text-sis">{t("tumTipler", dil)}</span>
          <select value={tip} onChange={(e) => setTip(e.target.value)} className={sec}>
            <option value="">{t("tumTipler", dil)}</option>
            {TIPLER.map((x) => <option key={x} value={x}>{tipAdi(x, dil)}</option>)}
          </select>
        </label>

        <label className={alan}>
          <span className="etiket mb-0.5 block text-sis">{t("enCok", dil)} (£)</span>
          <input value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric" placeholder="500000"
            className="w-full bg-transparent text-[14px] text-murekkep outline-none placeholder:text-sis" />
        </label>

        <button type="submit"
          className="flex items-center justify-center gap-2 bg-deniz-700 px-7 py-4 text-[14px] font-medium text-kum-50 transition hover:bg-deniz-900 md:rounded-r-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          {t("ara", dil)}
        </button>
      </form>
    </div>
  );
}
