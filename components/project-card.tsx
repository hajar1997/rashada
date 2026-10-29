import Link from "next/link";
import type { Project } from "@/lib/content";
import { ProjectCover } from "./project-cover";

type ProjectCardProps = {
  project: Project;
  headingLevel?: "h2" | "h3";
};

export function ProjectCard({ project, headingLevel: Heading = "h3" }: ProjectCardProps) {
  return (
    <article className="group relative">
      <Link
        href={`/projects/${project.slug}`}
        className={`flex flex-col ${project.meta ? "gap-3" : "gap-5 sm:gap-6"} rounded-[28px] bg-surface p-4 transition-colors duration-300 hover:bg-surface-hover sm:rounded-[36px] sm:p-6`}
      >
        <ProjectCover
          project={project}
          sizes="(min-width: 832px) 752px, calc(100vw - 64px)"
          className="aspect-[752/480] w-full rounded-2xl sm:rounded-3xl"
          imageClassName="transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
        />
        <div className="flex flex-col gap-2">
          <Heading className="text-xl font-medium sm:text-2xl">{project.title}</Heading>
          {project.meta ? (
            <p className="flex items-center gap-2 text-sm text-muted">
              {project.meta.map((item, index) => (
                <span key={item} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden className="size-0.5 rounded-full bg-muted" />}
                  {item}
                </span>
              ))}
            </p>
          ) : (
            <p className="text-pretty text-muted">{project.summary}</p>
          )}
        </div>
      </Link>

    </article>
  );
}
