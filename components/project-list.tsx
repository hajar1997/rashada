"use client";

import { useState } from "react";
import { projectCategories, projects } from "@/lib/content";
import { FilterChips } from "./filter-chips";
import { ProjectCard } from "./project-card";

const filters = ["All", ...projectCategories] as const;
type Filter = (typeof filters)[number];

export function ProjectList() {
  // "All" (Figma's first chip) shows every project and is the default.
  const [category, setCategory] = useState<Filter>("All");
  const [filtered, setFiltered] = useState(false);
  const visible = category === "All" ? projects : projects.filter((project) => project.categories.includes(category));

  function select(next: Filter) {
    setCategory(next);
    setFiltered(true);
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <FilterChips label="Filter projects" options={filters} value={category} onChange={select} />
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
