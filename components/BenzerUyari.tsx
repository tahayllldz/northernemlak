import Link from "next/link";
import { Dil, Ilan } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { cokBenzerler, emlakciBul, fiyatYaz } from "@/lib/yardimci";

/**
 * MUKERRER ILAN SEFFAFLIGI
 *
 * KKTC'de coklu acente listelemesi kural, istisna degil: ayni daire uc ofiste
 * uc fiyata durur ve alici bunu asla goremez. Portallar bunu moderasyonla
 * gizler — cunku geliri emlakciden gelir.
 *
 * Biz gosteriyoruz. Bu ticari olarak tartismali bir karardir ve musterinin
 * bilerek vermesi gereken bir karardir (bkz. analiz/arayuz-analizi.md).
 * Yumusak surum: "cok benziyor" deniyor, "ayni mulk" iddia edilmiyor.
 */
export default function BenzerUyari({ ilan, dil }: { ilan: Ilan; dil: Dil }) {
  const liste = cokBenzerler(ilan);
  if (liste.length === 0) return null;

  const fiyatlar = [ilan.fiyat, ...liste.map((x) => x.fiyat)];
  const enAz = Math.min(...fiyatlar);
  const enCok = Math.max(...fiyatlar);
  const fark = enCok - enAz;

  return (
    <section id="bolum-benzer-uyari">
      <h2 className="baslik mb-1.5 text-[22px] text-deniz-700">{t("mukerrerBaslik", dil)}</h2>
      <p className="mb-4 max-w-[62ch] text-[13.5px] leading-relaxed text-sis">{t("mukerrerAlt", dil)}</p>

      <div className="overflow-hidden rounded-xl border-2 border-terra-100 bg-white">
        {fark > 0 && (
          <p className="border-b border-terra-100 bg-terra-100/40 px-5 py-3 text-[14px] text-terra-600">
            {t("fiyatFarki", dil)}:{" "}
            <b className="font-semibold">{fiyatYaz(enAz, "GBP", dil)} – {fiyatYaz(enCok, "GBP", dil)}</b>
            <span className="ml-2 text-[12.5px]">(+{fiyatYaz(fark, "GBP", dil)})</span>
          </p>
        )}

        <ul className="divide-y divide-hat">
          {liste.map((x) => {
            const e = emlakciBul(x.emlakci);
            return (
              <li key={x.id}>
                <Link href={`/${dil}/ilan/${x.slug}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 transition hover:bg-kum-50">
                  <span className="min-w-0">
                    <span className="block text-[14px] text-murekkep">{e.firma}</span>
                    <span className="block text-[12.5px] text-sis">{x.m2} m² · #{x.id}</span>
                  </span>
                  <span className="baslik shrink-0 text-[19px] text-deniz-700">{fiyatYaz(x.fiyat, "GBP", dil)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
