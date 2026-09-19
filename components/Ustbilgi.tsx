"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import DilSecici from "./DilSecici";
import ParaSecici from "./ParaSecici";
import { useAyarlar } from "./Ayarlar";
import { useFavoriler } from "./Favoriler";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

export default function Ustbilgi({ dil, seffaf = false }: { dil: Dil; seffaf?: boolean }) {
  const { para, setPara } = useAyarlar();
  const { favoriler, hazir } = useFavoriler();
  const [kaydi, setKaydi] = useState(false);
  useEffect(() => {
    const f = () => setKaydi(window.scrollY > 24);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const koyu = seffaf && !kaydi;
  const bag = [
    { ad: t("satilik", dil),   href: `/${dil}/ilan?islem=satilik` },
    { ad: t("kiralik", dil),   href: `/${dil}/ilan?islem=kiralik` },
    { ad: t("projeler", dil),  href: `/${dil}/proje` },
    { ad: t("emlakcilar", dil),href: `/${dil}/emlakci` },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-30 transition-all duration-300
      ${koyu ? "bg-transparent" : "bg-kum-50/90 backdrop-blur-md border-b border-hat"}`}>
      <div className="kapsayici flex h-[68px] items-center justify-between gap-6">
        <Logo dil={dil} koyu={koyu} />
        <nav className="hidden items-center gap-1 md:flex">
          {bag.map((b) => (
            <Link key={b.href} href={b.href}
              className={`rounded-md px-3 py-2 text-[14px] transition
                ${koyu ? "text-kum-100 hover:bg-white/10" : "text-murekkep hover:bg-kum-200"}`}>
              {b.ad}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-0.5">
          <Link href={`/${dil}/favoriler`} aria-label={t("favoriler", dil)}
            className={`relative flex h-9 w-9 items-center justify-center rounded-md transition
              ${koyu ? "text-kum-100 hover:bg-white/10" : "text-murekkep hover:bg-kum-200"}`}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13z"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {hazir && favoriler.length > 0 && (
              <span className="sayi-rozet absolute -right-0.5 -top-0.5">{favoriler.length}</span>
            )}
          </Link>
          <ParaSecici deger={para} degisti={setPara} koyu={koyu} />
          <DilSecici dil={dil} koyu={koyu} />
          <Link href={`/${dil}/ilan`}
            className={`ml-2 hidden rounded-md px-4 py-2 text-[13.5px] font-medium transition sm:block
              ${koyu ? "bg-kum-100 text-deniz-700 hover:bg-white" : "bg-deniz-700 text-kum-50 hover:bg-deniz-900"}`}>
            {t("ara", dil)}
          </Link>
        </div>
      </div>
    </header>
  );
}
