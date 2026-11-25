"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SwarmScene } from "@/components/three/lazy";

const forms = ["SCATTER", "WAVE", "SPHERE"];

/** Pinned full-screen swarm — scroll morphs the formation. */
export function OmniStage() {
  const root = useRef<HTMLDivElement>(null);
  const prog = useRef(0);
  const label = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        prog.current = 0.7;
        return;
      }
      gsap.to(prog, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 0.6,
          onUpdate: (s) => {
            if (label.current) label.current.textContent = forms[Math.min(2, Math.floor(s.progress * 3))];
            if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
          },
        },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative h-[100svh] overflow-hidden bg-[#050506] text-white">
      <SwarmScene progress={prog} />
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,rgba(0,0,0,.6))]" />
      <div className="wrap relative flex h-full flex-col justify-between pb-10 pt-28">
        <div className="flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/60">
          <span>Live simulation</span>
          <span>2,200 units</span>
        </div>
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="mono text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white/50">Formation</div>
            <span ref={label} className="font-display mt-2 block text-[clamp(2rem,4.4vw,3.8rem)] font-extrabold leading-none tracking-[-0.05em] text-red">
              SCATTER
            </span>
          </div>
          <p className="hidden max-w-[16rem] text-right text-sm text-white/55 sm:block">Keep scrolling — the swarm re-forms with you.</p>
        </div>
        <div>
          <div className="h-px w-full bg-white/15">
            <div ref={bar} className="h-full origin-left bg-red" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
