import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { Hero } from "@/components/hero";
import { Playground } from "@/components/playground";
import { ProjectCard } from "@/components/project-card";
import { Section, notes } from "@/components/section";
import { Services } from "@/components/services";
import { featuredProjects } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-[60px]">
      <Hero />
      <Services />

      <Section id="recent-works" title="Recent works" note={notes.projects}>
        <ul className="flex w-full flex-col gap-6">
          {featuredProjects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
        <Link
          href="/projects"
          className="group inline-flex h-[60px] items-center gap-2 rounded-full bg-paper px-6 text-ink transition-colors duration-300 hover:bg-white"
        >
          See more
          <ArrowUpRightIcon className="transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </Section>

      <Playground />
    </div>
  );
}
