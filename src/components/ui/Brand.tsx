"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { gsap } from "@/lib/gsap";

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

let hexBusy = false;
/** Theme switch: a wave of hexagon blocks floods out from the button, the theme flips under them, then they dissolve. */
function hexThemeSwitch(origin: HTMLElement, next: "light" | "dark", apply: () => void) {
  if (hexBusy) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }
  hexBusy = true;
  const r = origin.getBoundingClientRect();
  const ox = r.left + r.width / 2;
  const oy = r.top + r.height / 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const s = vw < 700 ? 46 : 74; // hex radius
  const w = Math.sqrt(3) * s;
  const rowH = 1.5 * s;
  const target = next === "light" ? "#f3f0ea" : "#08080a";
  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.cssText = "position:fixed;inset:0;z-index:120;pointer-events:none;overflow:hidden";
  const tiles: { el: HTMLDivElement; d: number }[] = [];
  const rows = Math.ceil(vh / rowH) + 2;
  const cols = Math.ceil(vw / w) + 2;
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const x = col * w + (row % 2 ? w / 2 : 0);
      const y = row * rowH;
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${x - w / 2}px;top:${y - s}px;width:${w + 1.5}px;height:${2 * s + 1.5}px;background:#ff2418;clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transform:scale(0);will-change:transform`;
      wrap.appendChild(el);
      tiles.push({ el, d: Math.hypot(x - ox, y - oy) });
    }
  }
  document.body.appendChild(wrap);
  const maxD = Math.max(...tiles.map((t) => t.d));
  const spread = 0.62;
  const tl = gsap.timeline({
    onComplete: () => {
      wrap.remove();
      hexBusy = false;
    },
  });
  tiles.forEach(({ el, d }) => {
    const k = (d / maxD) * spread;
    tl.to(el, { scale: 1.02, duration: 0.34, ease: "power3.out" }, k);
    tl.to(el, { backgroundColor: target, duration: 0.4, ease: "power1.inOut" }, k + 0.12);
  });
  tl.call(apply, [], spread + 0.5);
  tiles.forEach(({ el, d }) => {
    const k = spread + 0.62 + (d / maxD) * 0.5;
    tl.to(el, { scale: 0, rotate: 30, duration: 0.42, ease: "power3.in" }, k);
  });
}
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      data-cursor="theme"
      onClick={(e) => hexThemeSwitch(e.currentTarget, dark ? "light" : "dark", () => setTheme(dark ? "light" : "dark"))}
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
