import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const paths = [
    "",
    "/work",
    "/services",
    "/team",
    "/contact",
    "/flagship/rafiq",
    "/flagship/omni",
    ...projects.filter((p) => !p.flagship).map((p) => `/work/${p.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));
}
