import { Dil, Ilan } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { fiyatYaz } from "@/lib/yardimci";

/**
 * Satilikta toplam maliyet ve getiri var; kiralikta hicbir karsiligi yoktu.
 * KKTC'de kiraya girerken 3-6 ay pesin + depozito isteniyor ve alici bunu
 * sozlesme masasinda ogreniyor. Ilan fiyati aylik kirayi gosterir, girise
 * odenecek tutari degil — o yuzden burada toplaniyor.
 */
export default function KiraSartlari({ ilan, dil }: { ilan: Ilan; dil: Dil }) {
  if (ilan.islem !== "kiralik") return null;
  const pesin = ilan.pesinAy ?? 0;
  const depozito = ilan.depozito ?? 0;
  if (!pesin && !depozito) return null;

  const giris = ilan.fiyat * pesin + depozito;
  const satirlar: [string, string][] = [
    [t("pesinOdeme", dil), `${pesin} ${t("ayKisa", dil)} · ${fiyatYaz(ilan.fiyat * pesin, "GBP", dil)}`],
    [t("depozito", dil), fiyatYaz(depozito, "GBP", dil)],
    ...(ilan.minSureAy ? [[t("minSure", dil), `${ilan.minSureAy} ${t("ayKisa", dil)}`] as [string, string]] : []),
    ...(ilan.aidat ? [[t("aidat", dil), `${fiyatYaz(ilan.aidat, "GBP", dil)}${t("ayda", dil)}`] as [string, string]] : []),
  ];

  return (
    <section id="bolum-kira">
      <h2 className="baslik mb-1.5 text-[22px] text-deniz-700">{t("kiraSartlari", dil)}</h2>
      <p className="mb-4 max-w-[62ch] text-[13.5px] leading-relaxed text-sis">{t("kiraSartlariAlt", dil)}</p>

      <div className="overflow-hidden rounded-xl border border-hat bg-white">
        <ul className="divide-y divide-hat">
          {satirlar.map(([k, v]) => (
            <li key={k} className="flex items-baseline justify-between gap-4 px-5 py-3">
              <span className="text-[14px] text-murekkep">{k}</span>
              <span className="shrink-0 text-[14px] font-medium tabular-nums text-murekkep">{v}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between gap-4 border-t border-hat bg-deniz-50 px-5 py-4">
          <span className="etiket text-deniz-500">{t("girisToplam", dil)}</span>
          <span className="baslik text-[24px] leading-none tabular-nums text-deniz-700">
            {fiyatYaz(giris, "GBP", dil)}
          </span>
        </div>
      </div>
    </section>
  );
}
