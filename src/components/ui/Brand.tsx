"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { hexWave } from "@/lib/hexwave";

export function Logo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden
        className="absolute inset-[-18%] rounded-full opacity-90"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--fg) 22%, transparent) 0%, transparent 68%)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo.webp"
        alt="Phantoms logo"
        width={size}
        height={size}
        className="relative h-full w-full object-contain"
        draggable={false}
      />
    </span>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      data-cursor="theme"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const next = dark ? "light" : "dark";
        const ok = hexWave({
          origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 },
          cover: next === "light" ? "#f3f0ea" : "#08080a",
          onCovered: () => setTheme(next),
        });
        if (!ok) return;
      }}
      className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition-colors hover:border-red hover:text-red"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

/** Dot + ring custom cursor. Grows over [data-cursor], shows its text label. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    const dx = gsap.quickTo(d, "x", { duration: 0.1, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.1, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor], a, button") as HTMLElement | null;
      const txt = t?.getAttribute("data-cursor") ?? "";
      const big = !!txt && txt !== "theme";
      if (label.current) label.current.textContent = big ? txt : "";
      gsap.to(r, {
        width: big ? 92 : t ? 54 : 34,
        height: big ? 92 : t ? 54 : 34,
        backgroundColor: big ? "rgba(255,36,24,0.92)" : "rgba(255,36,24,0)",
        borderColor: big ? "rgba(255,36,24,0)" : "rgba(255,255,255,0.5)",
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(d, { scale: big ? 0 : 1, duration: 0.3 });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="cursor-ring grid place-items-center border"
        style={{
          width: 34,
          height: 34,
          marginLeft: -17,
          marginTop: -17,
          borderColor: "rgba(255,255,255,0.5)",
          mixBlendMode: "normal",
        }}
      >
        <span
          ref={label}
          className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white"
        />
      </div>
      <div
        ref={dot}
        className="cursor-dot bg-red"
        style={{ width: 6, height: 6, marginLeft: -3, marginTop: -3 }}
      />
    </>
  );
}
