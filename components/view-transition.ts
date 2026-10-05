import type { CSSProperties } from "react";
import { flushSync } from "react-dom";

/**
 * Inline style that names an element for smart-animate. The name only takes effect while its
 * scope is animating (see the `.vt-*` rules in globals.css), so one demo's transition never lifts
 * another demo's elements above the page chrome.
 */
export function vtName(name: string) {
  return { "--vt": name } as CSSProperties;
}

/**
 * Runs a React state update inside a View Transition so elements sharing a
 * `view-transition-name` morph between their old and new boxes (Figma-style smart animate).
 * `scope` switches on that component's names (`data-vt-scope` on <html>); `step` is exposed as
 * `data-vt-step` for direction-specific CSS. Falls back to a plain update without View
 * Transitions or with reduced motion.
 */
export function smartAnimate(scope: string, update: () => void, step?: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduceMotion) {
    update();
    return;
  }
  const root = document.documentElement;
  root.dataset.vtScope = scope;
  if (step) root.dataset.vtStep = step;
  const transition = document.startViewTransition(() => flushSync(update));
  transition.finished.finally(() => {
    // A newer transition may have taken over; only clear what this one set.
    if (root.dataset.vtScope === scope) delete root.dataset.vtScope;
    if (step && root.dataset.vtStep === step) delete root.dataset.vtStep;
  });
}
