import Image from "next/image";
import { profile } from "@/lib/content";

type IntroProps = {
  paragraphs: readonly string[];
};

export function Intro({ paragraphs }: IntroProps) {
  const single = paragraphs.length === 1;

  return (
    <section
      aria-label="Introduction"
      className={`flex w-full flex-col gap-5 border-b-[0.4px] border-muted pb-9 sm:flex-row ${single ? "sm:items-center" : "sm:items-start"}`}
    >
      <Image
        src={profile.avatar.src}
        alt={profile.avatar.alt}
        width={126}
        height={126}
        preload
        className="size-24 shrink-0 rounded-full sm:size-[126px]"
      />
      <div className="flex flex-1 flex-col gap-[1lh] text-muted">
        {paragraphs.map((text) => (
          <p key={text.slice(0, 32)} className="text-pretty">
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
