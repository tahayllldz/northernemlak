"use client";
import Link from "next/link";
import { useState } from "react";
import { Ilan, Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { fiyatYaz } from "@/lib/yardimci";
import { useAyarlar } from "./Ayarlar";
import { FavoriDugme } from "./Favoriler";

/**
 * Detay sayfasi uzun (9 bolum). PropertyFinder modeli: kaydirirken ustte
 * daralmis fiyat basligi + bolum menusu + sonuclara donus kalir.
 */
export default function DetayUst({
  ilan, dil, bolumler,
}: { ilan: Ilan; dil: Dil; bolumler: { id: string; ad: string }[] }) {
  const { para } = useAyarlar();
  const [kopyalandi, setKopyalandi] = useState(false);

  const paylas = async () => {
    const baglanti = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: ilan.baslik[dil], url: baglanti }); return; }
      await navigator.clipboard.writeText(baglanti);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch { /* kullanici vazgecti veya izin yok */ }
  };

  return (
    <div className="detay-ust">
      <div className="kapsayici flex items-center gap-4 py-2.5">
        <Link href={`/${dil}/ilan`} className="flex shrink-0 items-center gap-1.5 text-[13px] text-sis transition hover:text-terra-500">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m14 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">{t("sonucaDon", dil)}</span>
        </Link>

        <p className="baslik shrink-0 text-[17px] leading-none text-deniz-700">
          {fiyatYaz(ilan.fiyat, para, dil)}
        </p>

        <nav className="cip-serit hidden flex-1 lg:flex" aria-label={t("konum", dil)}>
          {bolumler.map((b) => (
            <a key={b.id} href={`#${b.id}`} className="bolum-bag">{b.ad}</a>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {kopyalandi && <span className="hidden text-[12px] text-deniz-700 sm:inline">{t("kopyalandi", dil)}</span>}
          <button type="button" onClick={paylas} aria-label={t("paylas", dil)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-sis transition hover:bg-kum-200 hover:text-murekkep">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
              <path d="M12 3v13M12 3 8 7M12 3l4 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" strokeLinecap="round" />
            </svg>
          </button>
          <FavoriDugme id={ilan.id} dil={dil} />
        </div>
      </div>
    </div>
  );
}
