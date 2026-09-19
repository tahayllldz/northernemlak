"use client";
import Image from "next/image";
import Link from "next/link";
import { Ilan, Dil } from "@/lib/tipler";
import { fiyatYaz, m2FiyatYaz, odaYaz, tazelikYaz, sehirAdi, tipAdi, tapuAdi } from "@/lib/yardimci";
import { t } from "@/lib/sozluk";
import { useAyarlar } from "./Ayarlar";
import { FavoriDugme } from "./Favoriler";

/**
 * Kart tasarimi: Compass ve Airbnb ayni sonuca varmis — kart kabi yok.
 * Golge, cerceve ve yukselme hareketi kaldirildi; fotograf karttir.
 * Fotograf ustunde en fazla iki rozet + zorunlu "temsili" damgasi kalir.
 */
export default function IlanKarti({ ilan, dil, oncelik = false, aiMod = false }: { ilan: Ilan; dil: Dil; oncelik?: boolean; aiMod?: boolean }) {
  const { para } = useAyarlar();
  /**
   * AI ELEME MODU
   * AI en guclu ozellikti ama detay sayfasinin ortasina gomuluydu — kullanici
   * ilani sectikten SONRA goruyordu. Oysa "bu bos daire dosenince nasil gorunur"
   * argumani eleme aninda, listede ise yarar. Mod acikken kapak fotografi
   * AI dosenmis haliyle degisiyor.
   */
  const aiKapak = aiMod ? ilan.aiTasarimlar?.[0]?.gorsel : undefined;
  const kapak = aiKapak ?? ilan.kapak;
  const aiVar = !!ilan.aiTasarimlar?.length;
  const m2Fiyat = ilan.islem === "satilik" ? m2FiyatYaz(ilan.fiyat, ilan.m2, para, dil) : null;

  const kunye = [
    ilan.oda !== "—" ? ilan.oda : null,
    ilan.banyo > 0 ? `${ilan.banyo} ${t("banyo", dil).toLowerCase()}` : null,
    `${ilan.m2} m²`,
    m2Fiyat,
  ].filter(Boolean) as string[];

  return (
    <Link href={`/${dil}/ilan/${ilan.slug}`} className="kart group block rounded-[10px]">
      <article>
        <div className="kart-medya">
          <Image
            src={kapak}
            alt={ilan.baslik[dil]}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            priority={oncelik}
            className="kart-foto"
          />

          {ilan.vitrin && (
            <span className="rozet-foto absolute left-2.5 top-2.5 bg-white/92 text-deniz-700">
              {t("oneCikarilmis", dil)}
            </span>
          )}

          <span className="absolute right-2.5 top-2.5">
            <FavoriDugme id={ilan.id} dil={dil} />
          </span>

          {aiVar && (
            <span className="rozet-foto absolute bottom-2.5 left-2.5 bg-white/92 text-terra-600">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l1.9 5.7L19.6 9l-5.7 1.9L12 16.6l-1.9-5.7L4.4 9l5.7-1.3L12 2z" />
              </svg>
              AI{ilan.gezinti360 ? " · 360°" : ""}
            </span>
          )}

          {aiKapak ? <span className="damga">{t("aiRozet", dil)}</span>
            : !ilan.gercekGorsel && <span className="damga">{t("temsiliGorsel", dil)}</span>}
        </div>

        <div className="pt-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="baslik text-[22px] leading-none text-deniz-700">
              {fiyatYaz(ilan.fiyat, para, dil)}
              {ilan.islem === "kiralik" && <span className="text-[13px] text-sis">{t("ayda", dil)}</span>}
              {ilan.oncekiFiyat && (
                <span className="ml-2 align-middle text-[13px] font-normal text-sis line-through">
                  {fiyatYaz(ilan.oncekiFiyat, para, dil)}
                </span>
              )}
            </p>
            <span className="shrink-0 text-[12.5px] text-sis">
              {t(ilan.islem === "satilik" ? "satilik" : "kiralik", dil)} · {tipAdi(ilan.tip, dil)}
            </span>
          </div>

          {/* Konum, basligin ustune tasindi — Sotheby's modeli: yer, pazarlama cumlesinden onemli */}
          <p className="mt-1.5 text-[15px] font-medium leading-snug text-murekkep">
            {ilan.bolge}, {sehirAdi(ilan.sehir, dil)}
          </p>

          <p className="mt-1 line-clamp-1 text-[13px] leading-snug text-sis">{ilan.baslik[dil]}</p>

          <p className="mt-2.5 text-[12.5px] text-sis">{kunye.join(" · ")}</p>

          {/* Rakibin yapisal olarak yapamadigi sey: tapu tipi, listede, filtrelenebilir halde */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="cip cip-tapu">{tapuAdi(ilan.tapu, dil)}</span>
            {!ilan.yabanciUygun && (
              <span className="cip cip-uyari">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                  <path d="M12 8v5M12 16.5v.5" strokeLinecap="round" /><circle cx="12" cy="12" r="9" />
                </svg>
                {t("yabanciUygunDegil", dil)}
              </span>
            )}
            <span className="ml-auto text-[11.5px] text-sis">{tazelikYaz(ilan.guncelleme, dil)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
