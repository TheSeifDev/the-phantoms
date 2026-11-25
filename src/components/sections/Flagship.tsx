"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, CloudOff, Mic } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TLink } from "@/components/layout/PageTransition";
import { Fade, Label, Reveal } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { CloudFace, SwarmScene } from "@/components/three/lazy";
import type { FaceState } from "@/components/three/CloudFace";

const FORMS = ["SCATTER", "WAVE", "SPHERE"];

export function Flagship() {
  const root = useRef<HTMLElement>(null);
  const prog = useRef(0);
  const label = useRef<HTMLSpanElement>(null);
  const [face, setFace] = useState<FaceState>("idle");

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        prog.current = 0.9;
        return;
      }
      // cards reveal as you scroll in
      gsap.fromTo(
        "[data-fcard]",
        { clipPath: "inset(14% 6% 10% 6% round 2.4rem)", y: 90, opacity: 0.4 },
        {
          clipPath: "inset(0% 0% 0% 0% round 2.4rem)",
          y: 0,
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-fwrap]", start: "top 95%", end: "top 45%", scrub: 0.6 },
        },
      );
      // swarm morph loop
      const tw = gsap.to(prog, {
        current: 1,
        duration: 5.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.6,
        onUpdate: () => {
          if (label.current) label.current.textContent = FORMS[Math.min(2, Math.floor(prog.current * 3))];
        },
      });
      return () => void tw.kill();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="flagship" data-section="Flagships" className="relative overflow-hidden pb-24 pt-8 sm:pb-32">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 pb-10 md:flex-row md:items-end">
          <div>
            <Label>Flagship products</Label>
            <Reveal as="h2" className="font-display tight mt-6 text-[clamp(2.4rem,5.6vw,5rem)] font-extrabold">
              Two products. <span className="serif-i text-red">One</span> standard.
            </Reveal>
          </div>
          <Fade className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
            Our graduation-grade builds — an AI companion that remembers, and a swarm that moves as one. Hover to open.
          </Fade>
        </div>

        <div data-fwrap className="flex flex-col gap-3 lg:h-[min(34rem,72vh)] lg:flex-row">
          {/* RAFIQ */}
          <TLink
            href="/flagship/rafiq"
            data-fcard
            data-cursor="RAFIQ"
            onPointerEnter={() => setFace("listening")}
            onPointerLeave={() => setFace("idle")}
            className="group relative flex min-h-[28rem] flex-1 overflow-hidden rounded-[2.4rem] text-[#0b1020] transition-[flex] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:min-h-0 lg:hover:flex-[1.55]"
            style={{ background: "radial-gradient(90% 80% at 70% 20%, #ffffff 0%, #e4edff 55%, #c9dbff 100%)" }}
          >
            <div aria-hidden className="absolute -right-10 -top-10 text-[#2563eb]/15">
              <HexOutline size={260} />
            </div>
            <CloudFace state={face} className="absolute inset-y-0 right-[-4%] w-[78%] sm:w-[70%] lg:right-[-2%]" />

            {/* floating UI around the face */}
            <div className="absolute right-[6%] top-[22%] hidden rounded-2xl rounded-bl-md bg-white/90 px-3.5 py-2.5 shadow-[0_18px_40px_-18px_rgba(37,99,235,.5)] backdrop-blur transition-transform duration-700 group-hover:-translate-y-2 sm:block">
              <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-wider text-[#2563eb]">
                <Mic size={11} /> RAFIQ
              </div>
              <p className="ar mt-1 text-[0.85rem] font-semibold leading-snug">معاد الدوا بتاعك دلوقتي.</p>
            </div>
            <div className="absolute right-[5%] top-[47%] hidden items-center gap-2 rounded-full bg-[#0b1020] px-3.5 py-2 text-[0.68rem] font-bold text-white shadow-xl transition-transform duration-700 group-hover:translate-y-1 sm:flex">
              <CloudOff size={12} className="text-[#7aa8ff]" /> Offline mode · on
            </div>

            <div className="relative z-10 flex w-full flex-col justify-between p-7 sm:p-9">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="mono rounded-full border border-[#0b1020]/15 bg-white/60 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em]">Flagship 01</span>
                  <span className="rounded-full bg-[#2bd96b]/20 px-2.5 py-1 text-[0.62rem] font-bold text-[#0f7a3a]">Live prototype</span>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#0b1020] text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div>
                <h3 className="font-display tight text-[clamp(3.4rem,8vw,6.6rem)] font-extrabold">RAFIQ<span className="text-[#2563eb]">.</span></h3>
                <p className="mt-2 max-w-[19rem] text-[0.95rem] font-medium leading-snug text-[#0b1020]/70">
                  A local-first Arabic AI companion that remembers, so people with memory loss can just live.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["Local LLM", "Arabic voice", "Offline-first", "Caregiver app"].map((t) => (
                    <span key={t} className="rounded-full border border-[#0b1020]/12 bg-white/60 px-2.5 py-1 text-[0.62rem] font-bold">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </TLink>

          {/* OMNI */}
          <TLink
            href="/flagship/omni"
            data-fcard
            data-cursor="OMNI"
            className="group relative flex min-h-[28rem] flex-1 overflow-hidden rounded-[2.4rem] bg-[#07070a] text-white ring-1 ring-white/10 transition-[flex] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:min-h-0 lg:hover:flex-[1.55]"
          >
            <div aria-hidden className="grid-lines absolute inset-0 opacity-70 [--grid:rgba(255,255,255,.07)]" />
            <div aria-hidden className="blob-glow right-0 top-0 h-80 w-80" style={{ background: "radial-gradient(closest-side, rgba(255,36,24,.28), transparent)" }} />
            <SwarmScene progress={prog} className="!inset-y-0 !left-[8%] !right-0" />

            <div className="relative z-10 flex w-full flex-col justify-between p-7 sm:p-9">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="mono rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em]">Flagship 02</span>
                  <span className="rounded-full bg-red/20 px-2.5 py-1 text-[0.62rem] font-bold text-red">In development</span>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-red text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div className="mono pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 text-right text-[0.65rem] uppercase leading-relaxed tracking-[0.14em] text-white/50 sm:block">
                units · 1,100
                <br />
                formation
                <br />
                <span ref={label} className="text-red">SCATTER</span>
              </div>

              <div>
                <h3 className="font-display tight text-[clamp(3.4rem,8vw,6.6rem)] font-extrabold">OMNI<span className="text-red">.</span></h3>
                <p className="mt-2 max-w-[19rem] text-[0.95rem] font-medium leading-snug text-white/65">
                  Microbots that think as one swarm — simulated in the browser, built for hardware.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["Three.js", "ESP32", "MQTT", "Swarm control"].map((t) => (
                    <span key={t} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.62rem] font-bold">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </TLink>
        </div>
      </div>
    </section>
  );
}
