"use client";

import { useState } from "react";
import { projectCategories, projects, type ProjectCategory } from "@/lib/content";
import { FilterChips } from "./filter-chips";
import { ProjectCard } from "./project-card";

export function ProjectList() {
  const [category, setCategory] = useState<ProjectCategory>(projectCategories[0]);
  const [filtered, setFiltered] = useState(false);
  const visible = projects.filter((project) => project.categories.includes(category));

  function select(next: ProjectCategory) {
    setCategory(next);
    setFiltered(true);
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <FilterChips label="Filter projects" options={projectCategories} value={category} onChange={select} />
      <ul key={category} className={`flex w-full flex-col gap-6 ${filtered ? "motion-safe:animate-fade-in" : ""}`}>
        {visible.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
