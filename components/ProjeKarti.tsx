import Image from "next/image";
import Link from "next/link";
import { Dil, Proje } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { fiyatYaz, projeDurumAdi, sehirAdi, teslimYaz } from "@/lib/yardimci";

/** Ilan kartiyla ayni dil: kap yok, fotograf karttir. */
export default function ProjeKarti({ proje, dil, oncelik = false }: { proje: Proje; dil: Dil; oncelik?: boolean }) {
  const yuzde = Math.round((proje.satilan / proje.konutSayisi) * 100);
  const durumSinif =
    proje.durum === "tamamlandi" ? "cip-tapu" : proje.durum === "on-satis" ? "cip-uyari" : "";

  return (
    <Link href={`/${dil}/proje/${proje.slug}`} className="kart group block rounded-[10px]">
      <article>
        <div className="kart-medya">
          <Image src={proje.kapak} alt={proje.ad} fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            priority={oncelik} className="kart-foto" />
          <span className="rozet-foto absolute left-2.5 top-2.5 bg-white/92 text-deniz-700">
            {projeDurumAdi(proje.durum, dil)}
          </span>
          <span className="damga">{t("temsiliGorsel", dil)}</span>
        </div>

        <div className="pt-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="baslik text-[20px] leading-none text-deniz-700">{proje.ad}</p>
            <span className="shrink-0 text-[12.5px] text-sis">{teslimYaz(proje.teslim, dil)}</span>
          </div>

          <p className="mt-1.5 text-[14.5px] font-medium leading-snug text-murekkep">
            {proje.bolge}, {sehirAdi(proje.sehir, dil)}
          </p>

          <p className="mt-2 text-[13px] text-sis">
            {t("baslangicFiyat", dil)}{" "}
            <b className="font-semibold text-murekkep">{fiyatYaz(proje.baslangicFiyat, "GBP", dil)}</b>
            {" · "}{proje.odaSecenekleri.join(" · ")}
          </p>

          {/* Satis ilerlemesi — alicinin ilk sordugu sey "ne kadari gitti" */}
          <div className="mt-3">
            <div className="flex items-baseline justify-between text-[11.5px] text-sis">
              <span>{t("satilanOran", dil)} {proje.satilan}/{proje.konutSayisi}</span>
              <span>%{yuzde}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-kum-200">
              <div className="h-full rounded-full bg-deniz-500" style={{ width: `${yuzde}%` }} />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className={`cip ${durumSinif}`}>
              {t("pesinat", dil)} %{Math.round(proje.pesinatOrani * 100)}
            </span>
            {proje.taksitAy > 0 && (
              <span className="cip">{proje.taksitAy} {t("ayTaksit", dil)} {t("taksitPlani", dil).toLowerCase()}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
