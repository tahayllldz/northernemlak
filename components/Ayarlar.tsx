"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ParaBirimi } from "@/lib/yardimci";
import { FavoriSaglayici } from "./Favoriler";

const Ctx = createContext<{ para: ParaBirimi; setPara: (p: ParaBirimi) => void }>({ para: "GBP", setPara: () => {} });
export const useAyarlar = () => useContext(Ctx);

export default function Ayarlar({ children }: { children: React.ReactNode }) {
  const [para, setPara] = useState<ParaBirimi>("GBP");
  useEffect(() => {
    try { const k = localStorage.getItem("ne-para") as ParaBirimi | null; if (k) setPara(k); } catch {}
  }, []);
  const ayarla = (p: ParaBirimi) => { setPara(p); try { localStorage.setItem("ne-para", p); } catch {} };
  return (
    <Ctx.Provider value={{ para, setPara: ayarla }}>
      <FavoriSaglayici>{children}</FavoriSaglayici>
    </Ctx.Provider>
  );
}
