"use client";
import { useEffect, useState } from "react";
import { useLenis } from "@/lib/lenis";

export type IndexItem = { id: string; n: string; label: string };

/** Numbered side index — highlights the section in view, click to glide there. */
export function SideIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const lenis = useLenis();
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.45;
      let cur = "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid) cur = it.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const l = lenis.get();
    if (l) l.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav aria-label="Sections" className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 transition-opacity duration-500 2xl:flex ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button key={it.id} onClick={() => go(it.id)} className="group flex items-center gap-2.5" aria-label={it.label}>
            <span className={`mono text-[0.62rem] uppercase tracking-[0.14em] transition-all duration-300 ${on ? "translate-x-0 opacity-100 text-red" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"}`}>{it.label}</span>
            <span className={`mono text-[0.62rem] tabular-nums transition-colors ${on ? "text-red" : "text-muted"}`}>{it.n}</span>
            <span className={`block h-px transition-all duration-300 ${on ? "w-8 bg-red" : "w-4 bg-fg/30 group-hover:w-6"}`} />
          </button>
        );
      })}
    </nav>
  );
}
