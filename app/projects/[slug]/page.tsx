import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BoardGallery } from "@/components/board-gallery";
import { ArrowUpRightIcon } from "@/components/icons";
import { Media } from "@/components/media";
import { ProjectCover } from "@/components/project-cover";
import { getProject, projects } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, type: "article" },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  // Boards and the copy between them read as one sequence; image tiles use the grid below.
  const sequence = project.gallery.flatMap((item) => (item.span === "board" || item.span === "text" ? [item] : []));
  const tiles = project.gallery.flatMap((item) => (item.span === "full" || item.span === "half" ? [item] : []));

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-5">
        <ProjectCover
          project={project}
          sizes="(min-width: 832px) 800px, calc(100vw - 32px)"
          preload
          className={`${project.coverArt ? "aspect-[752/480]" : "aspect-[800/480]"} w-full rounded-2xl sm:rounded-3xl`}
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">{project.title}</h1>
          {/* Paragraphs are separated by blank lines in the content. */}
          <div className="flex flex-col gap-[1lh] text-muted">
            {project.description.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </header>

      {/* Case-study boards: column width, click to enlarge. */}
      {sequence.length > 0 && <BoardGallery items={sequence} />}

      {tiles.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {tiles.map((item, index) => (
            <li key={index} className={item.span === "full" ? "sm:col-span-2" : undefined}>
              <Media
                image={item.image}
                sizes={item.span === "full" ? "(min-width: 832px) 800px, 100vw" : "(min-width: 832px) 390px, 100vw"}
                className={`w-full rounded-2xl sm:rounded-3xl ${
                  item.span === "full" ? "aspect-[800/480]" : "aspect-[800/480] sm:aspect-[390/480]"
                }`}
              />
            </li>
          ))}
        </ul>
      )}

      {project.collaborator && (
        <p className="border-t-[0.4px] border-muted pt-9 text-muted">
          I worked on this project together with my colleague{" "}
          <a
            href={project.collaborator.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-paper underline decoration-muted underline-offset-4 transition-colors hover:decoration-paper"
          >
            {project.collaborator.name}
            <ArrowUpRightIcon
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
            <span className="sr-only">(LinkedIn, opens in a new tab)</span>
          </a>
          .
        </p>
      )}
    </article>
  );
}
