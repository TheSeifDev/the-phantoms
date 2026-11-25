"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { signalReady } from "@/lib/ready";

const SLICES = 7;
const LOG = [
  "boot  phantoms.core v2.0",
  "mount web · apps · saas",
  "link  rafiq ⇄ omni",
  "sync  25 members online",
  "ready.",
];
const HEX = "M100 8 L180 54 L180 146 L100 192 L20 146 L20 54 Z";

/** Modern loader: hexagon draws around the mark, boot log types, counter runs, panels split away. */
export function Preloader() {
  const pathname = usePathname();
  const [done, setDone] = useState(pathname !== "/");
  const root = useRef<HTMLDivElement>(null);
  const hex = useRef<SVGPathElement>(null);
  const hex2 = useRef<SVGPathElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("ph-seen");
    if (pathname !== "/" || seen || prefersReducedMotion()) {
      sessionStorage.setItem("ph-seen", "1");
      setDone(true);
      signalReady();
      return;
    }
    sessionStorage.setItem("ph-seen", "1");
    document.documentElement.style.overflow = "hidden";
    const len = hex.current!.getTotalLength();
    gsap.set([hex.current, hex2.current], { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(logo.current, { opacity: 0, scale: 0.7 });
    const lines = log.current!.children;
    gsap.set(lines, { opacity: 0, x: -10 });
    const slices = root.current!.querySelectorAll<HTMLElement>("[data-slice]");
    const c = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setDone(true);
      },
    });
    tl.to(hex.current, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0.1)
      .to(hex2.current, { strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut" }, 0.25)
      .to(logo.current, { opacity: 1, scale: 1, duration: 1, ease: "expo.out" }, 0.5)
      .to(lines, { opacity: 1, x: 0, duration: 0.4, stagger: 0.3, ease: "power2.out" }, 0.25)
      .to(
        c,
        {
          v: 100,
          duration: 1.9,
          ease: "power1.inOut",
          onUpdate: () => {
            if (num.current) num.current.textContent = String(Math.round(c.v)).padStart(3, "0");
            if (bar.current) bar.current.style.transform = `scaleX(${c.v / 100})`;
          },
        },
        0.1,
      )
      // exit: mark pops, panels split away from the centre
      .to(stage.current, { scale: 1.15, opacity: 0, duration: 0.55, ease: "power3.in" }, 1.95)
      .add(() => signalReady(), 2.3)
      .to(
        slices,
        {
          yPercent: -100,
          duration: 1,
          ease: "expo.inOut",
          stagger: { each: 0.07, from: "center" },
        },
        2.3,
      )
      .to(root.current, { autoAlpha: 0, duration: 0.01 }, 3.5);
    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, [pathname]);

  if (done) return null;
  return (
    <div ref={root} className="preloader fixed inset-0 z-[100] overflow-hidden text-white" aria-hidden>
      <div className="absolute inset-0 flex">
        {Array.from({ length: SLICES }).map((_, i) => (
          <div key={i} data-slice className="h-full flex-1 border-r border-white/[0.04] bg-[#08080a]" />
        ))}
      </div>
      <div className="grid-plus absolute inset-0 opacity-60" />
      <div ref={stage} className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%]">
          <div className="relative h-[min(52vw,16rem)] w-[min(52vw,16rem)]">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full overflow-visible">
              <path d={HEX} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1" />
              <path ref={hex} d={HEX} fill="none" stroke="#ff2418" strokeWidth="2" strokeLinejoin="round" />
              <path
                ref={hex2}
                d={HEX}
                fill="none"
                stroke="rgba(255,255,255,.55)"
                strokeWidth="1"
                transform="translate(100 100) scale(1.12) translate(-100 -100)"
              />
            </svg>
            <div ref={logo} className="absolute inset-[22%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo.webp" alt="" className="h-full w-full object-contain" draggable={false} />
            </div>
          </div>
        </div>
        <div
          ref={log}
          className="mono absolute left-1/2 top-[calc(50%+min(26vw,8rem)+1.5rem)] w-[min(86vw,22rem)] -translate-x-1/2 space-y-1 text-[0.7rem] text-white/55"
        >
          {LOG.map((l, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-red">{i === LOG.length - 1 ? "✓" : "›"}</span>
              <span className={i === LOG.length - 1 ? "text-white" : ""}>{l}</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 wrap pb-8">
          <div className="flex items-end justify-between">
            <div className="mono text-[0.68rem] uppercase tracking-[0.2em] text-white/45">Phantoms · Alexandria</div>
            <div className="font-display text-[clamp(3.5rem,11vw,8rem)] font-extrabold leading-none tracking-[-0.06em]">
              <span ref={num}>000</span>
              <span className="text-red">%</span>
            </div>
          </div>
          <div className="mt-4 h-px w-full bg-white/15">
            <div ref={bar} className="h-full origin-left bg-red" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
