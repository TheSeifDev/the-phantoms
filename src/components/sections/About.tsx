"use client";

import { useRef } from "react";
import { Counter, Fade, Label, Reveal, WordScrub } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const facts = [
  { label: "Founded", value: "2025", detail: "the first commit" },
  { label: "Based in", value: "Alexandria", detail: "Egypt · 31.2001° N" },
  { label: "Members", to: 35, suffix: "", detail: "builders, designers, researchers" },
  { label: "Projects", to: 12, suffix: "+", detail: "web, apps and SaaS" },
  { label: "Tracks", value: "Web / Apps / SaaS", detail: "one team, end to end" },
];

const clientPromises = [
  ["One team, end-to-end", "Design, engineering and launch stay in the same room."],
  ["Startup speed", "Short loops, weekly builds and decisions made close to the work."],
  ["Honest by default", "Clear scope, visible trade-offs and no performance theatre."],
];

export function About({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-about-card]",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
        },
      );
      gsap.to("[data-about-hex]", {
        y: -90,
        rotate: 28,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      data-section="About"
      className={`grain-s relative overflow-hidden ${compact ? "py-20 sm:py-28" : "sec-pad"}`}
    >
      <div data-about-hex aria-hidden className="pointer-events-none absolute -left-28 top-20 text-red/25">
        <HexOutline size={310} width={0.8} />
      </div>
      <div aria-hidden className="aura right-[-14rem] top-[28%] h-[30rem] w-[30rem] opacity-20" />

      <div className="wrap relative">
        <div className="max-w-6xl">
          <Label>01 — About</Label>
          <Reveal
            as="h2"
            className="font-display tight mt-8 max-w-[13ch] text-[clamp(3rem,8vw,8.1rem)] font-extrabold"
          >
            The quiet team behind the work people remember.
          </Reveal>
          <WordScrub
            className="mt-10 max-w-5xl font-display text-[clamp(1.65rem,3.3vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.04em] text-fg/90"
            start="top 78%"
            end="bottom 48%"
          >
            Most teams ship code. We ship products people trust — websites, apps and SaaS built by a 35-person team in Alexandria that works like a startup, not an agency. The details are quiet. The result is felt everywhere.
          </WordScrub>
          <p className="ar mt-7 text-base font-semibold text-red sm:text-lg">بنشتغل بهدوء، وبنطلع حاجة تفرق.</p>
        </div>

        <div className="mt-20 grid gap-4 lg:mt-28 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div data-about-card className="relative overflow-hidden rounded-[2rem] border border-line bg-card p-7 sm:p-10">
            <div aria-hidden className="absolute -right-16 -top-16 text-red/15">
              <HexOutline size={250} width={1} />
            </div>
            <span className="label">The name</span>
            <div className="relative mt-20 sm:mt-28">
              <p className="font-display text-[clamp(2.5rem,5vw,5.4rem)] font-extrabold leading-[0.9] tracking-[-0.07em]">
                Built in the <span className="serif-i text-red glow-text">shadows.</span>
              </p>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
                Phantoms work quietly in the background: focused, close to the problem, and more interested in the result than the noise around it. You see the product. We know every layer that made it feel inevitable.
              </p>
              <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted">
                <span className="glow-dot h-2 w-2" />
                <span>Felt everywhere</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} data-about-card className="card flex min-h-40 flex-col justify-between p-6 sm:min-h-44 sm:p-7">
                <span className="label">{fact.label}</span>
                <div>
                  <div className="font-display text-[clamp(1.8rem,3.5vw,3.35rem)] font-extrabold leading-none tracking-[-0.06em]">
                    {fact.to ? <Counter to={fact.to} suffix={fact.suffix} /> : fact.value}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted">{fact.detail}</p>
                </div>
              </div>
            ))}
            <div data-about-card className="card flex min-h-40 items-end justify-between gap-4 bg-red p-6 text-white sm:col-span-2 sm:min-h-44 sm:p-7">
              <div>
                <span className="label !text-white/70">The point</span>
                <p className="mt-4 max-w-lg font-display text-2xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-3xl">
                  Less hand-off. More ownership. Better work.
                </p>
              </div>
              <HexOutline size={78} className="hidden shrink-0 text-white/45 sm:block" width={1.3} />
            </div>
          </div>
        </div>

        <div data-about-card className="mt-16 border-t border-line pt-7 sm:mt-24 sm:pt-9">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Label>What this means for you</Label>
              <p className="mt-4 max-w-xl font-display text-[clamp(1.8rem,3.2vw,3.1rem)] font-bold leading-[0.96] tracking-[-0.055em]">
                The people who sell the work are the people who make it.
              </p>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-3xl">
              {clientPromises.map(([title, line], index) => (
                <div key={title} className="group rounded-[1.25rem] border border-line bg-surface/45 p-5 transition hover:-translate-y-1 hover:border-red/60 hover:shadow-[0_0_35px_-15px_rgba(255,36,24,.7)]">
                  <span className="mono text-[0.65rem] text-red">0{index + 1}</span>
                  <h3 className="mt-7 font-display text-lg font-bold tracking-[-0.04em] transition group-hover:text-red">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{line}</p>
                </div>
              ))}
            </div>
          </div>
          <Fade className="mt-8 text-sm text-muted" delay={0.15}>
            From a first landing page to a product with its own operating rhythm, we stay close enough to care and experienced enough to know what to cut.
          </Fade>
        </div>
      </div>
    </section>
  );
}
