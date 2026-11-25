"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { usePageTransition } from "@/components/layout/PageTransition";

export function FooterClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Cairo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mono flex items-center gap-2 text-[0.72rem] text-muted">
      <span>ALEXANDRIA</span>
      <span className="rounded-md border border-line px-2 py-1 text-fg tabular-nums">{t || "--:--:--"}</span>
      <span>EET</span>
    </div>
  );
}

export function FooterForm() {
  const { go } = usePageTransition();
  const [v, setV] = useState("");
  return (
    <form
      className="mt-7 flex max-w-md items-center gap-2 rounded-full border border-line bg-bg/60 p-1.5 pl-5 transition-colors focus-within:border-red"
      onSubmit={(e) => {
        e.preventDefault();
        try {
          sessionStorage.setItem("ph-email", v);
        } catch {}
        go("/contact");
      }}
    >
      <input
        type="email"
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="your@email.com"
        aria-label="Your email"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        className="group flex h-10 items-center gap-2 rounded-full bg-red pl-5 pr-1.5 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-white"
      >
        Start a project
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-red transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight size={14} strokeWidth={2.6} />
        </span>
      </button>
    </form>
  );
}
