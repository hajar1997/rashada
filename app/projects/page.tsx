import type { Metadata } from "next";
import { ProjectList } from "@/components/project-list";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected website, mobile app, and SaaS design work.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <h1 className="sr-only">Projects</h1>
      <ProjectList />
    </>
  );
}
