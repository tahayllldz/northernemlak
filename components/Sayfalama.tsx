import Link from "next/link";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

/**
 * Sayfalama. Onceden butun ilanlar tek sayfada diziliyordu; 23 ilanlik demo
 * veride sorun degildi ama rakipte Girne'de 12.337 ilan var (bkz. analiz).
 * Sunucu tarafinda, baglantiyla — JS olmadan da calisir, SEO icin de dogru.
 */
export const SAYFA_BOYU = 12;

export default function Sayfalama({
  dil, sayfa, toplamSayfa, sorgu,
}: { dil: Dil; sayfa: number; toplamSayfa: number; sorgu: Record<string, string | undefined> }) {
  if (toplamSayfa <= 1) return null;

  const yol = (n: number) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(sorgu)) if (v && k !== "sayfa") p.set(k, v);
    if (n > 1) p.set("sayfa", String(n));
    const q = p.toString();
    return `/${dil}/ilan${q ? `?${q}` : ""}`;
  };

  // 1 … 4 5 [6] 7 8 … 20
  const numaralar: (number | "...")[] = [];
  const ekle = (n: number) => { if (!numaralar.includes(n)) numaralar.push(n); };
  ekle(1);
  if (sayfa - 2 > 2) numaralar.push("...");
  for (let n = Math.max(2, sayfa - 1); n <= Math.min(toplamSayfa - 1, sayfa + 1); n++) ekle(n);
  if (sayfa + 2 < toplamSayfa - 1) numaralar.push("...");
  if (toplamSayfa > 1) ekle(toplamSayfa);

  const dugme = "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-[13.5px] transition";

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label={t("sayfa", dil)}>
      {sayfa > 1 ? (
        <Link href={yol(sayfa - 1)} rel="prev"
          className={`${dugme} border-hat bg-white text-murekkep hover:border-deniz-300`}>
          {t("onceki", dil)}
        </Link>
      ) : (
        <span className={`${dugme} border-hat bg-kum-100 text-sis`} aria-disabled>{t("onceki", dil)}</span>
      )}

      {numaralar.map((n, i) =>
        n === "..." ? (
          <span key={`a${i}`} className="px-1 text-sis" aria-hidden>…</span>
        ) : n === sayfa ? (
          <span key={n} aria-current="page"
            className={`${dugme} border-deniz-700 bg-deniz-700 font-medium text-kum-50`}>{n}</span>
        ) : (
          <Link key={n} href={yol(n)}
            className={`${dugme} border-hat bg-white text-murekkep hover:border-deniz-300`}>{n}</Link>
        )
      )}

      {sayfa < toplamSayfa ? (
        <Link href={yol(sayfa + 1)} rel="next"
          className={`${dugme} border-hat bg-white text-murekkep hover:border-deniz-300`}>
          {t("sonraki", dil)}
        </Link>
      ) : (
        <span className={`${dugme} border-hat bg-kum-100 text-sis`} aria-disabled>{t("sonraki", dil)}</span>
      )}
    </nav>
  );
}
