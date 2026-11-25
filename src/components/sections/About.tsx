"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Counter, Label, WordScrub } from "@/components/ui";
import { HexAvatar, HexOutline } from "@/components/ui/Hex";
import { FooterClock } from "@/components/layout/FooterBits";
import { marqueeTech } from "@/data/site";

export function About({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-bento] > *", {
        opacity: 0,
        y: 60,
        scale: 0.94,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-bento]", start: "top 82%", once: true },
      });
      gsap.to("[data-hexfloat]", {
        y: -120,
        rotate: 40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" data-section="About" className="relative overflow-hidden sec-pad">
      <div data-hexfloat aria-hidden className="pointer-events-none absolute -left-16 top-24 text-red/60">
        <HexOutline size={170} />
      </div>
      <div className="wrap relative">
        {!compact && (
          <div className="max-w-5xl">
            <Label>Who we are</Label>
            <WordScrub className="font-display tight mt-8 text-[clamp(2rem,5vw,4.6rem)] font-bold [line-height:1.02]">
              Phantoms is a product team that designs, engineers and ships — websites, apps and SaaS that people actually enjoy using.
            </WordScrub>
          </div>
        )}

        <div data-bento className={`grid gap-3 md:grid-cols-6 ${compact ? "" : "mt-16"}`}>
          {/* members */}
          <div data-spot data-tilt="2.5" className="card relative overflow-hidden bg-red !border-transparent p-7 text-white md:col-span-3 md:row-span-2 md:min-h-[26rem]">
            <div aria-hidden className="absolute -right-10 -top-10 text-white/20">
              <HexOutline size={330} width={1.2} />
            </div>
            <div aria-hidden className="absolute -bottom-16 right-10 text-white/10">
              <HexOutline size={200} width={1.2} />
            </div>
            <div className="relative flex h-full flex-col justify-between">
              <span className="mono text-[0.7rem] uppercase tracking-[0.16em] opacity-80">The team</span>
              <div>
                <div className="font-display text-[clamp(6rem,15vw,12rem)] font-extrabold leading-[0.8] tracking-[-0.08em]">
                  <Counter to={25} />
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="max-w-[16rem] text-[0.95rem] font-medium leading-snug opacity-90">
                    Engineers, designers and researchers working in six focused squads.
                  </p>
                  <div className="flex -space-x-3">
                    {["SA", "AE", "P3", "P4", "P5"].map((n, i) => (
                      <HexAvatar key={n} name={n} size={44} tone={i % 2 ? "dark" : "light"} className="ring-2 ring-red" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* clock */}
          <div data-spot className="card flex flex-col justify-between p-7 md:col-span-3">
            <div className="flex items-center justify-between">
              <span className="label">Based in</span>
              <span className="mono flex items-center gap-2 text-[0.68rem] text-muted">
                <span className="pulse-dot h-2 w-2 rounded-full bg-[#2bd96b]" /> online
              </span>
            </div>
            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <div className="font-display text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">Alexandria</div>
                <div className="mono mt-1 text-xs text-muted">31.2001° N · 29.9187° E</div>
              </div>
              <FooterClock />
            </div>
          </div>

          {/* numbers */}
          <div className="grid grid-cols-2 gap-3 md:col-span-3">
            {[
              { to: 12, s: "+", l: "Projects shipped" },
              { to: 2, s: "", l: "Flagship products" },
            ].map((s) => (
              <div key={s.l} data-spot className="card flex flex-col justify-between p-6">
                <div className="font-display text-[clamp(3.2rem,5.4vw,5rem)] font-extrabold leading-none tracking-[-0.07em]">
                  <Counter to={s.to} suffix={s.s} />
                </div>
                <div className="mt-6 text-sm text-muted">{s.l}</div>
              </div>
            ))}
          </div>

          {/* stack */}
          <div data-spot className="card p-7 md:col-span-3">
            <span className="label">Stack we ship with</span>
            <div className="mt-6 flex flex-wrap gap-2">
              {marqueeTech.slice(0, 14).map((t) => (
                <span key={t} className="chip !normal-case !tracking-normal text-fg/80">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* languages */}
          <div data-spot className="card relative overflow-hidden p-7 md:col-span-3">
            <span className="label">Two languages, one team</span>
            <div className="mt-6 flex items-end justify-between gap-6">
              <div className="font-display text-5xl font-extrabold tracking-[-0.06em]">EN</div>
              <div className="h-px flex-1 bg-line" />
              <div className="ar text-5xl font-bold">عربي</div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Interfaces in English, Arabic or both — real RTL, proper Arabic typography, and Egyptian-dialect aware AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
