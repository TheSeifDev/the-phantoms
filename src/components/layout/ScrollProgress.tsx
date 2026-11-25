"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";

/** Top progress bar + side rail of section dots (any element with data-section="Name"). */
export function ScrollProgress() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const [secs, setSecs] = useState<{ id: string; name: string }[]>([]);
  const [active, setActive] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (s) => {
        if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
      },
    });
    return () => st.kill();
  }, [pathname]);

  useEffect(() => {
    setActive(0);
    const t = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
      setSecs(els.map((el, i) => ({ id: (el.id ||= `sec-${i}`), name: el.dataset.section! })));
      els.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (s) => s.isActive && setActive(i),
        });
      });
    }, 900);
    return () => {
      clearTimeout(t);
      setSecs([]);
    };
  }, [pathname]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const l = lenis.get();
    if (l) l.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div ref={bar} className="h-full origin-left bg-red shadow-[0_0_14px_rgba(255,36,24,.9)]" style={{ transform: "scaleX(0)" }} />
      </div>
      {secs.length > 1 && (
        <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex">
          {secs.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-label={`Go to ${s.name}`}
              className="group flex items-center gap-3"
            >
              <span
                className={`mono text-[0.62rem] uppercase tracking-[0.18em] transition-all duration-300 ${
                  i === active ? "translate-x-0 text-fg opacity-100" : "translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                {s.name}
              </span>
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  i === active ? "w-8 bg-red" : "w-3 bg-fg/30 group-hover:w-5 group-hover:bg-fg/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export const _gsap = gsap;
