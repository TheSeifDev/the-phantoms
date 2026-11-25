"use client";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Label, Reveal } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { processSteps } from "@/data/site";

export function Process() {
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-step]");
      gsap.to(line.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: "[data-steps]", start: "top 55%", end: "bottom 60%", scrub: true },
      });
      rows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (s) => s.isActive && setActive(i),
        });
        gsap.fromTo(
          row,
          { opacity: 0.18, x: 40 },
          {
            opacity: 1,
            x: 0,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top 80%", end: "top 50%", scrub: true },
          },
        );
        gsap.fromTo(
          row.querySelector("[data-hexbig]"),
          { rotate: -30, scale: 0.7 },
          { rotate: 30, scale: 1.05, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" data-section="Process" className="relative sec-pad">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* sticky left */}
        <div className="lg:sticky lg:top-28 lg:h-[calc(100svh-9rem)]">
          <div className="flex h-full flex-col justify-between">
            <div>
              <Label>How we work</Label>
              <Reveal as="h2" className="font-display tight mt-6 text-[clamp(2.6rem,5.6vw,5.2rem)] font-extrabold">
                From idea to <span className="serif-i text-red">launch</span>.
              </Reveal>
              <p className="ar mt-4 text-xl font-semibold">من الفكرة للإطلاق.</p>
            </div>
            <div className="mt-10 hidden items-end gap-6 lg:flex">
              <div className="font-display text-[11rem] font-extrabold leading-[0.78] tracking-[-0.08em]">
                <span key={active} className="inline-block animate-[fadeUp_.6s_cubic-bezier(.16,1,.3,1)]">
                  0{active + 1}
                </span>
              </div>
              <div className="pb-3">
                <div className="mono text-xs uppercase tracking-[0.18em] text-muted">Step</div>
                <div className="font-display text-3xl font-extrabold tracking-[-0.05em] text-red">{processSteps[active].title}</div>
              </div>
            </div>
          </div>
        </div>

        {/* steps */}
        <div data-steps className="relative">
          <div aria-hidden className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-line sm:left-[1.45rem]">
            <div ref={line} className="h-full origin-top bg-red shadow-[0_0_14px_rgba(255,36,24,.8)]" style={{ transform: "scaleY(0)" }} />
          </div>
          {processSteps.map((s, i) => (
            <div key={s.n} data-step className="relative flex min-h-[62vh] items-center pl-12 sm:pl-16">
              <span
                className={`absolute left-[0.45rem] top-1/2 grid h-[1.5rem] w-[1.5rem] -translate-y-1/2 place-items-center rounded-full border-2 bg-bg transition-all duration-500 sm:left-[0.7rem] ${
                  i <= active ? "border-red" : "border-line"
                }`}
              >
                <span className={`h-2 w-2 rounded-full transition-colors ${i <= active ? "bg-red" : "bg-transparent"}`} />
              </span>
              <div data-spot className="card relative w-full overflow-hidden p-7 sm:p-9">
                <div data-hexbig aria-hidden className="absolute -right-10 -top-10 text-red/25">
                  <HexOutline size={220} />
                </div>
                <div className="mono text-xs uppercase tracking-[0.18em] text-red">Step {s.n}</div>
                <h3 className="font-display tight mt-4 text-[clamp(2.4rem,5vw,4.4rem)] font-extrabold">{s.title}</h3>
                <p className="ar mt-1 text-lg font-semibold text-fg/80">{s.ar}</p>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted">{s.line}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.out.map((o) => (
                    <span key={o} className="chip !normal-case !tracking-normal">{o}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
