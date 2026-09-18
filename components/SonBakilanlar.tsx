"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";
import { ILANLAR } from "@/lib/veri";
import { fiyatYaz, sehirAdi } from "@/lib/yardimci";
import { useAyarlar } from "./Ayarlar";

/**
 * Son bakilan ilanlar. Emlak karari haftalar suruyor; 101evler de
 * propertyfinder de geri donen kullaniciya hafiza veriyor. Uyelik
 * gerekmediginden prototipte localStorage yeterli.
 */
const ANAHTAR = "ne-son-bakilan";
const SINIR = 8;

function oku(): number[] {
  try {
    const ham = localStorage.getItem(ANAHTAR);
    return ham ? (JSON.parse(ham) as number[]) : [];
  } catch { return []; }
}

/** Detay sayfasinda cagrilir, hicbir sey cizmez. */
export function SonBakilanKaydet({ id }: { id: number }) {
  useEffect(() => {
    try {
      const yeni = [id, ...oku().filter((x) => x !== id)].slice(0, SINIR);
      localStorage.setItem(ANAHTAR, JSON.stringify(yeni));
    } catch { /* depolama engelli olabilir */ }
  }, [id]);
  return null;
}

export default function SonBakilanlar({ dil, haric }: { dil: Dil; haric?: number }) {
  const { para } = useAyarlar();
  const [idler, setIdler] = useState<number[] | null>(null);

  useEffect(() => { setIdler(oku()); }, []);

  if (idler === null) return null;
  const liste = idler
    .filter((id) => id !== haric)
    .map((id) => ILANLAR.find((i) => i.id === id))
    .filter(Boolean)
    .slice(0, 6) as typeof ILANLAR;

  if (liste.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="baslik mb-4 text-[20px] text-deniz-700">{t("sonBakilanlar", dil)}</h2>
      <div className="cip-serit">
        {liste.map((i) => (
          <Link key={i.id} href={`/${dil}/ilan/${i.slug}`}
            className="group w-[190px] shrink-0 rounded-[10px]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-kum-200">
              <Image src={i.kapak} alt="" fill sizes="190px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            </div>
            <p className="baslik mt-2 text-[16px] leading-none text-deniz-700">{fiyatYaz(i.fiyat, para, dil)}</p>
            <p className="mt-1 truncate text-[12.5px] text-sis">{i.bolge}, {sehirAdi(i.sehir, dil)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
