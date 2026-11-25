import fs from "node:fs";
import path from "node:path";

const IMG = /\.(webp|jpe?g|png|avif)$/i;

function list(dir: string): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", dir))
      .filter((f) => IMG.test(f) && !f.startsWith("."))
      .sort();
  } catch {
    return [];
  }
}

/** Map of member slug -> public path, from public/team/<slug>.<ext> */
export function teamPhotos(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of list("team")) {
    out[f.replace(IMG, "")] = `/team/${f}`;
  }
  return out;
}

/** All "memories" photos (old team), from public/memories/* */
export function memoryPhotos(): string[] {
  return list("memories").map((f) => `/memories/${f}`);
}
