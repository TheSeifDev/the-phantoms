"use client";

import { useRef } from "react";
import { Label, Reveal } from "@/components/ui";
import { Logo } from "@/components/ui/Brand";
import { HexOutline } from "@/components/ui/Hex";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const notes = [
  ["A", "A face, not a facade", "The mask keeps the team slightly out of frame. The product, the people using it and the result come first."],
  ["B", "A flash of red", "Red is the moment an idea stops being theoretical. It is action, not decoration — a pulse through the whole system."],
  ["C", "A structure that holds", "The hexagon is a frame for many tracks working as one: sturdy, repeatable and made to connect."],
] as const;

export function AboutMarkBook() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-book-reveal]",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 78%", once: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="mark-book" data-section="Brand book" className="inv relative overflow-hidden py-24 sm:py-36">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-8 border-b border-[var(--inv-line)] pb-8 sm:flex-row sm:items-end">
          <div>
            <Label>Identity / 01</Label>
            <Reveal as="h2" className="font-display tight mt-6 max-w-[10ch] text-[clamp(3rem,7vw,7.4rem)] font-extrabold">The mark is a <span className="serif-i text-red">signal.</span></Reveal>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--inv-muted)]">A brand-book reading of the mask: three visual decisions, one continuous attitude.</p>
        </div>

        <div className="mt-14 grid gap-0 overflow-hidden rounded-[2rem] border border-[var(--inv-line)] sm:grid-cols-[1.1fr_.9fr]">
          <div data-book-reveal className="relative flex min-h-[27rem] items-center justify-center overflow-hidden bg-[#0a0a0c] p-10 text-white sm:min-h-[42rem] sm:p-16">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,36,24,.28),transparent_42%)]" />
            <div aria-hidden className="absolute inset-[9%] rounded-[1.5rem] border border-white/10" />
            <HexOutline size={420} className="absolute text-white/25" width={0.8} />
            <div className="relative drop-shadow-[0_0_30px_rgba(255,36,24,.5)]"><Logo size={250} /></div>
            <span className="mono absolute bottom-7 left-7 text-[0.62rem] uppercase tracking-[0.18em] text-white/50">Phantoms / mask / master</span>
            <span className="mono absolute right-7 top-7 text-[0.62rem] text-red">01—03</span>
          </div>
          <div className="bg-[var(--inv-bg)] p-7 sm:p-12">
            <div data-book-reveal className="mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--inv-muted)]">Read the shape</div>
            <div className="mt-8 divide-y divide-[var(--inv-line)]">
              {notes.map(([letter, title, line]) => (
                <div key={letter} data-book-reveal className="py-7 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-4xl font-extrabold tracking-[-0.06em] text-red">{letter}</span>
                    <span className="mono pt-2 text-[0.6rem] text-[var(--inv-muted)]">0{notes.findIndex((item) => item[0] === letter) + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold leading-none tracking-[-0.045em]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--inv-muted)]">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div data-book-reveal className="mt-8 grid gap-4 sm:grid-cols-3">
          {[["#FF2418", "Energy", "A mark that moves."], ["#08080A", "Depth", "A place for focused work."], ["#F3F0EA", "Clarity", "A signal you can read."]].map(([color, title, line]) => (
            <div key={title} className="border-t border-[var(--inv-line)] pt-5">
              <div className="flex items-center gap-3"><span className="h-5 w-5 rounded-full" style={{ background: color }} /><span className="mono text-[0.62rem] text-[var(--inv-muted)]">{color}</span></div>
              <div className="mt-5 font-display text-xl font-bold tracking-[-0.04em]">{title}</div>
              <p className="mt-2 text-sm text-[var(--inv-muted)]">{line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
