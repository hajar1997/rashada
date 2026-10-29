"use client";

import { useEffect } from "react";

/**
 * Publishes the visible screen height as --screen, in the page's own CSS pixels. The root is
 * zoomed to 80% on desktop, and viewport units (vh/svh) don't reliably account for that, so
 * full-screen sections size themselves from this instead (with 100svh as the pre-hydration fallback).
 */
export function ScreenHeight() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const zoom = parseFloat(getComputedStyle(root).zoom) || 1;
      root.style.setProperty("--screen", `${window.innerHeight / zoom}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return null;
}
