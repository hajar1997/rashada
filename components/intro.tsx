type IntroProps = {
  paragraphs: readonly string[];
};

export function Intro({ paragraphs }: IntroProps) {
  return (
    <section aria-label="Introduction" className="w-full border-b-[0.4px] border-muted pb-9">
      <div className="flex flex-col gap-[1lh] text-xl text-muted">
        {paragraphs.map((text) => (
          <p key={text.slice(0, 32)} className="text-pretty">
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
