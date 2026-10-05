import type { Metadata } from "next";
import { CardDeck } from "@/components/card-deck";
import { Intro } from "@/components/intro";
import { Section, notes } from "@/components/section";
import { Services } from "@/components/services";
import { Timeline } from "@/components/timeline";
import { aboutCards, education, experience, profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: `${profile.name} — from fine art to UX/UI design. Experience, education, and services.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="flex flex-col gap-[60px]">
        <h1 className="sr-only">About {profile.name}</h1>
        <Intro paragraphs={[profile.intro, ...profile.story]} />

        <Section id="experience" title="Experience" note={notes.highlights}>
          <Timeline entries={experience} />
        </Section>

        <Section id="education" title="Education" note={notes.highlights}>
          <Timeline entries={education} />
        </Section>

        <Services />
      </div>

      <div className="mt-24 sm:mt-[188px]">
        <CardDeck items={aboutCards} />
      </div>
    </>
  );
}
