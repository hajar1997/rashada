import { services } from "@/lib/content";
import { Section, notes } from "./section";

export function Services() {
  return (
    <Section id="services" title="Services" note={notes.services}>
      {/* Rows match Figma from md up; below that the lists dissolve into one wrapping flow. */}
      <div className="flex w-full flex-wrap justify-center gap-2 md:flex-col md:items-center">
        {services.map((row) => (
          <ul key={row[0]} className="contents md:flex md:flex-wrap md:justify-center md:gap-2">
            {row.map((service) => (
              <li
                key={service}
                className="whitespace-nowrap rounded-full border-[0.6px] border-muted px-3.5 py-3 text-base leading-none text-muted"
              >
                {service}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </Section>
  );
}
