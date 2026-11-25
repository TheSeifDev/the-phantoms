"use client";

import { useRef } from "react";
import { Fade, Label, Reveal } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { Logo } from "@/components/ui/Brand";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const principles = [
  ["01", "Ship in the dark, shine in the light", "Quiet focus backstage. Clear work in public."],
  ["02", "Own it end-to-end", "From the first question to the last deployed pixel."],
  ["03", "Honest by default", "Say what is true, make limits visible, keep promises small and real."],
  ["04", "Alexandria-made, world-ready", "Rooted here. Built to travel everywhere."],
];

export function PhantomCode() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo("[data-code-item]", { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 82%", once: true } });
    gsap.to("[data-code-hex]", { y: -80, rotate: 25, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
  }, { scope: root });

  return (
    <section ref={root} id="phantom-code" data-section="Phantom Code" className="grain-s relative overflow-hidden sec-pad">
      <div aria-hidden className="aura -right-40 top-1/4 h-96 w-96 opacity-20" />
      <div data-code-hex aria-hidden className="pointer-events-none absolute -left-24 top-1/3 text-red/25"><HexOutline size={280} /></div>
      <div className="wrap relative">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <Label>The team identity</Label>
            <Reveal as="h2" className="font-display tight mt-7 max-w-[8ch] text-[clamp(3.3rem,7vw,7rem)] font-extrabold">The <span className="serif-i text-red">Phantom</span> Code</Reveal>
            <Fade delay={0.2} className="mt-7 max-w-sm text-sm leading-relaxed text-muted">A standard is more than a stack. It is how we make decisions when nobody is watching.</Fade>
            <div className="mt-12 flex items-center gap-5 border-t border-line pt-5">
              <div className="grid h-20 w-20 place-items-center rounded-[1.4rem] border border-red/40 bg-red/10 shadow-[0_0_40px_-14px_rgba(255,36,24,.8)]"><Logo size={52} /></div>
              <div><div className="mono text-[0.58rem] uppercase tracking-[0.2em] text-muted">Identity mark</div><div className="mt-2 font-display text-xl font-bold tracking-[-0.04em]">Built together.</div></div>
            </div>
          </div>
          <div>
            <div className="divide-y divide-line border-y border-line">
              {principles.map(([number, title, line]) => <article key={number} data-code-item className="group relative py-7 transition-colors hover:text-white sm:py-9"><div className="grid gap-5 sm:grid-cols-[4rem_1fr] sm:items-start"><span className="mono text-[0.68rem] text-red">{number}</span><div><h3 className="font-display max-w-[18ch] text-[clamp(1.7rem,3.4vw,3.2rem)] font-bold leading-[0.96] tracking-[-0.06em] transition group-hover:text-red">{title}</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{line}</p></div></div><span aria-hidden className="absolute bottom-[-1px] left-0 h-px w-0 bg-red shadow-[0_0_18px_1px_rgba(255,36,24,.8)] transition-all duration-700 group-hover:w-full" /></article>)}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-7 rounded-[1.4rem] border border-line bg-surface/45 p-5 backdrop-blur sm:p-6">
              <div><div className="mono text-[0.58rem] uppercase tracking-[0.2em] text-muted">Our marks</div><div className="mt-4 flex items-center gap-2"><span className="h-8 w-8 rounded-full bg-red shadow-[0_0_22px_rgba(255,36,24,.5)]" /><span className="h-8 w-8 rounded-full bg-[#0a0a0c] ring-1 ring-white/15" /><span className="h-8 w-8 rounded-full bg-[#f3f0ea]" /></div></div>
              <div className="flex items-center gap-4"><HexOutline size={58} className="text-red/80" /><div><div className="font-display text-lg font-bold tracking-[-0.04em]">The hex</div><div className="text-xs text-muted">Six squads. One shape.</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
