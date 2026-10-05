import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/projects", "/playground", ...projects.map(({ slug }) => `/projects/${slug}`)];
  return routes.map((route) => ({ url: `${siteUrl}${route}` }));
}
