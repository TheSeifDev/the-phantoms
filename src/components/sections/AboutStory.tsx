"use client";

import { useRef } from "react";
import { Fade, Label, Reveal } from "@/components/ui";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const milestones = [
  ["2025", "Founded in Alexandria", "A small product-minded team starts shipping together from the Mediterranean coast."],
  ["2025", "First client sites", "Early web work gives the team its first proof: clear strategy, careful engineering, visible progress."],
  ["2025 — now", "RAFIQ live prototype", "The local-first Arabic AI companion moves from graduation-grade idea to a working product prototype."],
  ["2026", "OMNI in development", "A swarm robotics concept takes shape across simulation, embedded systems and one shared protocol."],
  ["Now", "35 members, one standard", "Six tracks work under the same promise: make the complex useful, and make the result last."],
] as const;

export function AboutStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-story-reveal]",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top 80%", once: true } },
      );
    },
    { scope: root },
  );

  return (
    <>
      <section ref={root} id="manifesto" data-section="Manifesto" className="relative overflow-hidden border-y border-line py-24 sm:py-36">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[.62fr_1.38fr] lg:gap-24">
            <div data-story-reveal>
              <Label>Our reason</Label>
              <p className="ar mt-6 text-lg font-semibold text-red">مش بنعمل دوشة. بنعمل شغل.</p>
            </div>
            <div>
              <Reveal as="h2" className="font-display tight max-w-[12ch] text-[clamp(3.4rem,8vw,8.6rem)] font-extrabold">
                Make the complex feel <span className="serif-i text-red glow-text">obvious.</span>
              </Reveal>
              <p data-story-reveal className="mt-10 max-w-2xl text-[clamp(1.15rem,2vw,1.65rem)] leading-[1.25] text-muted">
                We believe the best digital products carry less visible effort. The interface is clear because the thinking was deep. The launch is calm because the system is ready. The team is trusted because the work stays honest.
              </p>
              <div data-story-reveal className="mt-12 grid gap-8 border-t border-line pt-7 sm:grid-cols-2">
                <p className="text-sm leading-relaxed text-muted">Phantoms is a product team, not a relay race. Founders, operators and teams work with the same designers and engineers who shape the outcome.</p>
                <p className="text-sm leading-relaxed text-muted">From Alexandria, we build for the web, the pocket and the operational layer in between — with enough taste to be memorable and enough rigour to be trusted.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="milestones" data-section="Milestones" className="relative overflow-hidden py-24 sm:py-36">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-7 border-b border-line pb-7 sm:flex-row sm:items-end">
            <div>
              <Label>The short history</Label>
              <h2 className="font-display tight mt-6 max-w-[9ch] text-[clamp(3rem,6vw,6.7rem)] font-extrabold">From first commit to <span className="serif-i text-red">full team.</span></h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted">A few honest markers. No inflated origin story — just the work that made the next thing possible.</p>
          </div>
          <div className="relative mt-14">
            <div aria-hidden className="absolute bottom-4 left-[4.35rem] top-4 w-px bg-gradient-to-b from-red/80 via-red/30 to-transparent sm:left-[7.35rem]" />
            <div className="space-y-0">
              {milestones.map(([year, title, line], index) => (
                <article key={`${year}-${title}`} data-story-reveal className="group relative grid gap-6 border-b border-line py-8 sm:grid-cols-[8rem_1fr] sm:gap-10 sm:py-10">
                  <div className="relative z-10 flex items-start gap-4 bg-bg pr-3 sm:gap-5">
                    <span className="glow-dot mt-1.5 h-2.5 w-2.5 shrink-0" />
                    <span className="mono text-xs text-red">{year}</span>
                  </div>
                  <div className="max-w-2xl pl-[1.85rem] sm:pl-0">
                    <div className="mono text-[0.62rem] text-muted">0{index + 1} / milestone</div>
                    <h3 className="mt-3 font-display text-[clamp(1.7rem,3vw,3rem)] font-bold leading-none tracking-[-0.055em] transition group-hover:text-red">{title}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">{line}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <Fade className="ar mt-8 text-lg text-muted" delay={0.15}>كل خطوة بتخلّي اللي بعدها أوضح.</Fade>
        </div>
      </section>
    </>
  );
}
