import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  /** Small closing caption; each entry renders on its own line. */
  note?: readonly string[];
  children: ReactNode;
};

export function Section({ id, title, note, children }: SectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="flex w-full flex-col items-center gap-10 border-b-[0.4px] border-muted pb-9"
    >
      <h2 id={id} className="text-[28px] font-medium tracking-[-0.01em] sm:text-[32px]">
        {title}
      </h2>
      {children}
      {note && <SectionNote lines={note} />}
    </section>
  );
}

export function SectionNote({ lines }: { lines: readonly string[] }) {
  return (
    <p className="text-center text-xs text-muted">
      {lines.map((line, i) => (
        <span key={line} className="block">
          {i > 0 && " "}
          {line}
        </span>
      ))}
    </p>
  );
}

export const notes = {
  services: ["Need something special?", "I’m always up for something new."],
  projects: ["A few favourites from the last 3 years.", "There’s more where these came from."],
  highlights: ["That’s just the highlights reel.", "Scroll down to see it all come together."],
  playground: ["No client, no brief - just me having fun.", "This is where ideas go to play."],
} as const;
