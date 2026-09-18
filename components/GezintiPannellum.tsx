"use client";
import { useEffect, useRef, useState } from "react";

/**
 * PANNELLUM DENEMESI — karsilastirma icin.
 *
 * Neden ilginc: panoramalarimiz gercek 360 degil (4:1, ~262 derece kullanilabilir
 * yay, kenarlar tutmuyor). Pannellum bunu yapilandirmayla dogal olarak destekliyor:
 *   haov      yatay gorus acisi (360'tan kucuk panoramalar icin)
 *   vaov      dikey gorus acisi
 *   minYaw/maxYaw  cevirme siniri — dikis kadraja hic girmez
 * Bizim elle yazdigimiz sinirlama mantiginin karsiligi hazir geliyor.
 * Ayrica hotspot ve cok sahneli tur (odadan odaya gecis) kutudan cikiyor.
 *
 * MIT lisansli, 55 KB (gzip 18 KB) + 9 KB CSS.
 * Kutuphane yalnizca bu bilesen goruntulendiginde yukleniyor.
 */

type Goruntuleyici = { destroy: () => void };
type PannellumKuresel = {
  viewer: (el: HTMLElement, cfg: Record<string, unknown>) => Goruntuleyici;
};

declare global {
  interface Window { pannellum?: PannellumKuresel }
}

export default function GezintiPannellum({
  kaynak, haov = 262, vaov = 76,
}: { kaynak: string; haov?: number; vaov?: number }) {
  const kutuRef = useRef<HTMLDivElement>(null);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let gv: Goruntuleyici | null = null;
    let iptal = false;

    const baslat = () => {
      if (iptal || !kutuRef.current || !window.pannellum) return;
      try {
        gv = window.pannellum.viewer(kutuRef.current, {
          type: "equirectangular",
          panorama: kaynak,
          autoLoad: true,
          autoRotate: -2,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          // Kismi panorama: gercek kapsama alani bildirilince Pannellum
          // cevirmeyi kendisi sinirliyor, dikis kadraja girmiyor.
          haov,
          vaov,
          vOffset: 0,
          minHfov: 35,
          maxHfov: 100,
          hfov: 80,
        });
      } catch (e) {
        setHata(e instanceof Error ? e.message : "bilinmeyen hata");
      }
    };

    // CSS
    if (!document.getElementById("pannellum-css")) {
      const l = document.createElement("link");
      l.id = "pannellum-css";
      l.rel = "stylesheet";
      l.href = "/pannellum/pannellum.css";
      document.head.appendChild(l);
    }
    // JS — bir kez
    if (window.pannellum) baslat();
    else {
      const mevcut = document.getElementById("pannellum-js") as HTMLScriptElement | null;
      if (mevcut) mevcut.addEventListener("load", baslat);
      else {
        const s = document.createElement("script");
        s.id = "pannellum-js";
        s.src = "/pannellum/pannellum.js";
        s.onload = baslat;
        s.onerror = () => setHata("pannellum.js yuklenemedi");
        document.head.appendChild(s);
      }
    }

    return () => { iptal = true; try { gv?.destroy(); } catch { /* yoksay */ } };
  }, [kaynak, haov, vaov]);

  if (hata) return <p className="text-[13px] text-terra-600">Pannellum: {hata}</p>;
  return <div ref={kutuRef} className="h-full w-full" />;
}
