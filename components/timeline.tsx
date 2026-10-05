import type { TimelineEntry } from "@/lib/content";
import { BimixLogo } from "./icons";

export function Timeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <ol className="flex w-full flex-col gap-9">
      {entries.map((entry) => (
        <li key={entry.title} className="flex items-start gap-4 sm:items-center">
          <div className="grid size-[52px] shrink-0 place-items-center rounded-full bg-paper font-medium text-ink">
            {entry.logo === "bimix" ? <BimixLogo /> : entry.logo.label}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[5px] sm:flex-row sm:items-start">
            <div className="flex flex-1 flex-col gap-[5px]">
              <h3 className="text-lg font-medium sm:text-xl">{entry.title}</h3>
              <p className="text-muted">{entry.period}</p>
            </div>
            <p className="flex items-center gap-2 whitespace-nowrap text-muted">
              {entry.location}
              <span aria-hidden className="size-1 rounded-full bg-muted" />
              {entry.mode}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
