"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, CloudOff, ExternalLink, Mic, Radio } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TLink } from "@/components/layout/PageTransition";
import { Fade, Label, Reveal } from "@/components/ui";
import { CloudFace, SwarmScene } from "@/components/three/lazy";
import type { FaceState } from "@/components/three/CloudFace";

const products = {
  rafiq: {
    name: "RAFIQ",
    pitch: "A calm, local-first Arabic companion that remembers so people can just live.",
    status: "Live prototype",
    metrics: ["01 / Offline-first", "02 / Arabic voice", "03 / Caregiver loop"],
    href: "/flagship/rafiq",
  },
  omni: {
    name: "OMNI",
    pitch: "Microbots that think as one swarm — simulated in the browser, built for hardware.",
    status: "In development",
    metrics: ["01 / ESP32", "02 / MQTT control", "03 / Formation engine"],
    href: "/flagship/omni",
  },
};

export function Flagship() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const omniWorld = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [face, setFace] = useState<FaceState>("idle");

  useGSAP(
    () => {
      const overlay = omniWorld.current;
      if (!overlay || !stage.current || prefersReducedMotion()) {
        progress.current = 0.82;
        if (overlay) overlay.style.clipPath = "circle(100% at 72% 44%)";
        return;
      }

      const updateWipe = () => {
        const p = gsap.utils.clamp(0, 1, progress.current);
        const eased = p * p * (3 - 2 * p);
        const radius = 5 + eased * 150;
        overlay.style.clipPath = `circle(${radius}% at 72% 43%)`;
      };

      gsap.fromTo(
        "[data-mobile-product]",
        { opacity: 0, y: 42 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: root.current, start: "top 80%", once: true } },
      );

      const tween = gsap.to(progress, {
        current: 1,
        ease: "none",
        onUpdate: updateWipe,
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
        },
      });
      updateWipe();
      return () => tween.kill();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="flagship" data-section="Flagships" className="relative overflow-x-clip pb-10 pt-10 sm:pb-16">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 pb-8 md:flex-row md:items-end md:pb-10">
          <div>
            <Label>06 — Featured products</Label>
            <Reveal as="h2" className="font-display tight mt-6 max-w-[10ch] text-[clamp(3rem,7vw,7rem)] font-extrabold">
              Built to feel <span className="serif-i text-red glow-red">inevitable.</span>
            </Reveal>
          </div>
          <Fade className="max-w-sm text-[0.92rem] leading-relaxed text-muted">
            Scroll through the two products that define our point of view: gentle intelligence first, collective intelligence next.
          </Fade>
        </div>
      </div>

      <div ref={stage} className="relative h-auto md:h-[230svh]">
        <div className="relative overflow-hidden py-4 md:sticky md:top-0 md:h-[100svh] md:min-h-0 md:max-h-[100svh] md:pt-24 md:pb-4">
          <div className="wrap flex h-full items-center">
            <div className="relative hidden h-[min(76svh,47rem)] min-h-[38rem] w-full overflow-hidden rounded-[2.4rem] border border-[#d9e4fb] bg-[#fbfcff] shadow-[0_35px_100px_-55px_rgba(27,84,255,.45)] md:block md:min-h-0">
              <div className="absolute inset-0 bg-[radial-gradient(55%_75%_at_82%_26%,#e9f0ff_0%,transparent_72%)]" />
              <div className="absolute -left-24 bottom-[-22%] h-72 w-72 rounded-full bg-[#dce8ff] blur-3xl" />

              <div className="relative z-10 flex h-full flex-col justify-between p-5 text-[#0b1230] sm:p-8 lg:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="mono rounded-full border border-[#0b1230]/15 bg-white/70 px-3 py-1.5 text-[0.61rem] font-bold uppercase tracking-[0.15em]">01 / 02</span>
                    <span className="rounded-full bg-[#2bd96b]/15 px-3 py-1.5 text-[0.61rem] font-bold text-[#137842]">{products.rafiq.status}</span>
                  </div>
                  <span className="mono hidden text-[0.62rem] uppercase tracking-[0.16em] text-[#0b1230]/45 sm:block">Featured product / scroll morph</span>
                </div>

                <div className="max-w-[31rem]">
                  <div className="mb-4 flex items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#1b54ff]"><Mic size={13} /> RAFIQ / local intelligence</div>
                  <h3 className="font-display tight text-[clamp(4.4rem,12vw,10rem)] font-extrabold tracking-[-0.08em]">{products.rafiq.name}<span className="text-[#1b54ff]">.</span></h3>
                  <p className="mt-4 max-w-[27rem] text-[clamp(0.95rem,1.6vw,1.18rem)] font-medium leading-relaxed text-[#0b1230]/70">{products.rafiq.pitch}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {products.rafiq.metrics.map((item) => <span key={item} className="rounded-full border border-[#0b1230]/12 bg-white/65 px-3 py-2 text-[0.62rem] font-bold">{item}</span>)}
                  </div>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <TLink href={products.rafiq.href} className="group inline-flex items-center gap-2 text-sm font-bold text-[#0b1230] underline decoration-[#1b54ff]/45 underline-offset-4" data-cursor="CASE STUDY">
                      Read the case study <ArrowUpRight size={16} className="text-[#1b54ff] transition-transform duration-500 group-hover:rotate-45" />
                    </TLink>
                    <a href="https://rafiq-tech.vercel.app" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b1230]/55 transition-colors hover:text-[#1b54ff]"><ExternalLink size={13} /> Open RAFIQ</a>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#0b1230]/50">
                  <span className="flex items-center gap-2"><CloudOff size={14} className="text-[#1b54ff]" /> Keeps working when the signal drops</span>
                  <span className="mono">01</span>
                </div>
              </div>
              <CloudFace state={face} className="absolute bottom-[-3%] right-[-7%] z-[2] h-[74%] w-[70%] opacity-95 sm:right-[-2%] sm:w-[59%]" />

              <div ref={omniWorld} className="absolute inset-0 z-[3] overflow-hidden bg-[#07070a] text-white" style={{ clipPath: "circle(5% at 72% 43%)" }}>
                <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_75%_35%,rgba(255,36,24,.24),transparent_70%)]" />
                <SwarmScene progress={progress} className="opacity-95" />
                <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-8 lg:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="mono rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.61rem] font-bold uppercase tracking-[0.15em]">02 / 02</span>
                      <span className="rounded-full bg-red/20 px-3 py-1.5 text-[0.61rem] font-bold text-red">{products.omni.status}</span>
                    </div>
                    <span className="mono hidden text-[0.62rem] uppercase tracking-[0.16em] text-white/45 sm:block">Formation / live simulation</span>
                  </div>

                  <div className="max-w-[31rem]">
                    <div className="mb-4 flex items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-red"><Radio size={13} /> OMNI / collective intelligence</div>
                    <h3 className="font-display tight text-[clamp(4.4rem,12vw,10rem)] font-extrabold tracking-[-0.08em]">{products.omni.name}<span className="text-red">.</span></h3>
                    <p className="mt-4 max-w-[27rem] text-[clamp(0.95rem,1.6vw,1.18rem)] font-medium leading-relaxed text-white/65">{products.omni.pitch}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {products.omni.metrics.map((item) => <span key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[0.62rem] font-bold text-white/85">{item}</span>)}
                    </div>
                    <div className="mt-7 flex flex-wrap items-center gap-4">
                      <TLink href={products.omni.href} className="group inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-red/70 underline-offset-4" data-cursor="CASE STUDY">
                        Read the case study <ArrowUpRight size={16} className="text-red transition-transform duration-500 group-hover:rotate-45" />
                      </TLink>
                      <span className="mono text-[0.62rem] uppercase tracking-[0.16em] text-white/40">ESP32 · MQTT · Three.js</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/45">
                    <span>Scroll to re-form the swarm</span>
                    <span className="mono text-red">02</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4 md:hidden">
              <article data-mobile-product className="relative min-h-[38rem] overflow-hidden rounded-[2.2rem] border border-[#d9e4fb] bg-[#fbfcff] p-5 text-[#0b1230] shadow-[0_28px_75px_-48px_rgba(27,84,255,.5)] sm:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(65%_60%_at_80%_22%,#e9f0ff_0%,transparent_72%)]" />
                <CloudFace state={face} className="absolute bottom-[-2%] right-[-12%] h-[58%] w-[76%] opacity-95" />
                <div className="relative z-10 flex min-h-[36rem] flex-col justify-between">
                  <div className="flex items-center justify-between gap-3"><span className="mono rounded-full border border-[#0b1230]/15 bg-white/70 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em]">01 / 02</span><span className="rounded-full bg-[#2bd96b]/15 px-3 py-1.5 text-[0.6rem] font-bold text-[#137842]">Live prototype</span></div>
                  <div><div className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[#1b54ff]"><Mic size={13} /> local intelligence</div><h3 className="font-display tight text-[clamp(4rem,18vw,6.8rem)] font-extrabold tracking-[-0.08em]">RAFIQ<span className="text-[#1b54ff]">.</span></h3><p className="mt-3 max-w-[18rem] text-sm font-medium leading-relaxed text-[#0b1230]/70">{products.rafiq.pitch}</p><div className="mt-5 flex flex-wrap gap-1.5">{products.rafiq.metrics.map((item) => <span key={item} className="rounded-full border border-[#0b1230]/12 bg-white/65 px-2.5 py-1.5 text-[0.57rem] font-bold">{item}</span>)}</div><TLink href={products.rafiq.href} className="group mt-6 inline-flex items-center gap-2 text-sm font-bold underline decoration-[#1b54ff]/50 underline-offset-4">Read the case study <ArrowUpRight size={15} className="text-[#1b54ff] transition-transform group-hover:rotate-45" /></TLink></div>
                  <span className="flex items-center gap-2 text-[0.59rem] font-bold uppercase tracking-[0.14em] text-[#0b1230]/45"><CloudOff size={14} className="text-[#1b54ff]" /> Gentle intelligence, offline</span>
                </div>
              </article>

              <article data-mobile-product className="relative min-h-[38rem] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#07070a] p-5 text-white shadow-[0_28px_75px_-48px_rgba(255,36,24,.52)] sm:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(70%_65%_at_68%_38%,rgba(255,36,24,.25),transparent_70%)]" /><SwarmScene progress={progress} className="opacity-90" />
                <div className="relative z-10 flex min-h-[36rem] flex-col justify-between">
                  <div className="flex items-center justify-between gap-3"><span className="mono rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em]">02 / 02</span><span className="rounded-full bg-red/20 px-3 py-1.5 text-[0.6rem] font-bold text-red">In development</span></div>
                  <div><div className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-red"><Radio size={13} /> collective intelligence</div><h3 className="font-display tight text-[clamp(4rem,18vw,6.8rem)] font-extrabold tracking-[-0.08em]">OMNI<span className="text-red">.</span></h3><p className="mt-3 max-w-[18rem] text-sm font-medium leading-relaxed text-white/65">{products.omni.pitch}</p><div className="mt-5 flex flex-wrap gap-1.5">{products.omni.metrics.map((item) => <span key={item} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 text-[0.57rem] font-bold text-white/85">{item}</span>)}</div><TLink href={products.omni.href} className="group mt-6 inline-flex items-center gap-2 text-sm font-bold underline decoration-red/70 underline-offset-4">Read the case study <ArrowUpRight size={15} className="text-red transition-transform group-hover:rotate-45" /></TLink></div>
                  <span className="flex items-center gap-2 text-[0.59rem] font-bold uppercase tracking-[0.14em] text-white/45"><Radio size={14} className="text-red" /> Scroll / re-form the swarm</span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap mt-5 flex items-center justify-between gap-4 text-[0.64rem] uppercase tracking-[0.16em] text-muted md:mt-0">
        <span className="mono">01 / 02</span>
        <span className="hidden h-px flex-1 bg-line sm:block" />
        <span>One studio. Two different kinds of intelligence.</span>
      </div>
    </section>
  );
}
