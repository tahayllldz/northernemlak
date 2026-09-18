"use client";
import { useEffect } from "react";
import { Dil } from "@/lib/tipler";

/**
 * <html lang> kok duzende sabit "tr" kaliyor (App Router'da kok duzen
 * [dil] parametresini goremez). Bunu istemcide duzeltir. SSR tarafinda
 * dogru dilin CSS'e ulasmasi icin DilLayout'taki sarmalayici div ayrica
 * lang niteligi tasir: `text-transform: uppercase` dile gore davranir,
 * Turkce kuralinda "i" harfi noktali buyuk harfe donuyor ve Ingilizce
 * metinde "PRICE" yerine "PRICE"in bozulmus hali cikiyordu.
 */
export default function DilAyarla({ dil }: { dil: Dil }) {
  useEffect(() => {
    document.documentElement.lang = dil;
  }, [dil]);
  return null;
}
