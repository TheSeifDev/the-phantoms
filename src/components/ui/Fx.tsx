"use client";
import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Global pointer effects, delegated from a single listener:
 *  [data-spot]   – cursor-follow spotlight (sets --mx / --my)
 *  [data-magnet] – element drifts toward the cursor
 *  [data-tilt]   – 3D tilt (value = max degrees, default 8)
 */
export function Fx() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const reset = (el: HTMLElement | null, props: gsap.TweenVars) => {
      if (el) gsap.to(el, { ...props, duration: 0.9, ease: "elastic.out(1,0.45)", overwrite: "auto" });
    };

    const move = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;

      const spot = t.closest<HTMLElement>("[data-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      const m = t.closest<HTMLElement>("[data-magnet]");
      if (m !== magnet) {
        reset(magnet, { x: 0, y: 0 });
        magnet = m;
      }
      if (m) {
        const r = m.getBoundingClientRect();
        const s = parseFloat(m.dataset.magnet || "0.28") || 0.28;
        gsap.to(m, {
          x: (e.clientX - (r.left + r.width / 2)) * s,
          y: (e.clientY - (r.top + r.height / 2)) * s,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      const tl = t.closest<HTMLElement>("[data-tilt]");
      if (tl !== tilt) {
        reset(tilt, { rotateX: 0, rotateY: 0 });
        tilt = tl;
      }
      if (tl) {
        const r = tl.getBoundingClientRect();
        const max = parseFloat(tl.dataset.tilt || "8") || 8;
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(tl, {
          rotateY: px * max * 2,
          rotateX: -py * max * 2,
          transformPerspective: 900,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };
    const leave = () => {
      reset(magnet, { x: 0, y: 0 });
      reset(tilt, { rotateX: 0, rotateY: 0 });
      magnet = tilt = null;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return null;
}
