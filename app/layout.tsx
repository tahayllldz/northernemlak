import type { Metadata } from "next";
import "@fontsource-variable/playfair-display";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "NorthernEmlak — Kuzey Kıbrıs Emlak Platformu",
  description: "Kuzey Kıbrıs'ta satılık ve kiralık emlak. Tapu bilgisi şeffaf, altı dilli, AI sanal dekorasyonlu ilan platformu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="tr" suppressHydrationWarning><body>{children}</body></html>;
}
