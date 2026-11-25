"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useReady } from "@/lib/ready";
import { HeroScene } from "@/components/three/lazy";
import { Button } from "@/components/ui";
import { site } from "@/data/site";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = useReady();

  // pre-hide
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set("[data-h-line]", { yPercent: 118 });
      gsap.set("[data-h-fade]", { opacity: 0, y: 24 });
      gsap.set("[data-h-chip]", { opacity: 0, scale: 0.8 });
    },
    { scope: root },
  );

  // entrance — after preloader
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) {
        if (ready) gsap.set(["[data-h-line]", "[data-h-fade]", "[data-h-chip]"], { clearProps: "all" });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to("[data-h-line]", { yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.1)
        .to("[data-h-fade]", { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.5)
        .to("[data-h-chip]", { opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, ease: "back.out(1.6)" }, 0.9);

      // chips float
      gsap.utils.toArray<HTMLElement>("[data-h-chip]").forEach((c, i) => {
        gsap.to(c, {
          y: i % 2 ? 12 : -12,
          x: i % 2 ? -6 : 6,
          duration: 3 + i,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: root, dependencies: [ready] },
  );

  // scroll parallax
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to("[data-h-content]", {
        yPercent: -14,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-h-kanji]", {
        yPercent: 40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  const Line = ({ children }: { children: React.ReactNode }) => (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <span data-h-line className="block will-change-transform">
        {children}
      </span>
    </span>
  );

  return (
    <section ref={root} className="relative p-2 sm:p-3">
      <div className="grain relative isolate flex min-h-[calc(100svh-1rem)] flex-col justify-between overflow-hidden rounded-[1.6rem] bg-[#060607] text-white sm:rounded-[2.2rem]">
        {/* backdrop */}
        <div className="grid-lines absolute inset-0 -z-10 opacity-40" aria-hidden />
        <div
          aria-hidden
          className="absolute -right-[10%] top-[8%] -z-10 h-[70vmin] w-[70vmin] rounded-full opacity-50 blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(255,36,24,.5), transparent 65%)" }}
        />
        <HeroScene className="-z-[5]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[4]"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,6,7,.88) 0%, rgba(6,6,7,.45) 42%, transparent 70%), linear-gradient(0deg, rgba(6,6,7,.8) 0%, transparent 38%)",
          }}
        />

        {/* vertical JP */}
        <div
          data-h-kanji
          aria-hidden
          className="jp vertical pointer-events-none absolute right-[3.5%] top-[14%] hidden select-none text-[clamp(5rem,12vw,11rem)] font-bold leading-[0.95] text-white/90 lg:block"
        >
          <span data-h-fade>幻影</span>
        </div>
        <div
          data-h-fade
          className="jp vertical absolute right-[1.2%] top-[15%] hidden text-[0.7rem] tracking-[0.5em] text-white/50 lg:block"
        >
          ファントムズ
        </div>

        {/* floating chips */}
        <div
          data-h-chip
          className="glass absolute right-[30%] top-[22%] hidden items-center gap-3 rounded-2xl px-4 py-3 text-xs lg:flex"
        >
          <span className="pulse-dot h-2 w-2 rounded-full bg-red" />
          <div>
            <div className="font-semibold">RAFIQ</div>
            <div className="text-white/50">Local-first AI companion</div>
          </div>
        </div>
        <div
          data-h-chip
          className="glass absolute bottom-[26%] right-[8%] hidden items-center gap-3 rounded-2xl px-4 py-3 text-xs xl:flex"
        >
          <span className="jp text-lg text-red">群</span>
          <div>
            <div className="font-semibold">OMNI</div>
            <div className="text-white/50">Swarm · in development</div>
          </div>
        </div>

        {/* content */}
        <div data-h-content className="wrap relative flex flex-1 flex-col justify-between pb-6 pt-28 sm:pb-9 sm:pt-32">
          <div data-h-fade className="flex items-center gap-4">
            <span className="label !text-white/70">Product team · Alexandria · 2026</span>
          </div>

          <h1
            className="font-display tight mt-8 max-w-[15ch] text-[clamp(3.3rem,10.2vw,10.4rem)] font-extrabold"
            aria-label="Built in the shadows. Felt everywhere."
          >
            <Line>Built in the</Line>
            <Line>shadows.</Line>
            <Line>
              <span className="text-white/60">Felt</span>{" "}
              <span className="serif-i pr-[0.08em] text-red" style={{ letterSpacing: "-0.03em" }}>
                everywhere.
              </span>
            </Line>
          </h1>

          <div className="mt-10 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-xl">
              <p data-h-fade className="text-base leading-relaxed text-white/75 sm:text-lg">
                We design, build and ship <b className="text-white">websites, apps and SaaS</b> — and two
                flagship products of our own, RAFIQ and OMNI.
              </p>
              <p data-h-fade className="ar mt-3 text-xl font-medium text-white/90">
                عندك فكرة؟ خلينا نبنيها.
              </p>
              <div data-h-fade className="mt-7 flex flex-wrap items-center gap-3">
                <Button href="/contact" variant="red" cursor="START">
                  Start a project
                </Button>
                <Button href="/work" variant="ghost" className="!text-white [&_.btn-icon]:!bg-white [&_.btn-icon]:!text-black">
                  View work
                </Button>
              </div>
            </div>

            <div data-h-fade className="flex items-end justify-between gap-10 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/60 lg:flex-col lg:items-end lg:gap-6">
              <ul className="space-y-2 lg:text-right">
                <li>+ Web</li>
                <li>+ Apps</li>
                <li>+ SaaS</li>
              </ul>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline">{site.coords}</span>
                <span className="relative block h-12 w-px overflow-hidden bg-white/20">
                  <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-red" />
                </span>
                <span>Scroll</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
