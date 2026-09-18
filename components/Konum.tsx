import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { mesafeler, sehirAdi } from "@/lib/yardimci";

/**
 * Harita Faz 1 kapsaminda. Sahte bir harita yer tutucusu koymak yerine
 * gercek hesaplanmis mesafeler gosteriyoruz — yabanci alicinin haritadan
 * aradigi bilgi zaten bu. Harita geldiginde bu bolum silinmez, yanina gelir.
 */
export default function Konum({
  dil, bolge, sehir, konum,
}: { dil: Dil; bolge: string; sehir: string; konum: { lat: number; lng: number } }) {
  const liste = mesafeler(konum, sehir, dil);

  return (
    <section id="bolum-konum">
      <h2 className="baslik mb-3 text-[22px] text-deniz-700">{t("konumBaslik", dil)}</h2>

      <div className="overflow-hidden rounded-xl border border-hat bg-white">
        <p className="flex items-center gap-2 border-b border-hat px-5 py-3.5 text-[15px] font-medium text-murekkep">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C4663A" strokeWidth="2" aria-hidden>
            <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" />
          </svg>
          {bolge}, {sehirAdi(sehir, dil)}
        </p>

        <ul className="divide-y divide-hat">
          {liste.map((m) => (
            <li key={m.ad} className="flex items-baseline justify-between gap-4 px-5 py-2.5">
              <span className="text-[14px] text-murekkep">{m.ad}</span>
              <span className="shrink-0 text-[14px] font-medium tabular-nums text-deniz-700">{m.km} km</span>
            </li>
          ))}
        </ul>

        <p className="border-t border-hat px-5 py-2.5 text-[11.5px] text-sis">{t("kusUcusu", dil)}</p>
      </div>
    </section>
  );
}
