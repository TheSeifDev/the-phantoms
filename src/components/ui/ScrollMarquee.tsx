"use client";
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Infinite marquee whose speed (and direction) reacts to scroll velocity. */
export function ScrollMarquee({
  children,
  speed = 40,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  /** seconds for one loop at rest */
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = track.current;
      if (!el || prefersReducedMotion()) return;
      const dir = reverse ? -1 : 1;
      gsap.set(el, { xPercent: reverse ? -50 : 0 });
      const tw = gsap.to(el, { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 });
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = self.getVelocity() / 260;
          const d = self.direction * dir;
          gsap.to(tw, { timeScale: d * (1 + Math.min(Math.abs(v), 9)), duration: 0.25, overwrite: true });
          gsap.to(tw, { timeScale: dir, duration: 1.2, delay: 0.2, overwrite: false });
        },
      });
      return () => st.kill();
    },
    { scope: track },
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
