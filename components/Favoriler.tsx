"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Dil } from "@/lib/tipler";
import { t } from "@/lib/sozluk";

/**
 * PROTOTIP NOTU: uyelik olmadigi icin favoriler yalnizca bu tarayicida,
 * localStorage'da tutulur. Cihaz degisince kaybolur. Faz 1'de hesaba baglanacak.
 */
const ANAHTAR = "ne-favori";

type Kap = { favoriler: number[]; degistir: (id: number) => void; hazir: boolean };
const Ctx = createContext<Kap>({ favoriler: [], degistir: () => {}, hazir: false });
export const useFavoriler = () => useContext(Ctx);

export function FavoriSaglayici({ children }: { children: React.ReactNode }) {
  const [favoriler, setFavoriler] = useState<number[]>([]);
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    try {
      const ham = localStorage.getItem(ANAHTAR);
      if (ham) setFavoriler(JSON.parse(ham) as number[]);
    } catch { /* gizli sekme / engelli depolama: sessizce bos gec */ }
    setHazir(true);
  }, []);

  const degistir = useCallback((id: number) => {
    setFavoriler((onceki) => {
      const yeni = onceki.includes(id) ? onceki.filter((x) => x !== id) : [...onceki, id];
      try { localStorage.setItem(ANAHTAR, JSON.stringify(yeni)); } catch {}
      return yeni;
    });
  }, []);

  return <Ctx.Provider value={{ favoriler, degistir, hazir }}>{children}</Ctx.Provider>;
}

export function FavoriDugme({ id, dil, buyuk = false }: { id: number; dil: Dil; buyuk?: boolean }) {
  const { favoriler, degistir, hazir } = useFavoriler();
  const secili = hazir && favoriler.includes(id);
  const boy = buyuk ? 20 : 16;

  return (
    <button
      type="button"
      aria-pressed={secili}
      aria-label={t(secili ? "favorindenCikar" : "favoriyeEkle", dil)}
      onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); degistir(id); }}
      className={`flex items-center justify-center rounded-full transition
        ${buyuk ? "h-11 w-11 border border-hat bg-white hover:bg-kum-100" : "h-8 w-8 bg-white/92 backdrop-blur-sm hover:bg-white"}`}
    >
      <svg width={boy} height={boy} viewBox="0 0 24 24"
        fill={secili ? "#C4663A" : "none"} stroke={secili ? "#C4663A" : "#1C2024"} strokeWidth="1.8" aria-hidden>
        <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13z"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
