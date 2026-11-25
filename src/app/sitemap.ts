import type { MetadataRoute } from "next";
import { projects, members } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const paths = [
    "",
    "/work",
    "/services",
    "/about",
    "/team",
    "/memories",
    "/process",
    "/contact",
    "/flagship/rafiq",
    "/flagship/omni",
    ...projects.filter((p) => !p.flagship).map((p) => `/work/${p.slug}`),
    ...members.map((m) => `/team/${m.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));
}
