import Link from "next/link";
import { Dil } from "@/lib/tipler";

export default function Logo({ dil, koyu = false }: { dil: Dil; koyu?: boolean }) {
  return (
    <Link href={`/${dil}`} className="group flex items-center gap-2.5 shrink-0">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden className="shrink-0">
        <path d="M4 15.2 16 5l12 10.2" stroke={koyu ? "#F5F0E8" : "#1B4D5C"} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 14v12h18V14" stroke={koyu ? "#F5F0E8" : "#1B4D5C"} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.5 26v-6.5h7V26" stroke="#C4663A" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className={`baslik text-[19px] leading-none tracking-tight ${koyu ? "text-kum-100" : "text-deniz-700"}`}>
        Northern<span className="text-terra-500">Emlak</span>
      </span>
    </Link>
  );
}
