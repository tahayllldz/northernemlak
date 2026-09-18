import { Dil, TapuAsama } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

/**
 * TAPU ZINCIRI
 *
 * KKTC'de alicinin en buyuk bilinmezi tapunun tipi degil, surecin neresinde
 * takildigi. Yabanci alici Bakanlar Kurulu iznini beklerken yillar gecebiliyor.
 * Ne 101evler'de ne de bayut/propertyfinder'da bunun karsiligi var — cunku
 * baska hicbir pazarda boyle bir sure yok.
 *
 * Sureler gozlemlenen tipik araliklardir, taahhut degildir; arayuz bunu soyluyor.
 */
const ADIMLAR: { asama: TapuAsama; anahtar: "asInsaat" | "asKayit" | "asIzinBekliyor" | "asIzinAlindi" | "asDevredildi"; kalanAy: [number, number] }[] = [
  { asama: "insaat",        anahtar: "asInsaat",       kalanAy: [24, 42] },
  { asama: "kayit",         anahtar: "asKayit",        kalanAy: [14, 30] },
  { asama: "izin-bekliyor", anahtar: "asIzinBekliyor", kalanAy: [8, 20] },
  { asama: "izin-alindi",   anahtar: "asIzinAlindi",   kalanAy: [1, 3] },
  { asama: "devredildi",    anahtar: "asDevredildi",   kalanAy: [0, 0] },
];

export default function TapuZinciri({ asama, dil }: { asama: TapuAsama; dil: Dil }) {
  const simdikiIndeks = ADIMLAR.findIndex((a) => a.asama === asama);
  const simdiki = ADIMLAR[simdikiIndeks];
  const [enAz, enCok] = simdiki.kalanAy;

  return (
    <section id="bolum-tapu-zinciri">
      <h2 className="baslik mb-1.5 text-[22px] text-deniz-700">{t("tapuZinciri", dil)}</h2>
      <p className="mb-5 max-w-[62ch] text-[13.5px] leading-relaxed text-sis">{t("tapuZinciriAlt", dil)}</p>

      <div className="overflow-hidden rounded-xl border border-hat bg-white">
        <ol className="zincir">
          {ADIMLAR.map((a, n) => {
            const gecildi = n < simdikiIndeks;
            const aktif = n === simdikiIndeks;
            return (
              <li key={a.asama} className={`zincir-adim ${gecildi ? "gecildi" : ""} ${aktif ? "aktif" : ""}`}>
                <span className="zincir-nokta" aria-hidden>
                  {gecildi && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" >
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="zincir-metin">
                  {t(a.anahtar, dil)}
                  {aktif && <span className="gizli-metin"> — {t("tapuZinciri", dil)}</span>}
                </span>
              </li>
            );
          })}
        </ol>

        {enCok > 0 && (
          <p className="border-t border-hat bg-kum-50 px-5 py-3 text-[13.5px] text-murekkep">
            {t("tapuSureNot", dil)}:{" "}
            <b className="font-semibold text-deniz-700">{enAz}–{enCok} {t("tapuAy", dil)}</b>
          </p>
        )}

        <p className="border-t border-hat px-5 py-2.5 text-[11.5px] leading-relaxed text-sis">
          {t("tapuZinciriUyari", dil)}
        </p>
      </div>
    </section>
  );
}
