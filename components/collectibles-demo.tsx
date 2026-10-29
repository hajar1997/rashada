"use client";

import Image from "next/image";
import { useState, type ComponentType, type SVGProps } from "react";
import { DotsIcon, GridIcon, ListIcon, StackIcon } from "./icons";
import { smartAnimate, vtName } from "./view-transition";

type View = "list" | "grid" | "pack";

const views: readonly { id: View; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: "list", label: "List view", Icon: ListIcon },
  { id: "grid", label: "Grid view", Icon: GridIcon },
  { id: "pack", label: "Pack view", Icon: StackIcon },
];

const songs = [
  { id: "kiss-of-life", title: "Kiss of Life", artist: "Sade", cover: "/images/playground/kiss-of-life.png" },
  { id: "like-a-tattoo", title: "Like a Tattoo", artist: "Sade", cover: "/images/playground/like-a-tattoo.png" },
] as const;

type Song = (typeof songs)[number];

/** Each element keeps one view-transition-name across views, so it morphs between layouts. */
const vt = (part: string, song: Song) => vtName(`col-${part}-${song.id}`);

/**
 * Every view requests the same (largest, grid) image size and loads it eagerly, so switching views
 * reuses the already-decoded file — otherwise the transition captures a blank cover mid-load.
 */
function Cover({ song, className = "" }: { song: Song; className?: string }) {
  return (
    <div style={vt("cover", song)} className={`vt-col relative overflow-hidden rounded-[4px] bg-placeholder ${className}`}>
      <Image
        src={song.cover}
        alt={`${song.title} cover`}
        fill
        sizes="144px"
        loading="eager"
        draggable={false}
        className="object-cover"
      />
    </div>
  );
}

function Meta({ song, size, align = "start" }: { song: Song; size: "sm" | "xs"; align?: "start" | "center" }) {
  return (
    <div className={`flex flex-col font-medium ${size === "sm" ? "gap-1" : ""} ${align === "center" ? "items-center" : "items-start"}`}>
      <p style={vt("title", song)} className={`vt-col w-fit whitespace-nowrap text-ink ${size === "sm" ? "text-sm" : "text-xs"}`}>
        {song.title}
      </p>
      <p style={vt("artist", song)} className="vt-col w-fit text-xs text-hint">
        {song.artist}
      </p>
    </div>
  );
}

function Dots({ song }: { song: Song }) {
  return <DotsIcon aria-hidden style={vt("dots", song)} className="vt-col shrink-0 text-hint" />;
}

/**
 * Playground "Animation 2" from Figma: a Collectibles panel whose List / Grid / Pack tabs
 * smart-animate the same two covers between layouts. Clicking the pack shuffles it.
 */
export function CollectiblesDemo() {
  const [view, setView] = useState<View>("list");
  // As in Figma's pack frame: Like a Tattoo on top with its title below, Kiss of Life tilted behind.
  const [top, setTop] = useState(1);
  const front = songs[top];
  const back = songs[(top + 1) % songs.length];

  return (
    // Centred in the tile. The panel is as tall as its tallest view (grid, 259px), so the heading
    // and tabs stay put when switching views; only the covers move.
    <div className="flex size-full items-center justify-center bg-paper px-4 py-5 text-ink">
      <div className="flex min-h-[259px] w-[296px] flex-col gap-3">
        <p className="text-sm font-semibold text-[#5b5b5b]">Collectibles</p>

        <div role="tablist" aria-label="Collection layout" className="flex gap-2 border-b border-placeholder pb-2">
          {views.map(({ id, label, Icon }) => {
            const active = id === view;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => !active && smartAnimate("col", () => setView(id))}
                // No CSS colour transition here: the view transition does the crossfade, and a running
                // CSS transition would be captured mid-way, making the label lag behind the pill.
                className={`relative flex items-center gap-2 rounded-full bg-[#e2e2e2] px-2 py-1 text-xs ${
                  active ? "text-paper" : "text-[#8a8a8a] hover:text-ink"
                }`}
              >
                {/* One purple pill that slides between tabs. z-0 vs the labels' z-10 keeps every
                    label painted (and layered in the transition) above the pill as it passes. */}
                {active && (
                  <span aria-hidden style={vtName("col-tab")} className="vt-col absolute inset-0 z-0 rounded-full bg-[#9100e5]" />
                )}
                <span style={vtName(`col-tablabel-${id}`)} className="vt-col vt-col-label relative z-10 flex items-center gap-2">
                  <Icon />
                  <span className="whitespace-nowrap">{label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div role="tabpanel" aria-label={views.find((v) => v.id === view)?.label}>
          {view === "list" && (
            <ul className="flex flex-col gap-2">
              {songs.map((song) => (
                <li key={song.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Cover song={song} className="size-20" />
                    <Meta song={song} size="sm" />
                  </div>
                  <Dots song={song} />
                </li>
              ))}
            </ul>
          )}

          {view === "grid" && (
            <ul className="flex gap-3">
              {songs.map((song) => (
                <li key={song.id} className="flex min-w-0 flex-1 flex-col gap-2">
                  <Cover song={song} className="aspect-square w-full" />
                  <div className="flex items-center justify-between">
                    <Meta song={song} size="xs" />
                    <Dots song={song} />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {view === "pack" && (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                aria-label={`Shuffle pack, showing ${front.title}`}
                onClick={() => smartAnimate("col", () => setTop((current) => (current + 1) % songs.length))}
                className="relative size-[139px] transition-transform duration-300 ease-out-soft hover:scale-105 active:scale-95"
              >
                {[
                  { song: back, rotate: -14.1 },
                  { song: front, rotate: 4.93 },
                ].map(({ song, rotate }) => (
                  <span key={song.id} className="absolute inset-0 m-auto size-[114.5px]" style={{ transform: `rotate(${rotate}deg)` }}>
                    <Cover song={song} className="size-full shadow-[0_4px_12px_-4px_rgb(0_0_0/0.35)]" />
                  </span>
                ))}
              </button>
              <Meta song={front} size="xs" align="center" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
