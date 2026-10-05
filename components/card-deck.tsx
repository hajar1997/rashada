"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { Fredoka } from "next/font/google";
import type { AboutCard } from "@/lib/content";
import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from "./icons";

/** Resting tilt per stack depth, top card first — taken from the Figma about frame. */
const REST_ROTATION = [0, 24.19, 11.72, 16.7];
const SWIPE_THRESHOLD = 80;
/** Scales the whole deck up from the 256×354 Figma card size; card internals stay in Figma px. */
const DECK_ZOOM = 1.15;

/** Rounded display face for the chrome monogram. */
const fredoka = Fredoka({ subsets: ["latin"], weight: "700" });

type Drag = { startX: number; startY: number; x: number; y: number; zoom: number };

function CardFace({ card }: { card: AboutCard }) {
  switch (card.kind) {
    case "photo":
      return (
        // Crop box from the Figma frame: the photo is zoomed past the card edges.
        <div className="absolute left-[-12.82%] top-[-25.59%] h-[128.25%] w-[119.37%]">
          <Image src={card.image.src} alt={card.image.alt} fill sizes="306px" draggable={false} className="object-cover" />
        </div>
      );
    case "tags":
      return (
        <>
          <p className="absolute left-[17px] top-[35px] text-base">{card.title}</p>
          <ul>
            {card.tags.map((tag) => (
              <li
                key={tag.label}
                style={{ left: tag.x, top: tag.y, transform: `translate(-50%, -50%) rotate(${tag.rotate}deg)` }}
                className={`absolute whitespace-nowrap rounded-full border border-paper px-3.5 py-1.5 text-[15px] shadow-[0_6px_14px_-6px_rgb(0_0_0/0.8)] ${
                  tag.filled ? "bg-paper font-medium text-ink" : "bg-ink text-paper"
                }`}
              >
                {tag.label}
              </li>
            ))}
          </ul>
        </>
      );
    case "letter":
      return (
        // A bare 3D chrome letter: an extruded back layer with the polished face stacked on top.
        <div className="grid size-full place-items-center [perspective:700px]">
          <span
            role="img"
            aria-label={`Letter ${card.letter}`}
            className={`${fredoka.className} letter-3d grid text-[340px] leading-none`}
          >
            <span aria-hidden className="chrome-extrude [grid-area:1/1]">
              {card.letter}
            </span>
            <span aria-hidden className="chrome-text [grid-area:1/1]">
              {card.letter}
            </span>
          </span>
        </div>
      );
    case "quote":
      return (
        <figure className="flex size-full flex-col px-[17px] pb-12 pt-[35px]">
          <span aria-hidden className="text-6xl leading-none text-muted">
            &ldquo;
          </span>
          <blockquote className="mt-2 text-xl font-medium leading-snug text-balance">{card.text}</blockquote>
          <figcaption className="mt-auto text-sm text-muted">— {card.author}</figcaption>
        </figure>
      );
  }
}

/** Fisher–Yates shuffle that leaves the first `keep` ids in place. */
function shuffleAfter(ids: readonly string[], keep: number) {
  const rest = ids.slice(keep);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [...ids.slice(0, keep), ...rest];
}

/** Cards that always lead the stack, in content order: "What inspires me", then the photo. */
const FIXED_LEAD = 2;

const shuffledCache = new WeakMap<readonly string[], readonly string[]>();
const subscribeNever = () => () => {};

/**
 * Deck order with everything after the lead cards shuffled once per mount. The server snapshot
 * keeps content order so hydration matches; the client then swaps in its shuffled copy.
 */
function useBaseOrder(ids: readonly string[]) {
  return useSyncExternalStore(
    subscribeNever,
    () => {
      let shuffled = shuffledCache.get(ids);
      if (!shuffled) {
        shuffled = shuffleAfter(ids, FIXED_LEAD);
        shuffledCache.set(ids, shuffled);
      }
      return shuffled;
    },
    () => ids,
  );
}

export function CardDeck({ items }: { items: readonly AboutCard[] }) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const baseOrder = useBaseOrder(ids);
  // How many cards have been sent to the back; the visible order is the base order rotated by it.
  const [offset, setOffset] = useState(0);
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);

  const count = baseOrder.length;
  const start = ((offset % count) + count) % count;
  const order = [...baseOrder.slice(start), ...baseOrder.slice(0, start)];
  const byId = new Map(items.map((item) => [item.id, item]));
  const position = start + 1;

  function shuffle(direction: 1 | -1) {
    setOffset((current) => current + direction);
  }

  function updateDrag(next: Drag | null) {
    dragRef.current = next;
    setDrag(next);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    // Pointer coordinates ignore CSS zoom (the root's and the deck's), so scale deltas back to keep the card under the cursor.
    const zoom = (parseFloat(getComputedStyle(document.documentElement).zoom) || 1) * DECK_ZOOM;
    updateDrag({ startX: event.clientX, startY: event.clientY, x: 0, y: 0, zoom });
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = dragRef.current;
    if (!current) return;
    updateDrag({
      ...current,
      x: (event.clientX - current.startX) / current.zoom,
      y: (event.clientY - current.startY) / current.zoom,
    });
  }

  function onPointerUp() {
    const current = dragRef.current;
    if (current && Math.abs(current.x) > SWIPE_THRESHOLD) shuffle(1);
    updateDrag(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") shuffle(1);
    else if (event.key === "ArrowLeft") shuffle(-1);
    else return;
    event.preventDefault();
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="A few things about me. Drag the top card or use the arrow keys to shuffle."
      tabIndex={0}
      onKeyDown={onKeyDown}
      style={{ zoom: DECK_ZOOM }}
      className="relative mx-auto h-[428px] w-full max-w-[378px] select-none rounded-[36px]"
    >
      <p className="sr-only" aria-live="polite">
        Card {position} of {items.length}
      </p>

      {order.map((id, depth) => {
        const item = byId.get(id);
        if (!item) return null;
        const isTop = depth === 0;
        const dragging = isTop && drag !== null;
        const transform = dragging
          ? `translate(${drag.x}px, ${drag.y * 0.4}px) rotate(${drag.x * 0.06}deg)`
          : `rotate(${REST_ROTATION[depth % REST_ROTATION.length]}deg)`;

        return (
          <div
            key={id}
            aria-hidden={!isTop}
            onPointerDown={isTop ? onPointerDown : undefined}
            onPointerMove={isTop ? onPointerMove : undefined}
            onPointerUp={isTop ? onPointerUp : undefined}
            onPointerCancel={isTop ? () => updateDrag(null) : undefined}
            style={{ transform, zIndex: order.length - depth }}
            className={`absolute inset-0 m-auto h-[354px] w-64 touch-pan-y ${
              item.kind === "letter" ? "" : "overflow-hidden rounded-3xl border border-paper bg-ink"
            } ${
              dragging ? "cursor-grabbing" : "transition-transform duration-500 ease-out-soft"
            } ${isTop ? "cursor-grab" : ""}`}
          >
            <CardFace card={item} />
            <span
              aria-hidden
              className={`absolute inset-x-0 bottom-[15px] flex items-center justify-center gap-1 text-xs text-white mix-blend-difference transition-opacity duration-300 ${
                isTop && !dragging ? "opacity-100" : "opacity-0"
              }`}
            >
              <ArrowNarrowLeftIcon />
              Drag
              <ArrowNarrowRightIcon />
            </span>
          </div>
        );
      })}
    </div>
  );
}
