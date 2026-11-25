"use client";

import { useRef } from "react";
import { Label } from "@/components/ui";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const facts = [
  { label: "Founded", value: "2025", detail: "the first commit" },
  { label: "Based in", value: "Alexandria", detail: "Egypt · 31.2001° N" },
  { label: "Members", value: "35", detail: "builders, designers, researchers" },
  { label: "Projects", value: "12+", detail: "web, apps and SaaS" },
  { label: "Tracks", value: "Web / Apps / SaaS", detail: "one team, end to end" },
];

const clientPromises = [
  { number: "01", title: "One team, end-to-end", detail: "Design, engineering and launch stay in the same room." },
  { number: "02", title: "Startup speed", detail: "Short loops, weekly builds and decisions made close to the work." },
  { number: "03", title: "Honest by default", detail: "Clear scope, visible trade-offs and no performance theatre." },
];

export function About({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section || prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>("[data-about-enter]", section).forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "expo.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

      const echo = section.querySelector<HTMLElement>("[data-about-scrub]");
      if (echo) {
        gsap.fromTo(
          echo,
          { xPercent: -4, autoAlpha: 0.35 },
          {
            xPercent: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: echo, start: "top bottom", end: "top 48%", scrub: 0.65 },
          },
        );
      }
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
      <div className="wrap relative">
        <div data-about-enter className="border-b border-line pb-5">
          <Label>The name</Label>
        </div>

        <div className="mt-12 flex flex-col gap-10 lg:mt-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2
            data-about-enter
            className="font-display max-w-[11ch] text-[clamp(3.4rem,12vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.085em]"
          >
            Built in the <span className="serif-i font-normal text-red">shadows.</span>
          </h2>
          <div className="max-w-xl lg:w-[34%] lg:pb-2">
            <p
              data-about-scrub
              className="serif-i text-[clamp(2.8rem,5.8vw,6rem)] leading-[0.9] tracking-[-0.065em]"
            >
              Felt everywhere
            </p>
            <p data-about-enter className="mt-7 max-w-lg text-sm leading-[1.85] text-muted sm:text-base">
              Phantoms work quietly in the background: focused, close to the problem, and more interested in the result than the noise around it. You see the product. We know every layer that made it feel inevitable.
            </p>
          </div>
        </div>

        <ul className="mt-20 border-y border-line sm:mt-28" aria-label="Phantoms facts">
          {facts.map((fact, index) => (
            <li
              key={fact.label}
              data-about-enter
              className={`flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-6 sm:py-7 ${index < facts.length - 1 ? "border-b border-line" : ""}`}
            >
              <span className="mono text-[0.68rem] uppercase tracking-[0.16em] text-muted sm:w-[19%]">{fact.label}</span>
              <span className="font-display text-[clamp(2rem,4.2vw,4rem)] font-bold leading-none tracking-[-0.06em] sm:w-[39%]">
                {fact.value}
              </span>
              <span className="text-sm leading-relaxed text-muted sm:flex-1">{fact.detail}</span>
            </li>
          ))}
        </ul>

        <div className="mt-20 flex flex-col gap-5 sm:mt-28 sm:flex-row sm:gap-8">
          <span className="label shrink-0 sm:mt-3 sm:w-[19%]">The point</span>
          <p data-about-enter className="font-display max-w-5xl text-[clamp(2.7rem,7.8vw,8rem)] font-bold leading-[0.94] tracking-[-0.075em]">
            Less hand-off. More ownership. Better work.
          </p>
        </div>

        <div className="mt-20 border-t border-line pt-8 sm:mt-28 sm:pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
            <div className="shrink-0 sm:w-[19%]">
              <Label>What this means for you</Label>
            </div>
            <p data-about-enter className="font-display max-w-4xl text-[clamp(2rem,5vw,5.2rem)] font-semibold leading-[0.96] tracking-[-0.065em]">
              The people who sell the work are the people who make it.
            </p>
          </div>

          <ol className="mt-12 border-t border-line sm:mt-16">
            {clientPromises.map((promise) => (
              <li
                key={promise.number}
                data-about-enter
                className="flex flex-col gap-3 border-b border-line py-6 sm:flex-row sm:items-baseline sm:gap-6 sm:py-8"
              >
                <span className="mono text-sm text-red sm:w-[19%]">{promise.number}</span>
                <h3 className="font-display text-[clamp(1.45rem,2.8vw,2.6rem)] font-bold leading-tight tracking-[-0.05em] sm:w-[39%]">
                  {promise.title}
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted sm:flex-1 sm:text-base">{promise.detail}</p>
              </li>
            ))}
          </ol>

          <p data-about-enter className="mt-9 max-w-5xl border-l border-red pl-5 text-sm leading-[1.9] text-muted sm:mt-12 sm:pl-7 sm:text-base">
            From a first landing page to a product with its own operating rhythm, we stay close enough to care and experienced enough to know what to cut.
          </p>
        </div>
      </div>
    </section>
  );
}
