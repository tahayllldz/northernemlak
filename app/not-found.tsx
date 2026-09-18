import Link from "next/link";

/** Kok 404 — gecersiz dil kodu buraya duser (ornek: /de/ilan). */
export default function Bulunamadi() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="baslik text-[64px] leading-none text-kum-300">404</p>
      <h1 className="baslik mt-4 text-[26px] text-deniz-700">Sayfa bulunamadı</h1>
      <p className="mt-2 max-w-[44ch] text-[14.5px] leading-relaxed text-sis">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
        <br />
        This page could not be found. · Страница не найдена.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        {(["tr", "en", "ru"] as const).map((d) => (
          <Link key={d} href={`/${d}`}
            className="rounded-md border border-hat bg-white px-4 py-2.5 text-[14px] font-medium text-murekkep transition hover:border-deniz-300">
            {d.toUpperCase()}
          </Link>
        ))}
      </div>
    </main>
  );
}
