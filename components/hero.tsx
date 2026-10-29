import { profile } from "@/lib/content";
import { ScrollHint } from "./scroll-hint";

/**
 * Home page opener: fills the first screen so Services only appears on scroll. The name (ExtraBold
 * capitals, 68px at the 800px column) and tagline sit in the middle; "you can just scroll" sits at
 * the bottom edge and jumps to Services.
 *
 * Height = screen height (--screen, see ScreenHeight) minus what sits above the hero: the page's
 * top padding, the navbar and main's top margin (156px on phones, 192px from sm up).
 */
export function Hero() {
  return (
    // @container lets the name scale with the column (cqw), so it stays on one line on every screen.
    <section
      aria-labelledby="hero-title"
      className="@container relative flex min-h-[calc(var(--screen,100svh)-156px)] w-full flex-col items-center border-b-[0.4px] border-muted pb-8 text-center sm:min-h-[calc(var(--screen,100svh)-192px)]"
    >
      <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
        <h1
          id="hero-title"
          className="text-[8.5cqw] leading-tight font-extrabold whitespace-nowrap text-white uppercase"
        >
          {profile.name}
        </h1>
        <p className="text-xl text-pretty text-muted">{profile.tagline}</p>
      </div>

      <div className="relative">
        <ScrollHint />
      </div>
    </section>
  );
}
