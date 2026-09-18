"use client";
import Image from "next/image";
import Link from "next/link";
import { Ilan, Dil } from "@/lib/tipler";
import { t, ozellikAdi } from "@/lib/sozluk";
import { alanYaz, fiyatYaz, m2FiyatYaz, odaYaz, sehirAdi, tapuAdi, tipAdi } from "@/lib/yardimci";
import { maliyetHesapla } from "@/lib/maliyet";
import { useAyarlar } from "./Ayarlar";

/**
 * Favorileri yan yana karsilastirma. 101evler'de bu ozellik var ama menuye
 * gomulu; biz favorilerin dogal devami olarak koyduk — karta yeni bir kontrol
 * eklemeden (kart sade kalsin diye).
 *
 * Farkli olan satirlar isaretlenir: alici goz gezdirirken farki arar, ayni
 * olani degil.
 */
export default function Karsilastirma({ ilanlar, dil }: { ilanlar: Ilan[]; dil: Dil }) {
  const { para } = useAyarlar();
  if (ilanlar.length < 2) return null;

  const yaz = (n: number) => fiyatYaz(Math.round(n), para, dil);

  const satirlar: { ad: string; degerler: string[] }[] = [
    { ad: t("ilanFiyati", dil), degerler: ilanlar.map((i) => yaz(i.fiyat)) },
    { ad: t("toplamOdeme", dil), degerler: ilanlar.map((i) => yaz(maliyetHesapla(i, dil, { ilkAlimHakki: false, yabanciAlici: true }).toplam)) },
    { ad: t("m2Fiyat", dil), degerler: ilanlar.map((i) => m2FiyatYaz(i.fiyat, i.m2, para, dil) ?? "—") },
    { ad: t("konum", dil), degerler: ilanlar.map((i) => `${i.bolge}, ${sehirAdi(i.sehir, dil)}`) },
    { ad: t("tumTipler", dil), degerler: ilanlar.map((i) => tipAdi(i.tip, dil)) },
    { ad: t("oda", dil), degerler: ilanlar.map((i) => odaYaz(i.oda, dil)) },
    { ad: t("banyo", dil), degerler: ilanlar.map((i) => String(i.banyo)) },
    { ad: t("alan", dil), degerler: ilanlar.map((i) => alanYaz(i.m2, i.tip, dil)) },
    { ad: t("binaYasi", dil), degerler: ilanlar.map((i) => (i.binaYasi === 0 ? "—" : String(i.binaYasi))) },
    { ad: t("esyaDurumu", dil), degerler: ilanlar.map((i) => t(i.esyali === "esyali" ? "esyali" : i.esyali === "esyasiz" ? "esyasiz" : "yari", dil)) },
    { ad: t("tapuTipi", dil), degerler: ilanlar.map((i) => tapuAdi(i.tapu, dil)) },
    { ad: t("yabanciUygun", dil), degerler: ilanlar.map((i) => (i.yabanciUygun ? "✓" : "—")) },
    { ad: t("aidat", dil), degerler: ilanlar.map((i) => (i.aidat ? `${yaz(i.aidat)}${t("ayda", dil)}` : "—")) },
    { ad: t("kdvDahilEtiket", dil), degerler: ilanlar.map((i) => (i.kdvDahil ? "✓" : "—")) },
    { ad: t("ozellikler", dil), degerler: ilanlar.map((i) => i.ozellikler.map((o) => ozellikAdi(o, dil)).join(", ") || "—") },
  ];

  const sutun = `minmax(190px, 1fr)`;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Basliklar */}
        <div className="grid gap-px bg-hat" style={{ gridTemplateColumns: `150px repeat(${ilanlar.length}, ${sutun})` }}>
          <div className="bg-kum-50" />
          {ilanlar.map((i) => (
            <Link key={i.id} href={`/${dil}/ilan/${i.slug}`} className="group bg-kum-50 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-kum-200">
                <Image src={i.kapak} alt="" fill sizes="220px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-murekkep group-hover:text-terra-500">
                {i.baslik[dil]}
              </p>
            </Link>
          ))}
        </div>

        {/* Satirlar — farkli olanlar isaretli */}
        {satirlar.map((s) => {
          const farkli = new Set(s.degerler).size > 1;
          return (
            <div key={s.ad} className="grid gap-px bg-hat"
              style={{ gridTemplateColumns: `150px repeat(${ilanlar.length}, ${sutun})` }}>
              <div className={`px-3 py-2.5 text-[12.5px] ${farkli ? "bg-kum-100 font-medium text-murekkep" : "bg-white text-sis"}`}>
                {s.ad}
              </div>
              {s.degerler.map((d, n) => (
                <div key={n} className={`px-3 py-2.5 text-[13px] ${farkli ? "bg-kum-50 text-murekkep" : "bg-white text-sis"}`}>
                  {d}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
