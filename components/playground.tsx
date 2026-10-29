"use client";

import { useState } from "react";
import { playground, playgroundCategories, type PlaygroundCategory } from "@/lib/content";
import { CollectiblesDemo } from "./collectibles-demo";
import { EmotionDemo } from "./emotion-demo";
import { FilterChips } from "./filter-chips";
import { Media } from "./media";
import { SectionNote, notes } from "./section";
import { SignatureDemo } from "./signature-demo";

export function Playground({ initialCategory = playgroundCategories[0] }: { initialCategory?: PlaygroundCategory }) {
  const [category, setCategory] = useState<PlaygroundCategory>(initialCategory);
  const [filtered, setFiltered] = useState(false);
  const items = playground.filter((item) => item.category === category);

  function select(next: PlaygroundCategory) {
    setCategory(next);
    setFiltered(true);
  }

  return (
    <section
      id="playground"
      aria-labelledby="playground-title"
      className="flex w-full scroll-mt-28 flex-col items-center gap-6 rounded-[28px] bg-surface p-4 sm:rounded-[36px] sm:p-6"
    >
      <h2 id="playground-title" className="text-[28px] font-medium tracking-[-0.01em] sm:text-[32px]">
        Playground
      </h2>
      <FilterChips label="Filter playground" options={playgroundCategories} value={category} onChange={select} />
      <ul key={category} className={`grid w-full gap-5 ${filtered ? "motion-safe:animate-fade-in" : ""}`}>
        {items.map((item) => (
          <li key={item.id}>
            {item.demo ? (
              // Demos need their full Figma height, so these tiles don't shrink below 300px.
              <div className="grid aspect-[752/480] min-h-[300px] w-full place-items-center overflow-hidden rounded-2xl bg-paper sm:rounded-3xl">
                {/* From md up the demos render 25% larger (zoom) at 80% of the tile, so the scaled box is
                    tile-sized; the grid centres it either way. Pointer maths in each demo is zoom-aware. */}
                <div className="size-full md:h-[80%] md:w-[80%] md:[zoom:1.25]">
                  {item.demo === "signature" && <SignatureDemo />}
                  {item.demo === "collectibles" && <CollectiblesDemo />}
                  {item.demo === "emotions" && <EmotionDemo />}
                </div>
              </div>
            ) : (
              <Media
                image={item.image}
                sizes="(min-width: 832px) 752px, calc(100vw - 64px)"
                className="aspect-[752/480] w-full rounded-2xl sm:rounded-3xl"
              />
            )}
          </li>
        ))}
      </ul>
      <SectionNote lines={notes.playground} />
    </section>
  );
}
