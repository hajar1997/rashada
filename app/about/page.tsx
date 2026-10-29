import type { Metadata } from "next";
import { CardDeck } from "@/components/card-deck";
import { Intro } from "@/components/intro";
import { Services } from "@/components/services";
import { aboutCards, profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: `${profile.name} — from fine art to UX/UI design: my story and services.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-[60px]">
      <h1 className="sr-only">About {profile.name}</h1>

      {/* Figma: the draggable card stack opens the page, 100px above the intro. */}
      <div className="mb-10">
        <CardDeck items={aboutCards} />
      </div>

      <Intro paragraphs={[profile.intro, ...profile.story]} />
      <Services />
    </div>
  );
}
