import Link from "next/link";

/** Ilan bulunamadi — silinmis veya suresi dolmus ilan. */
export default function IlanBulunamadi() {
  return (
    <main className="kapsayici flex min-h-[70dvh] flex-col items-center justify-center py-20 text-center">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
        className="text-kum-300" aria-hidden>
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" strokeLinejoin="round" />
        <path d="M9.5 12.5 12 15l2.5-2.5M12 15V9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h1 className="baslik mt-5 text-[24px] text-deniz-700">İlan bulunamadı</h1>
      <p className="mt-2 max-w-[46ch] text-[14.5px] leading-relaxed text-sis">
        Bu ilan kaldırılmış veya yayın süresi dolmuş olabilir.
        <br />
        This listing is no longer available. · Объявление недоступно.
      </p>
      <Link href="/tr/ilan"
        className="mt-6 rounded-md bg-deniz-700 px-5 py-2.5 text-[14px] font-medium text-kum-50 transition hover:bg-deniz-900">
        Tüm ilanlar
      </Link>
    </main>
  );
}
