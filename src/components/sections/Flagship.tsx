"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SwarmScene } from "@/components/three/lazy";
import { RafiqFace } from "@/components/sections/RafiqFace";
import { Button, Label } from "@/components/ui";
import { TLink } from "@/components/layout/PageTransition";
import { site } from "@/data/site";

export function Flagship() {
  const root = useRef<HTMLElement>(null);
  const panelB = useRef<HTMLDivElement>(null);
  const panelA = useRef<HTMLDivElement>(null);
  const prog = useRef(0);
  const formation = useRef<HTMLSpanElement>(null);
  const units = useRef<HTMLSpanElement>(null);

  const setFormation = (v: number) => {
    if (formation.current) formation.current.textContent = v < 0.3 ? "SCATTER" : v < 0.75 ? "WAVE" : "SPHERE";
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(panelB.current, { clipPath: "inset(100% 0% 0% 0% round 2rem)" });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=240%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
        });
        tl.to("[data-fa]", { y: -30, duration: 1 }, 0)
          .to(panelB.current, { clipPath: "inset(0% 0% 0% 0% round 0rem)", duration: 1.1, ease: "power3.inOut" }, 0.9)
          .to(panelA.current, { scale: 0.93, opacity: 0.4, duration: 1.1 }, 0.9)
          .fromTo("[data-fb]", { y: 70, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: "power3.out" }, 1.6)
          .to(
            prog,
            {
              current: 1,
              duration: 1.7,
              onUpdate: () => setFormation(prog.current),
            },
            1.2,
          )
          .to({}, { duration: 0.5 });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.to(prog, {
          current: 1,
          ease: "none",
          scrollTrigger: {
            trigger: panelB.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: true,
            onUpdate: (s) => setFormation(s.progress),
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-bg" id="flagship">
      <div className="lg:relative lg:h-[100svh] lg:overflow-hidden lg:p-3">
        {/* ───────── Panel A — RAFIQ ───────── */}
        <div
          ref={panelA}
          className="relative mx-2 overflow-hidden rounded-[1.6rem] bg-[#eef2ff] text-[#0b1020] lg:absolute lg:inset-3 lg:mx-0 lg:rounded-[2rem]"
          style={{ backgroundImage: "radial-gradient(70% 60% at 80% 40%, #dbe6ff 0%, transparent 70%), radial-gradient(50% 50% at 10% 90%, #ffe9d5 0%, transparent 70%)" }}
        >
          <div className="grid-lines absolute inset-0 opacity-50 [--line:rgba(11,16,32,.08)]" aria-hidden />
          <div className="wrap relative grid h-full items-center gap-10 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-0">
            <div data-fa>
              <div className="flex items-center gap-3">
                <span className="label !text-[#0b1020]/60">Flagship 01</span>
                <span className="jp text-sm text-[#2563eb]">相棒</span>
              </div>
              <h2 className="font-display tight mt-6 text-[clamp(3.4rem,9vw,8.5rem)] font-extrabold">
                RAFIQ<span className="text-[#2563eb]">.</span>
              </h2>
              <p className="font-display mt-4 max-w-[16ch] text-[clamp(1.6rem,3.2vw,3rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                A companion that{" "}
                <span className="serif-i text-[#2563eb]">remembers</span>, so you can just live.
              </p>
              <p className="ar mt-4 text-xl font-medium text-[#0b1020]/70">رفيقك اللي بيفتكر معاك، ويطمن أهلك عليك.</p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#0b1020]/65">
                A local-first Arabic AI companion for memory support, daily routines and a closer circle of
                care — patient, honest and useful even offline. Our health-tech graduation project.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={site.rafiqUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="btn !bg-[#0b1020] !text-white"
                >
                  <span>Visit RAFIQ</span>
                  <span className="btn-icon !bg-[#2563eb] !text-white">
                    <ArrowUpRight size={16} strokeWidth={2.4} />
                  </span>
                </a>
                <TLink
                  href="/flagship/rafiq"
                  className="btn border border-[#0b1020]/20 !text-[#0b1020]"
                  data-cursor="STORY"
                >
                  <span>Case study</span>
                  <span className="btn-icon !bg-[#0b1020] !text-white">
                    <ArrowUpRight size={16} strokeWidth={2.4} />
                  </span>
                </TLink>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-[#0b1020]/60">
                {["Local-first", "Arabic first", "Offline capable", "Caregiver app"].map((t) => (
                  <li key={t} className="rounded-full border border-[#0b1020]/15 px-3 py-1.5">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div data-fa className="pb-4 lg:pb-0">
              <RafiqFace />
            </div>
          </div>
        </div>

        {/* ───────── Panel B — OMNI ───────── */}
        <div
          ref={panelB}
          className="relative mx-2 mt-3 min-h-[44rem] overflow-hidden rounded-[1.6rem] bg-[#050506] text-white lg:absolute lg:inset-3 lg:mx-0 lg:mt-0 lg:min-h-0 lg:rounded-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/work/omni-swarm.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          <SwarmScene progress={prog} />
          <div className="jp pointer-events-none absolute -right-[2%] -top-[6%] select-none text-[min(55vw,34rem)] leading-none text-white/[0.04]">
            群
          </div>

          <div className="wrap relative flex h-full min-h-[44rem] flex-col justify-between py-20 lg:min-h-0 lg:py-14">
            <div data-fb className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="label !text-white/70">Flagship 02</span>
                <span className="jp text-sm text-red">群</span>
              </div>
              <span className="hidden rounded-full border border-white/15 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/70 sm:block">
                In development
              </span>
            </div>

            <div>
              <h2 data-fb className="font-display tight text-[clamp(4rem,13vw,13rem)] font-extrabold">
                OMNI<span className="text-red">.</span>
              </h2>
              <p data-fb className="font-display mt-2 max-w-[18ch] text-[clamp(1.6rem,3.4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
                A swarm that thinks as <span className="serif-i text-red">one</span>.
              </p>
              <p data-fb className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
                Microbots inspired by Big Hero 6 — thousands of small units, one control layer. Simulated
                live in the browser while the hardware takes shape.
              </p>
              <div data-fb className="mt-8 flex flex-wrap items-center gap-3">
                <Button href="/flagship/omni" variant="red" cursor="ENTER">
                  Explore OMNI
                </Button>
                <div className="glass flex items-center gap-4 rounded-full px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.16em]">
                  <span className="text-white/50">Formation</span>
                  <span ref={formation} className="w-16 text-red">SCATTER</span>
                  <span className="text-white/50">Units</span>
                  <span ref={units}>2,200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
