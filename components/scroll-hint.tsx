"use client";

import { useEffect, useState } from "react";
import { ArrowNarrowRightIcon } from "./icons";

/** Distance scrolled (CSS px) after which the hint has done its job and fades away. */
const HIDE_AFTER = 40;

/**
 * "You can just scroll" with a bobbing arrow, from the Figma hero. Fades out once the visitor
 * starts scrolling and returns at the top. Clicking jumps to Services.
 */
export function ScrollHint() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const update = () => setHidden(window.scrollY > HIDE_AFTER);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <a
      href="#services"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={`flex flex-col items-center gap-1.5 text-sm text-paper transition-[opacity,translate,color] duration-500 ease-out-soft hover:text-white ${
        hidden ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100"
      }`}
    >
      You can just scroll
      <span className="motion-safe:animate-nudge-down">
        <ArrowNarrowRightIcon className="size-6 rotate-90" />
      </span>
    </a>
  );
}
