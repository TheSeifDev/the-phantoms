"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Fade, Label, Reveal } from "@/components/ui";
import { Logo } from "@/components/ui/Brand";
import { HexOutline } from "@/components/ui/Hex";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const principles = [
  ["01", "Quietly obsessive", "We do the deep work backstage so the product can feel simple in public."],
  ["02", "Own the whole arc", "One team carries the question, the interface, the system and the launch."],
  ["03", "Honest by default", "Scope stays visible. Trade-offs get named. Promises stay small and real."],
  ["04", "Alexandria-made, world-ready", "Rooted in Alexandria, built with the standards and ambition to travel."],
];

export function PhantomCode() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-code-item]",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
        },
      );
      gsap.to("[data-code-hex]", {
        y: -70,
        rotate: 22,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="phantom-code" data-section="Phantom Code" className="grain-s relative overflow-hidden sec-pad">
      <div aria-hidden className="aura -right-40 top-[20%] h-[28rem] w-[28rem] opacity-20" />
      <div data-code-hex aria-hidden className="pointer-events-none absolute -left-28 top-[38%] text-red/20"><HexOutline size={300} /></div>
      <div className="wrap relative">
        <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <div>
            <Label>Team identity</Label>
            <Reveal as="h2" className="font-display tight mt-7 max-w-[8ch] text-[clamp(3.5rem,7vw,7.4rem)] font-extrabold">
              The <span className="serif-i text-red glow-text">Phantom</span> Code
            </Reveal>
            <Fade delay={0.2} className="mt-8 max-w-sm text-sm leading-relaxed text-muted">
              A standard is how a 35-person team stays recognisable when nobody is watching. It is the shared behaviour behind every screen, system and hand-off.
            </Fade>
            <div className="mt-12 flex items-center gap-5 border-t border-line pt-5">
              <div className="edge-glow grid h-20 w-20 place-items-center rounded-[1.4rem] bg-red/10"><Logo size={52} /></div>
              <div>
                <div className="mono text-[0.58rem] uppercase tracking-[0.2em] text-muted">Our operating signal</div>
                <div className="mt-2 font-display text-xl font-bold tracking-[-0.04em]">Built together.</div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <span className="mono text-[0.64rem] uppercase tracking-[0.18em] text-muted">Four things we protect</span>
              <ArrowUpRight size={16} className="text-red" />
            </div>
            <div className="divide-y divide-line border-y border-line">
              {principles.map(([number, title, line]) => (
                <article key={number} data-code-item className="group relative py-7 sm:py-9">
                  <div className="grid gap-5 sm:grid-cols-[4rem_1fr] sm:items-start">
                    <span className="mono text-[0.68rem] text-red">{number}</span>
                    <div>
                      <h3 className="font-display max-w-[18ch] text-[clamp(1.8rem,3.4vw,3.4rem)] font-bold leading-[.92] tracking-[-0.06em] transition group-hover:text-red">{title}</h3>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{line}</p>
                    </div>
                  </div>
                  <span aria-hidden className="absolute bottom-[-1px] left-0 h-px w-0 bg-red shadow-[0_0_18px_1px_rgba(255,36,24,.8)] transition-all duration-700 group-hover:w-full" />
                </article>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-6 rounded-[1.4rem] border border-line bg-surface/45 p-5 backdrop-blur sm:p-6">
              <div>
                <div className="mono text-[0.58rem] uppercase tracking-[0.2em] text-muted">The system underneath</div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="h-8 w-8 rounded-full bg-red shadow-[0_0_22px_rgba(255,36,24,.5)]" />
                  <span className="h-8 w-8 rounded-full bg-[#0a0a0c] ring-1 ring-white/15" />
                  <span className="h-8 w-8 rounded-full bg-[#f3f0ea]" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <HexOutline size={58} className="text-red/80" />
                <div><div className="font-display text-lg font-bold tracking-[-0.04em]">Six tracks.</div><div className="text-xs text-muted">One way of working.</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
