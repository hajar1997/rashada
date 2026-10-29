import type { Project } from "@/lib/content";
import { Media } from "./media";
import { RevitIconsCover } from "./revit-icons-cover";

type ProjectCoverProps = {
  project: Project;
  sizes: string;
  className?: string;
  imageClassName?: string;
  preload?: boolean;
};

/** A project's cover: its built-in vector artwork when it has one, otherwise its cover image. */
export function ProjectCover({ project, sizes, className = "", imageClassName = "", preload }: ProjectCoverProps) {
  if (project.coverArt === "revit-icons") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <RevitIconsCover className={imageClassName} />
      </div>
    );
  }
  return <Media image={project.cover} sizes={sizes} preload={preload} className={className} imageClassName={imageClassName} />;
}
