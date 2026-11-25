"use client";

import { useRef, useState } from "react";
import { Counter, Label, Reveal } from "@/components/ui";
import { Logo } from "@/components/ui/Brand";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const ideas = [
  { id: "mask", number: "01", name: "Mask", line: "We work in the shadows: focused, quiet, no noise." },
  { id: "red", number: "02", name: "Red", line: "The energy of shipping. Every launch leaves a mark." },
  { id: "hex", number: "03", name: "Hex", line: "Six tracks locked into one structure, strong like a honeycomb." },
] as const;

const swatches = [
  ["Phantom Red", "#FF2418", "the spark"],
  ["Night Ink", "#08080A", "the quiet"],
  ["Paper White", "#F3F0EA", "the signal"],
];

export function TheMark() {
  const root = useRef<HTMLElement>(null);
  const hexPath = useRef<SVGPathElement>(null);
  const [active, setActive] = useState<(typeof ideas)[number]["id"] | null>(null);

  useGSAP(
    () => {
      const path = hexPath.current;
      if (path && !prefersReducedMotion()) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 74%", once: true },
        });
      }
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-mark-reveal]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="mark" data-section="Mark" className="grain-s relative overflow-hidden sec-pad">
      <div aria-hidden className="aura left-[16%] top-[18%] h-[28rem] w-[28rem] opacity-25" />
      <div className="wrap relative">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <Label>02 — The mark</Label>
            <Reveal as="h2" className="font-display tight mt-7 max-w-[10ch] text-[clamp(3.4rem,8vw,8rem)] font-extrabold">
              Three ideas. <span className="serif-i text-red glow-text">One mark.</span>
            </Reveal>
          </div>
          <p data-mark-reveal className="max-w-sm text-sm leading-relaxed text-muted md:pb-2">
            The phantom mask is not decoration. It is a compact reminder of how the team shows up: calm in the work, vivid in the result, connected by one system.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div data-mark-reveal className="relative flex min-h-[24rem] items-center justify-center overflow-hidden rounded-[2rem] border border-line bg-card p-8 sm:min-h-[34rem] sm:p-12">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,36,24,.2),transparent_44%)]" />
            <svg aria-hidden viewBox="0 0 200 200" className="absolute h-[94%] w-[94%] text-red/60">
              <path ref={hexPath} d="M100 8 L180 54 L180 146 L100 192 L20 146 L20 54 Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <path d="M100 22 L166 60 L166 140 L100 178 L34 140 L34 60 Z" fill="none" stroke="currentColor" strokeOpacity=".16" strokeWidth=".7" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <div
              className={`relative transition duration-700 ${active ? "scale-[1.06]" : "scale-100"}`}
              style={{ filter: active === "red" ? "drop-shadow(0 0 34px rgba(255,36,24,.9))" : active === "mask" ? "drop-shadow(0 0 28px rgba(255,255,255,.3))" : active === "hex" ? "drop-shadow(0 0 42px rgba(255,36,24,.65))" : "drop-shadow(0 0 20px rgba(255,36,24,.36))" }}
            >
              <Logo size={260} className="sm:[&>span>img]:scale-110" />
            </div>
            <span className="mono absolute bottom-6 left-6 text-[0.62rem] uppercase tracking-[0.18em] text-muted">PH / identity / 01</span>
            <span className="mono absolute right-6 top-6 text-[0.62rem] text-red">{active ? active.toUpperCase() : "LIVE"}</span>
          </div>

          <div className="space-y-3">
            {ideas.map((idea) => {
              const selected = active === idea.id;
              return (
                <button
                  key={idea.id}
                  type="button"
                  aria-pressed={selected}
                  data-mark-reveal
                  onMouseEnter={() => setActive(idea.id)}
                  onFocus={() => setActive(idea.id)}
                  onMouseLeave={() => setActive(null)}
                  onBlur={() => setActive(null)}
                  className={`group relative w-full rounded-[1.4rem] border p-6 text-left transition duration-500 sm:p-8 ${selected ? "border-red bg-red/10 shadow-[0_0_44px_-18px_rgba(255,36,24,.9)]" : "border-line bg-surface/35 hover:border-red/50"}`}
                >
                  <span className={`mono text-[0.68rem] transition ${selected ? "text-red" : "text-muted"}`}>{idea.number}</span>
                  <div className="mt-6 flex items-start justify-between gap-5">
                    <h3 className={`font-display text-[clamp(2rem,4vw,4.1rem)] font-extrabold leading-[.88] tracking-[-0.07em] transition ${selected ? "text-red glow-text" : "text-fg"}`}>{idea.name}</h3>
                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full transition ${selected ? "glow-dot" : "border border-line-strong"}`} />
                  </div>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">{idea.line}</p>
                  <span aria-hidden className={`absolute bottom-0 left-7 h-px bg-red shadow-[0_0_15px_1px_rgba(255,36,24,.9)] transition-all duration-700 ${selected ? "w-[calc(100%-3.5rem)]" : "w-0"}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div data-mark-reveal className="mt-16 grid gap-4 border-t border-line pt-7 sm:mt-24 sm:grid-cols-[1fr_1.5fr] sm:pt-9">
          <div>
            <Label>Colour / type / rhythm</Label>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">A small system with enough contrast to carry a product from first sketch to public launch.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {swatches.map(([name, value, note]) => (
              <div key={name} className="rounded-[1.2rem] border border-line bg-card p-4">
                <div className="h-16 rounded-[0.9rem] ring-1 ring-inset ring-black/10" style={{ background: value }} />
                <div className="mt-4 font-display text-sm font-bold">{name}</div>
                <div className="mono mt-1 text-[0.62rem] text-red">{value}</div>
                <div className="mt-2 text-xs text-muted">{note}</div>
              </div>
            ))}
          </div>
        </div>

        <div data-mark-reveal className="mt-12 grid gap-8 rounded-[1.8rem] border border-line bg-card p-6 sm:grid-cols-[.8fr_1.2fr] sm:p-8">
          <div>
            <Label>Type specimens</Label>
            <div className="mt-7 space-y-2">
              <div className="font-display text-3xl font-bold tracking-[-0.05em]">Bricolage Grotesque</div>
              <div className="font-sub text-sm uppercase tracking-[0.12em] text-muted">Montserrat / interface voice</div>
              <div className="ar text-2xl font-semibold">IBM Plex Sans Arabic</div>
              <div className="serif-i text-4xl text-red">Instrument Serif, in motion.</div>
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-7 border-t border-line pt-7 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
            {[
              [35, "members"],
              [12, "projects"],
              [6, "tracks"],
            ].map(([to, label]) => (
              <div key={label}>
                <div className="font-display text-5xl font-extrabold leading-none tracking-[-0.07em]"><Counter to={to as number} suffix={label === "projects" ? "+" : ""} /></div>
                <div className="mono mt-2 text-[0.65rem] uppercase tracking-[0.16em] text-muted">{label}</div>
              </div>
            ))}
            <p className="max-w-[14rem] text-sm leading-relaxed text-muted">One identity, carried consistently by the whole team.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
