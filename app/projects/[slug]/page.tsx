import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Media } from "@/components/media";
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

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-5">
        <Media
          image={project.cover}
          sizes="(min-width: 640px) 640px, calc(100vw - 32px)"
          preload
          className="aspect-[640/300] w-full rounded-2xl sm:rounded-3xl"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium">{project.title}</h1>
          <p className="text-pretty text-muted">{project.description}</p>
        </div>
      </header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {project.gallery.map((item, index) => (
          <li key={index} className={item.span === "full" ? "sm:col-span-2" : undefined}>
            <Media
              image={item.image}
              sizes={item.span === "full" ? "(min-width: 640px) 640px, 100vw" : "(min-width: 640px) 310px, 100vw"}
              className={`w-full rounded-2xl sm:rounded-3xl ${
                item.span === "full" ? "aspect-[640/300]" : "aspect-[640/300] sm:aspect-[310/300]"
              }`}
            />
          </li>
        ))}
      </ul>
    </article>
  );
}
