"use client";

import { useRef } from "react";
import { Boxes, Layers, MessagesSquare, Rocket } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Button, Counter, Fade, Label, WordScrub } from "@/components/ui";
import { stats } from "@/data/site";

const points = [
  { icon: Layers, title: "Studio craft", text: "Motion, type and layout held to an awards-level bar." },
  { icon: Boxes, title: "Engineered end to end", text: "Typed from database schema to the last pixel." },
  { icon: MessagesSquare, title: "Direct line", text: "You talk to the people who actually build it." },
  { icon: Rocket, title: "Ship and stay", text: "We launch it, then keep it healthy." },
];

export function About({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to("[data-about-img]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to("[data-about-sun]", {
        scale: 1.5,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-2 sm:px-3">
      <div className="inv relative overflow-hidden rounded-[1.6rem] sm:rounded-[2.4rem]">
        <div className="wrap relative py-20 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            {/* portrait */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                <div
                  data-about-sun
                  className="absolute right-[8%] top-[10%] h-[34%] w-[34%] rounded-full bg-red blur-3xl opacity-60"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-about-img
                  src="/work/phantom-figure.webp"
                  alt="A masked phantom in a black cloak under a red moon"
                  loading="lazy"
                  className="absolute inset-0 h-[118%] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
                  <span className="jp text-4xl">幻影</span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-80">
                    Phantoms / 01
                  </span>
                </div>
              </div>
              <div className="absolute -right-3 top-8 grid h-20 w-20 rotate-6 place-items-center rounded-md bg-red text-white shadow-xl">
                <span className="jp vertical text-lg leading-none">影の者</span>
              </div>
            </div>

            {/* copy */}
            <div className="order-1 lg:order-2">
              <Label>Who we are · 我々</Label>
              <WordScrub className="font-display mt-6 text-[clamp(1.9rem,4.3vw,4.1rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
                We are Phantoms — a team of engineers, designers and researchers who build{" "}
                <span className="serif-i text-red">websites, apps and SaaS</span> with the discipline of a
                studio and the speed of a startup. We stay out of the spotlight so your product can step
                into it.
              </WordScrub>
              <Fade delay={0.1}>
                <p className="ar muted mt-6 text-xl font-medium">
                  فريق من الإسكندرية بيحوّل الأفكار لمنتجات حقيقية — من أول سطر كود لحد الإطلاق.
                </p>
              </Fade>

              <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {points.map((p, i) => (
                  <Fade key={p.title} delay={i * 0.07} y={24} className="flex gap-4">
                    <p.icon className="mt-1 shrink-0 text-red" size={22} strokeWidth={1.8} />
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-tight">{p.title}</h3>
                      <p className="muted mt-1 text-sm leading-relaxed">{p.text}</p>
                    </div>
                  </Fade>
                ))}
              </div>

              {!compact && (
                <Fade className="mt-12">
                  <Button href="/team" variant="light" className="!bg-[var(--inv-fg)] !text-[var(--inv-bg)] [&_.btn-icon]:!bg-red [&_.btn-icon]:!text-white">
                    About the studio
                  </Button>
                </Fade>
              )}
            </div>
          </div>

          {/* numbers */}
          <div className="mt-20 sm:mt-28">
            <Label>By the numbers · 数字</Label>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-[clamp(3.2rem,7vw,6.5rem)] font-extrabold leading-none tracking-[-0.05em]">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="dotted mt-4 pb-3 text-sm font-bold">{s.label}</div>
                  <p className="muted mt-3 max-w-[22ch] text-xs leading-relaxed">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
