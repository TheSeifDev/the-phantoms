"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TLink } from "@/components/layout/PageTransition";
import type { Project } from "@/data/projects";

/* ───────── Button ───────── */
export function Button({
  href,
  children,
  variant = "red",
  className = "",
  cursor,
  type,
  onClick,
  disabled,
}: {
  href?: string;
  children: ReactNode;
  variant?: "red" | "light" | "ghost";
  className?: string;
  cursor?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = `btn btn-${variant} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <span className="btn-icon">
        <ArrowUpRight size={16} strokeWidth={2.4} />
      </span>
    </>
  );
  if (href) {
    return (
      <TLink href={href} className={cls} data-cursor={cursor} data-magnet="0.2">
        {inner}
      </TLink>
    );
  }
  return (
    <button type={type ?? "button"} data-magnet="0.2" onClick={onClick} disabled={disabled} className={`${cls} disabled:opacity-60`}>
      {inner}
    </button>
  );
}

/* ───────── Section label ───────── */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`label ${className}`}>{children}</span>;
}

/* ───────── Line-mask text reveal ───────── */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** play on mount instead of on scroll */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      let split: SplitText | undefined;
      document.fonts.ready.then(() => {
        if (!ref.current) return;
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "rv-line",
          onSplit: (self) => {
            gsap.set(el, { opacity: 1 });
            return gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.15,
              ease: "expo.out",
              stagger: 0.09,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 90%", once: true },
            });
          },
        });
      });
      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </Tag>
  );
}

/* ───────── Fade-up block ───────── */
export function Fade({
  children,
  className = "",
  delay = 0,
  y = 40,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </Tag>
  );
}

/* ───────── Scroll-scrubbed word reveal (grey → ink) ───────── */
export function WordScrub({
  children,
  className = "",
  start = "top 82%",
  end = "bottom 52%",
}: {
  children: ReactNode;
  className?: string;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      let split: SplitText | undefined;
      document.fonts.ready.then(() => {
        if (!ref.current) return;
        split = SplitText.create(el, { type: "words", autoSplit: true });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
          },
        );
      });
      return () => split?.revert();
    },
    { scope: ref },
  );
  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}

/* ───────── Count-up ───────── */
export function Counter({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.textContent = `${to}${suffix}`;
        return;
      }
      const o = { v: 0 };
      gsap.to(o, {
        v: to,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(o.v)}${suffix}`;
        },
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

/* ───────── Marquee ───────── */
export function Marquee({
  items,
  className = "",
  itemClass = "",
  duration = 40,
  reverse = false,
  separator,
}: {
  items: ReactNode[];
  className?: string;
  itemClass?: string;
  duration?: number;
  reverse?: boolean;
  separator?: ReactNode;
}) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((it, i) => (
        <div key={i} className="flex shrink-0 items-center">
          <span className={itemClass}>{it}</span>
          <span className="mx-[2.2vw] inline-flex">{separator ?? <span className="h-2 w-2 rounded-[1px] bg-red" />}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div className={`marquee-track ${reverse ? "rev" : ""}`} style={{ ["--dur" as string]: `${duration}s` }}>
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/* ───────── Rotating circular text badge ───────── */
export function RotatingBadge({ text, size = 150, children }: { text: string; size?: number; children?: ReactNode }) {
  const id = "badge-" + text.length;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id={id} d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
        </defs>
        <text className="fill-current text-[15px] font-semibold uppercase tracking-[0.28em]">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}

/* ───────── Project cover (screenshot or typographic fallback) ───────── */
export function ProjectCover({ p, className = "", fit = "cover" }: { p: Project; className?: string; fit?: "cover" | "top" }) {
  if (p.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.cover}
        alt={`${p.title} preview`}
        loading="lazy"
        draggable={false}
        className={`h-full w-full object-cover ${fit === "top" ? "object-top" : "object-center"} ${className}`}
      />
    );
  }
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 20% 10%, ${p.hue[0]}cc 0%, transparent 55%), radial-gradient(90% 80% at 90% 100%, ${p.hue[0]}66 0%, transparent 60%), ${p.hue[1]}`,
      }}
    >
      <svg aria-hidden viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 h-[70%] w-auto -translate-x-1/2 -translate-y-1/2 text-white/20" fill="none" stroke="currentColor" strokeWidth="0.6">
        <path d="M50 4 90 27v46L50 96 10 73V27z" />
        <path d="M50 20 76 35v30L50 80 24 65V35z" />
      </svg>
      <span className="font-display absolute inset-0 grid place-items-center px-6 text-center text-[clamp(1.8rem,3.4vw,3rem)] font-extrabold tracking-[-0.04em] text-white/90">
        {p.title}
      </span>
    </div>
  );
}
