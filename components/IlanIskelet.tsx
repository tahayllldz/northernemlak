/**
 * Yukleme iskeleti. Onceden kartlar birden beliriyordu; iskelet hem
 * algilanan hizi artirir hem de duzenin zipladigini engeller.
 */
export default function IlanIskelet({ adet = 8 }: { adet?: number }) {
  return (
    <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden>
      {Array.from({ length: adet }, (_, n) => (
        <div key={n}>
          <div className="iskelet aspect-[4/3] w-full rounded-[10px]" />
          <div className="pt-3.5">
            <div className="iskelet h-[22px] w-[45%]" />
            <div className="iskelet mt-2.5 h-[15px] w-[65%]" />
            <div className="iskelet mt-2 h-[13px] w-[85%]" />
            <div className="iskelet mt-3 h-[12px] w-[55%]" />
            <div className="iskelet mt-3 h-[22px] w-[38%] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
