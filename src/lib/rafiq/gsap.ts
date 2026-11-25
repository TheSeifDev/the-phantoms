import { gsap } from "@/lib/gsap";

export { gsap };

export function reportMotionFailure(label: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[RAFIQ] ${label}`, error);
  }
}
