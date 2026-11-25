"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { signalReady } from "@/lib/ready";

const SLICES = 8;

export function Preloader() {
  const pathname = usePathname();
  const [done, setDone] = useState(pathname !== "/");
  const root = useRef<HTMLDivElement>(null);
  const black = useRef<HTMLDivElement>(null);
  const red = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const sun = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const meta = useRef<HTMLDivElement>(null);

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
    const vmax = Math.max(window.innerWidth, window.innerHeight);
    const sunR = Math.min(window.innerWidth, window.innerHeight) * 0.2;
    const maxR = vmax * 1.1;

    const holes = { r: sunR, r2: 0 };
    const apply = () => {
      black.current?.style.setProperty("--r", `${holes.r}px`);
      red.current?.style.setProperty("--r", `${holes.r2}px`);
    };
    // start: no hole in the black layer (sun disc is a separate element)
    holes.r = 0;
    apply();

    const slices = logo.current!.querySelectorAll<HTMLElement>("[data-slice]");
    const count = { v: 0 };

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setDone(true);
      },
    });

    tl.fromTo(
      meta.current!.children,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
      0.1,
    )
      .fromTo(
        slices,
        {
          opacity: 0,
          x: () => gsap.utils.random(-260, 260),
          y: () => gsap.utils.random(-320, 320),
          rotate: () => gsap.utils.random(-40, 40),
          scale: () => gsap.utils.random(0.6, 1.4),
          filter: "blur(12px)",
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.9,
          stagger: { each: 0.07, from: "random" },
        },
        0.2,
      )
      .fromTo(sun.current!, { scale: 0.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: "power3.out" }, 0.2)
      .to(
        count,
        {
          v: 100,
          duration: 2.4,
          ease: "power2.inOut",
          onUpdate: () => {
            const n = Math.round(count.v);
            if (counter.current) counter.current.textContent = String(n).padStart(3, "0");
            if (bar.current) bar.current.style.transform = `scaleX(${count.v / 100})`;
          },
        },
        0.2,
      )
      // hold, then the sun opens
      .to(logo.current, { scale: 0.86, duration: 0.5, ease: "power2.in" }, 2.75)
      .to([meta.current, counter.current!.parentElement, bar.current!.parentElement], { opacity: 0, duration: 0.4 }, 2.75)
      .set(holes, { r: sunR }, 3.05)
      .set(sun.current, { opacity: 0 }, 3.05)
      .call(apply, [], 3.05)
      .to(
        holes,
        { r: maxR, duration: 1.5, ease: "expo.inOut", onUpdate: apply },
        3.05,
      )
      .to(
        holes,
        { r2: maxR * 1.05, duration: 1.4, ease: "expo.inOut", onUpdate: apply },
        3.3,
      )
      .to(logo.current, { opacity: 0, scale: 1.5, duration: 0.8, ease: "power3.in" }, 3.05)
      .call(signalReady, [], 3.55);

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, [pathname]);

  if (done) return null;

  const maskStyle = {
    WebkitMaskImage:
      "radial-gradient(circle at 50% 50%, transparent calc(var(--r, 0px) - 0.5px), #000 calc(var(--r, 0px) + 0.5px))",
    maskImage:
      "radial-gradient(circle at 50% 50%, transparent calc(var(--r, 0px) - 0.5px), #000 calc(var(--r, 0px) + 0.5px))",
  } as const;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[100] select-none" aria-hidden>
      {/* layer under black: red band */}
      <div ref={red} className="absolute inset-0 bg-red" style={maskStyle} />
      {/* top: ink */}
      <div ref={black} className="absolute inset-0 bg-[#060607]" style={maskStyle}>
        <div className="grid-lines absolute inset-0 opacity-30" />
      </div>

      {/* sun */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          ref={sun}
          className="rounded-full bg-red"
          style={{
            width: "40vmin",
            height: "40vmin",
            boxShadow: "0 0 120px 20px rgba(255,36,24,.45)",
            opacity: 0,
          }}
        />
      </div>

      {/* logo built from slices */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div ref={logo} className="flex" style={{ width: "min(46vmin, 360px)", height: "min(46vmin, 360px)" }}>
          {Array.from({ length: SLICES }).map((_, i) => (
            <div
              key={i}
              data-slice
              style={{
                width: `${100 / SLICES}%`,
                height: "100%",
                backgroundImage: "url(/brand/logo.webp)",
                backgroundSize: `${SLICES * 100}% 100%`,
                backgroundPosition: `${(i / (SLICES - 1)) * 100}% 0`,
                backgroundRepeat: "no-repeat",
                filter: "drop-shadow(0 0 1px rgba(255,255,255,.35))",
              }}
            />
          ))}
        </div>
      </div>

      {/* chrome */}
      <div ref={meta} className="absolute inset-x-0 top-0 flex items-start justify-between p-5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/70 sm:p-8">
        <span className="jp text-sm tracking-[0.1em]">ファントムズ</span>
        <span className="hidden sm:block">Alexandria — Egypt</span>
        <span>Product team · 2026</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-8">
        <div className="font-display flex items-end gap-3 text-white">
          <span
            ref={counter}
            className="text-[clamp(4.5rem,16vw,13rem)] font-extrabold leading-[0.8] tracking-[-0.06em]"
          >
            000
          </span>
          <span className="mb-2 text-xl font-bold text-red">%</span>
        </div>
        <div className="mb-3 hidden w-1/3 sm:block">
          <div className="mb-2 flex justify-between text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/60">
            <span>Summoning</span>
            <span className="ar text-[0.8rem] normal-case tracking-normal">جارٍ التحميل</span>
          </div>
          <div className="h-px w-full bg-white/20">
            <div ref={bar} className="h-full origin-left bg-red" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
