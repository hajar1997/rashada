"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ImageAsset } from "@/lib/content";
import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon, CloseIcon, ZoomInIcon } from "./icons";

export type Board = { image: ImageAsset; width: number; height: number };
/** A paragraph shown between boards (not part of the enlarge viewer). */
export type BoardNote = { text: string };

const control =
  "grid size-11 place-items-center rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20 disabled:opacity-30 disabled:hover:bg-paper/10";

/**
 * Case-study boards (1440px Figma frames) at the page's column width. Clicking one opens a
 * centred modal with the original export (tall boards scroll inside), with previous/next —
 * at column width the boards' small text isn't legible.
 */
export function BoardGallery({ items }: { items: readonly (Board | BoardNote)[] }) {
  const boards = items.filter((item): item is Board => "image" in item);
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  // Native modal dialog: top layer (above the navbar), focus trapping and Esc come for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    scrollRef.current?.scrollTo({ top: 0 });
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden"; // keep the page behind from scrolling
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  function close() {
    const index = open;
    setOpen(null);
    if (index !== null) triggers.current[index]?.focus();
  }

  const step = (delta: number) =>
    setOpen((current) => (current === null ? current : Math.min(boards.length - 1, Math.max(0, current + delta))));

  const board = open === null ? null : boards[open];

  return (
    <>
      <ul className="flex flex-col gap-5">
        {items.map((item) => {
          if (!("image" in item)) {
            return (
              <li key={item.text.slice(0, 32)} className="py-5">
                <p className="text-pretty text-muted">{item.text}</p>
              </li>
            );
          }
          const index = boards.indexOf(item);
          return (
          <li key={item.image.src}>
            <button
              ref={(node) => {
                triggers.current[index] = node;
              }}
              type="button"
              onClick={() => setOpen(index)}
              aria-label={`Enlarge ${item.image.alt}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl sm:rounded-3xl"
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.width}
                height={item.height}
                quality={90}
                sizes="(min-width: 832px) 800px, calc(100vw - 32px)"
                className="h-auto w-full transition-transform duration-500 ease-out-soft group-hover:scale-[1.015]"
              />
              {/* Zoom badge: on hover/focus, and always on touch screens (no hover there). */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-ink/80 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
              >
                <ZoomInIcon />
              </span>
            </button>
          </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={board ? board.image.alt : "Board viewer"}
        onClose={() => open !== null && close()}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          else if (event.key === "ArrowLeft") step(-1);
        }}
        // A click on the dimmed backdrop lands on the <dialog> itself; clicks inside hit its content.
        onClick={(event) => event.target === event.currentTarget && close()}
        // Centred modal. Sizes are % of the viewport (not vw/dvh), which stay correct under the root zoom.
        className="m-auto max-h-[92%] w-[min(1200px,calc(100%-32px))] max-w-none overflow-hidden rounded-3xl bg-surface p-0 text-paper shadow-[0_24px_80px_-12px_rgb(0_0_0/0.7)] backdrop:bg-ink/75 backdrop:backdrop-blur-sm open:flex open:animate-pop-in open:flex-col"
      >
        {board && open !== null && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <p className="text-sm text-muted">
                {open + 1} / {boards.length}
                <span className="sr-only">: {board.image.alt}</span>
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} disabled={open === 0} aria-label="Previous board" className={control}>
                  <ArrowNarrowLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={open === boards.length - 1}
                  aria-label="Next board"
                  className={control}
                >
                  <ArrowNarrowRightIcon />
                </button>
                <button type="button" onClick={close} aria-label="Close" className={control}>
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Tall boards scroll inside the modal. */}
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
              {/* The original export, unprocessed, at up to its full width. */}
              <Image
                key={board.image.src}
                src={board.image.src}
                alt={board.image.alt}
                width={board.width}
                height={board.height}
                unoptimized
                className="h-auto w-full animate-fade-in rounded-xl"
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
