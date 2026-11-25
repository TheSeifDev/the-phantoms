"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Label, Reveal } from "@/components/ui";
import { processSteps as steps } from "@/data/site";

export function Process() {
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(line.current, { scaleY: 1 });
        return;
      }
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: { trigger: "[data-steps]", start: "top 65%", end: "bottom 60%", scrub: 0.5 },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el) => {
        gsap.fromTo(
          el.querySelector("[data-body]"),
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 80%", once: true } },
        );
        gsap.to(el.querySelector("[data-node]"), {
          backgroundColor: "#ff2418",
          scale: 1.25,
          boxShadow: "0 0 0 8px rgba(255,36,24,.18), 0 0 40px rgba(255,36,24,.8)",
          duration: 0.5,
          scrollTrigger: { trigger: el, start: "top 62%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="relative py-24 sm:py-32">
      <div className="wrap">
        <div className="text-center">
          <Label>Process · 探設築届</Label>
          <Reveal as="h2" className="font-display tight mx-auto mt-6 max-w-[14ch] text-[clamp(2.8rem,8vw,7.5rem)] font-extrabold">
            From idea to <span className="serif-i text-red">launch</span>.
          </Reveal>
          <p className="ar mt-5 text-xl text-muted">من الفكرة للإطلاق في أربع خطوات.</p>
        </div>

        <div data-steps className="relative mx-auto mt-20 max-w-5xl">
          {/* rail */}
          <div className="absolute bottom-0 left-[1.1rem] top-0 w-px bg-line lg:left-1/2 lg:-translate-x-1/2" />
          <div
            ref={line}
            className="absolute bottom-0 left-[1.1rem] top-0 w-px origin-top bg-red shadow-[0_0_14px_2px_rgba(255,36,24,.7)] lg:left-1/2 lg:-translate-x-1/2"
          />
          <ol className="space-y-16 lg:space-y-28">
            {steps.map((s, i) => {
              const right = i % 2 === 1;
              return (
                <li key={s.n} data-step className="relative pl-14 lg:grid lg:grid-cols-2 lg:gap-24 lg:pl-0">
                  <span
                    data-node
                    className="absolute left-[0.45rem] top-3 z-10 h-[1.4rem] w-[1.4rem] rounded-full border-2 border-red bg-bg lg:left-1/2 lg:-translate-x-1/2"
                  />
                  <div
                    data-body
                    className={`relative ${right ? "lg:col-start-2" : "lg:col-start-1 lg:text-right"}`}
                  >
                    <span
                      className={`jp pointer-events-none absolute -top-12 select-none text-[9rem] leading-none text-fg/[0.06] ${right ? "-left-2" : "-right-2 lg:right-0"}`}
                    >
                      {s.kanji}
                    </span>
                    <div className="relative">
                      <div className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-red">Step {s.n}</div>
                      <h3 className="font-display mt-2 text-5xl font-extrabold tracking-[-0.045em] sm:text-6xl">
                        {s.title}
                      </h3>
                      <div className="ar mt-1 text-xl text-muted">{s.ar}</div>
                      <p className={`mt-4 max-w-md text-sm leading-relaxed text-muted ${right ? "" : "lg:ml-auto"}`}>
                        {s.line}
                      </p>
                      <ul className={`mt-5 flex flex-wrap gap-1.5 ${right ? "" : "lg:justify-end"}`}>
                        {s.out.map((o) => (
                          <li key={o} className="chip">
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
