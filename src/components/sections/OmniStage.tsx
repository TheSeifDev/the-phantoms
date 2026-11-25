"use client";

import { useRef, useState } from "react";
import { ArrowDown, CircleDot, Layers3 } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SwarmScene } from "@/components/three/lazy";

const formations = [
  { name: "SCATTER", value: 0.08, note: "Observe the units" },
  { name: "WAVE", value: 0.46, note: "Route a surface" },
  { name: "SPHERE", value: 0.9, note: "Hold the formation" },
];

export function OmniStage() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!root.current || prefersReducedMotion()) {
      progress.current = 0.8;
      if (bar.current) bar.current.style.transform = "scaleX(.8)";
      return;
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const trigger = gsap.to(progress, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          onUpdate: (self) => {
            const value = self.progress;
            if (bar.current) bar.current.style.transform = `scaleX(${value})`;
            const next = value < 0.3 ? 0 : value < 0.68 ? 1 : 2;
            if (next !== activeRef.current) {
              activeRef.current = next;
              setActive(next);
            }
          },
        },
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, { scope: root });

  const choose = (index: number) => {
    activeRef.current = index;
    setActive(index);
    gsap.to(progress, { current: formations[index].value, duration: 0.7, ease: "power3.out" });
    if (bar.current) bar.current.style.transform = `scaleX(${formations[index].value})`;
  };

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-[#050506] text-white md:h-[180svh]">
      <div className="relative h-full md:sticky md:top-0 md:h-[100svh] md:max-h-[100svh] md:pt-24 md:pb-5">
        <div className="absolute inset-0 bg-[radial-gradient(55%_65%_at_52%_44%,rgba(255,36,24,.14),transparent_70%)]" />
        <SwarmScene progress={progress} className="opacity-90" />
        <div className="wrap relative flex h-full min-h-0 flex-col justify-between pb-7 pt-28 sm:pb-9 md:pt-5">
          <div className="flex items-start justify-between gap-5"><div><span className="mono text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/50">OMNI / live simulation</span><div className="mt-3 flex items-center gap-2 text-xs text-white/45"><span className="h-2 w-2 rounded-full bg-red shadow-[0_0_12px_rgba(255,36,24,.8)]" /> System online · 1,100 units</div></div><span className="mono text-[0.62rem] uppercase tracking-[0.2em] text-white/40">Scroll to re-form</span></div>

          <div className="mx-auto w-full max-w-3xl text-center"><div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/55 backdrop-blur"><CircleDot size={13} className="text-red" /> Formation / {formations[active].note}</div><h2 className="font-display tight mt-6 text-[clamp(3.8rem,12vw,10rem)] font-extrabold tracking-[-0.08em]">{formations[active].name}<span className="text-red">.</span></h2><p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">One control layer turns thousands of individual units into a visible, responsive system.</p><div className="mt-7 flex flex-wrap justify-center gap-2">{formations.map((formation, index) => <button key={formation.name} type="button" onClick={() => choose(index)} aria-pressed={active === index} className={`rounded-full border px-4 py-2 text-[0.61rem] font-bold uppercase tracking-[0.15em] transition ${active === index ? "border-red bg-red text-white" : "border-white/15 bg-white/5 text-white/55 hover:border-white/35 hover:text-white"}`}>{formation.name}</button>)}</div></div>

          <div className="space-y-4"><div className="flex items-center justify-between text-[0.61rem] uppercase tracking-[0.16em] text-white/45"><span className="flex items-center gap-2"><Layers3 size={14} /> Control protocol / MQTT</span><span>Keep scrolling</span></div><div className="h-px w-full bg-white/15"><div ref={bar} className="h-full origin-left bg-red shadow-[0_0_14px_rgba(255,36,24,.9)]" style={{ transform: "scaleX(0)" }} /></div><div className="flex items-center justify-center gap-2 text-[0.61rem] uppercase tracking-[0.16em] text-white/35"><ArrowDown size={13} className="animate-bounce text-red" /> scroll / switch formation</div></div>
        </div>
      </div>
    </section>
  );
}
