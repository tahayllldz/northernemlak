import Link from "next/link";
import Logo from "./Logo";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { SEHIRLER, sehirAdi } from "@/lib/yardimci";

export default function Altbilgi({ dil }: { dil: Dil }) {
  return (
    <footer className="mt-20 border-t border-hat bg-deniz-900 text-kum-200">
      <div className="kapsayici py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo dil={dil} koyu />
            <p className="mt-4 max-w-[34ch] text-[13.5px] leading-relaxed text-kum-200/70">
              {t("kahramanAlt", dil)}
            </p>
          </div>
          <div>
            <h4 className="etiket mb-3 text-terra-400">{t("satilik", dil)}</h4>
            <ul className="space-y-2 text-[13.5px]">
              {SEHIRLER.map((s) => (
                <li key={s}><Link href={`/${dil}/ilan?islem=satilik&sehir=${encodeURIComponent(s)}`}
                  className="text-kum-200/75 transition hover:text-terra-400">{sehirAdi(s, dil)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="etiket mb-3 text-terra-400">{t("kiralik", dil)}</h4>
            <ul className="space-y-2 text-[13.5px]">
              {SEHIRLER.map((s) => (
                <li key={s}><Link href={`/${dil}/ilan?islem=kiralik&sehir=${encodeURIComponent(s)}`}
                  className="text-kum-200/75 transition hover:text-terra-400">{sehirAdi(s, dil)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="etiket mb-3 text-terra-400">{t("rehber", dil)}</h4>
            <ul className="space-y-2 text-[13.5px] text-kum-200/75">
              <li><Link href={`/${dil}/ilan?ai=1`} className="transition hover:text-terra-400">{t("aiIleTasarlandi", dil)}</Link></li>
              <li><Link href={`/${dil}/emlakci`} className="transition hover:text-terra-400">{t("emlakcilar", dil)}</Link></li>
              <li><span>{t("tapuTipi", dil)}</span></li>
              <li><span>{t("bolgelerBaslik", dil)}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-kum-200/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 NorthernEmlak. {t("altbilgiHak", dil)}</p>
          <p className="max-w-[62ch]">{t("altbilgiNot", dil)}</p>
        </div>
      </div>
    </footer>
  );
}
