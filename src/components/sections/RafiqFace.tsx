"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const states = ["Idle", "Listening", "Thinking", "Happy"] as const;
type S = (typeof states)[number];

/** RAFIQ has no mouth — attention is expressed through the eyes and shape. */
export function RafiqFace({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const eyes = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<S>("Idle");

  // pointer tracking
  useEffect(() => {
    const el = eyes.current;
    const w = wrap.current;
    if (!el || !w) return;
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const bx = gsap.quickTo(body.current, "x", { duration: 0.9, ease: "power3" });
    const by = gsap.quickTo(body.current, "y", { duration: 0.9, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = w.getBoundingClientRect();
      const c = (v: number) => Math.max(-0.35, Math.min(0.35, v));
      const dx = c((e.clientX - (r.left + r.width / 2)) / window.innerWidth);
      const dy = c((e.clientY - (r.top + r.height / 2)) / window.innerHeight);
      x(dx * 90);
      y(dy * 70);
      bx(dx * 16);
      by(dy * 12);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // blink
  useEffect(() => {
    const els = eyes.current?.querySelectorAll("[data-eye]");
    if (!els) return;
    let t: ReturnType<typeof setTimeout>;
    const blink = () => {
      gsap.to(els, { scaleY: 0.08, duration: 0.09, yoyo: true, repeat: 1, transformOrigin: "50% 50%" });
      t = setTimeout(blink, 2200 + Math.random() * 3200);
    };
    t = setTimeout(blink, 1800);
    return () => clearTimeout(t);
  }, []);

  // state morphs
  useEffect(() => {
    const els = eyes.current?.querySelectorAll("[data-eye]");
    if (!els) return;
    const map: Record<S, gsap.TweenVars> = {
      Idle: { height: "100%", borderRadius: "999px", y: 0 },
      Listening: { height: "122%", borderRadius: "999px", y: -2 },
      Thinking: { height: "58%", borderRadius: "999px", y: -18 },
      Happy: { height: "46%", borderRadius: "999px 999px 4px 4px", y: 6 },
    };
    gsap.to(els, { ...map[state], duration: 0.6, ease: "elastic.out(1,0.6)" });
    gsap.to(ring.current, {
      opacity: state === "Listening" ? 1 : 0,
      scale: state === "Listening" ? 1.12 : 0.9,
      duration: 0.6,
    });
    gsap.to(body.current, { scale: state === "Happy" ? 1.05 : 1, duration: 0.7, ease: "elastic.out(1,0.5)" });
  }, [state]);

  return (
    <div className={`relative ${className}`}>
      <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[30rem]">
        {/* listening ring */}
        <div
          ref={ring}
          className="absolute inset-[-6%] rounded-[46%] border-2 border-[#2563eb]/40 opacity-0"
          style={{ animation: "ringpulse 1.6s ease-in-out infinite" }}
        />
        <div
          ref={body}
          className="absolute inset-0"
          style={{
            borderRadius: "46% 54% 50% 50% / 52% 50% 50% 48%",
            background:
              "radial-gradient(120% 90% at 30% 15%, #8fb4ff 0%, #4f8cff 32%, #2563eb 62%, #1a3fb8 100%)",
            boxShadow:
              "inset 0 -30px 60px rgba(10,20,90,.45), inset 0 30px 50px rgba(255,255,255,.35), 0 40px 80px -20px rgba(37,99,235,.55)",
          }}
        >
          {/* gloss */}
          <div className="absolute left-[16%] top-[9%] h-[18%] w-[34%] -rotate-[14deg] rounded-full bg-white/45 blur-xl" />
          <div ref={eyes} className="absolute left-1/2 top-[44%] flex w-[50%] -translate-x-1/2 justify-between">
            {[0, 1].map((i) => (
              <div key={i} className="flex h-[min(7.5rem,17vw)] w-[24%] items-center justify-center">
                <div
                  data-eye
                  className="relative w-full bg-[#071033]"
                  style={{ height: "100%", borderRadius: 999, boxShadow: "0 0 0 6px rgba(255,255,255,.08)" }}
                >
                  <span className="absolute left-[22%] top-[14%] h-[22%] w-[38%] rounded-full bg-white/90" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* floating bubbles */}
        <div className="absolute -left-2 top-[8%] hidden max-w-[11rem] rounded-2xl bg-white px-4 py-3 text-xs text-[#0b1020] shadow-xl sm:block" style={{ animation: "bob 5s ease-in-out infinite" }}>
          <div className="ar text-sm font-semibold">مين أحمد؟</div>
          <div className="ar mt-1 text-[0.72rem] leading-snug text-slate-500">
            أحمد ده ابنك، بيزورك كل جمعة الصبح.
          </div>
        </div>
        <div className="absolute -right-3 bottom-[12%] hidden rounded-2xl bg-[#0b1020] px-4 py-3 text-xs text-white shadow-xl sm:block" style={{ animation: "bob 6s ease-in-out -2s infinite" }}>
          <div className="text-[0.65rem] uppercase tracking-[0.16em] text-white/50">Reminder · 08:00</div>
          <div className="ar mt-1 text-sm font-semibold">ضغط الدم</div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {states.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setState(s)}
            data-active={state === s}
            className="rounded-full border border-[#0b1020]/15 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#0b1020]/60 transition-colors hover:text-[#0b1020] data-[active=true]:border-[#2563eb] data-[active=true]:bg-[#2563eb] data-[active=true]:text-white"
          >
            {s}
          </button>
        ))}
      </div>
      <style>{`
        @keyframes ringpulse{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.06);opacity:.35}}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>
    </div>
  );
}
