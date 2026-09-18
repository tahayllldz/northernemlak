"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { SEHIRLER, TIPLER, sehirAdi, tipAdi } from "@/lib/yardimci";

export default function Filtreler({ dil, adet }: { dil: Dil; adet: number }) {
  const sp = useSearchParams();
  const router = useRouter();
  const yol = usePathname();

  const ayarla = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v); else p.delete(k);
    router.push(`${yol}?${p}`, { scroll: false });
  };

  const g = (k: string) => sp.get(k) ?? "";
  const kutu = "rounded-md border border-hat bg-white px-3 py-2 text-[13.5px] text-murekkep outline-none transition focus:border-deniz-300 cursor-pointer";
  const aktif = [...sp.keys()].filter((k) => k !== "sirala").length > 0;

  return (
    <div className="sticky top-[68px] z-20 border-b border-hat bg-kum-50/95 backdrop-blur-md">
      <div className="kapsayici flex flex-wrap items-center gap-2 py-3.5">
        <div className="flex overflow-hidden rounded-md border border-hat bg-white">
          {(["", "satilik", "kiralik"] as const).map((k) => (
            <button key={k || "hepsi"} onClick={() => ayarla("islem", k)}
              className={`px-3.5 py-2 text-[13px] font-medium transition
                ${g("islem") === k ? "bg-deniz-700 text-kum-50" : "text-murekkep hover:bg-kum-100"}`}>
              {k ? t(k, dil) : (dil === "tr" ? "Hepsi" : dil === "ru" ? "Все" : "All")}
            </button>
          ))}
        </div>

        <select aria-label={t("tumSehirler", dil)} value={g("sehir")} onChange={(e) => ayarla("sehir", e.target.value)} className={kutu}>
          <option value="">{t("tumSehirler", dil)}</option>
          {SEHIRLER.map((s) => <option key={s} value={s}>{sehirAdi(s, dil)}</option>)}
        </select>

        <select aria-label={t("tumTipler", dil)} value={g("tip")} onChange={(e) => ayarla("tip", e.target.value)} className={kutu}>
          <option value="">{t("tumTipler", dil)}</option>
          {TIPLER.map((x) => <option key={x} value={x}>{tipAdi(x, dil)}</option>)}
        </select>

        <input value={g("max")} onChange={(e) => ayarla("max", e.target.value.replace(/\D/g, ""))}
          placeholder={`${t("enCok", dil)} £`} inputMode="numeric" aria-label={`${t("enCok", dil)} £`}
          className={`${kutu} w-[110px] cursor-text placeholder:text-sis`} />

        <button onClick={() => ayarla("ai", g("ai") ? "" : "1")}
          className={`flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-[13px] font-medium transition
            ${g("ai") ? "border-terra-500 bg-terra-500 text-white" : "border-hat bg-white text-murekkep hover:bg-kum-100"}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2l1.9 5.7L19.6 9l-5.7 1.9L12 16.6l-1.9-5.7L4.4 9l5.7-1.3L12 2z"/>
          </svg>
          {t("aiIleTasarlandi", dil)}
        </button>

        {aktif && (
          <button onClick={() => router.push(yol, { scroll: false })}
            className="px-2 text-[13px] text-sis underline-offset-2 transition hover:text-terra-500 hover:underline">
            {t("temizle", dil)}
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-[13px] text-sis"><b className="font-semibold text-murekkep">{adet}</b> {t("sonuc", dil)}</span>
          <select aria-label={t("sirala", dil)} value={g("sirala")} onChange={(e) => ayarla("sirala", e.target.value)} className={kutu}>
            <option value="">{t("sonEklenen", dil)}</option>
            <option value="fiyat-artan">{t("fiyatArtan", dil)}</option>
            <option value="fiyat-azalan">{t("fiyatAzalan", dil)}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
