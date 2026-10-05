import { profile } from "@/lib/content";

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

/**
 * Fixed desktop chrome from the Figma frames: the accent horizon line with its
 * hanging contact tab, and the left ruler that fills with scroll progress.
 */
export function SideRail() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[332px] z-50 hidden h-px bg-accent scroll-follow vt-chrome-line xl:block" />

      <div aria-hidden className="pointer-events-none fixed left-4 top-[333px] z-0 hidden xl:block">
        <Ticks className="text-muted" />
        <Ticks className="scroll-fill absolute inset-0 text-paper [clip-path:inset(0_0_100%_0)]" />
      </div>

      <a
        href={`mailto:${profile.email}`}
        className="fixed right-[116px] top-[333px] z-50 hidden rounded-b-xl bg-accent px-3 pb-2 pt-2 text-sm font-medium text-paper transition-[padding] duration-300 ease-out-soft hover:pb-3.5 focus-visible:pb-3.5 scroll-follow vt-chrome-contact xl:block"
      >
        Contact with me
      </a>
    </>
  );
}
