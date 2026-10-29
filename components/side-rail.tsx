const TICKS = 27;

function Ticks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex w-[50px] flex-col gap-2 ${className}`}>
      {Array.from({ length: TICKS }, (_, i) => (
        <span key={i} className={`h-px rounded-[2px] bg-current ${i % 2 === 0 ? "w-full" : "w-1/2"}`} />
      ))}
    </div>
  );
}

/** Fixed desktop chrome from the Figma frames: the left ruler that fills with scroll progress. */
export function SideRail() {
  return (
    <div aria-hidden className="pointer-events-none fixed left-4 top-[333px] z-0 hidden xl:block">
      <Ticks className="text-muted" />
      <Ticks className="scroll-fill absolute inset-0 text-paper [clip-path:inset(0_0_100%_0)]" />
    </div>
  );
}
