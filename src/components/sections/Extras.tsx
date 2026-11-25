"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Fade, Label, Reveal } from "@/components/ui";
import { faqs } from "@/data/site";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,10vw,9rem)]">
      <div aria-hidden className="aura right-[-12rem] top-[-8rem] h-[28rem] w-[28rem] opacity-20" />
      <div className="wrap relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <Label>06 — Questions</Label>
          <Reveal as="h2" className="font-display tight mt-5 text-[clamp(2.8rem,6vw,5.4rem)] font-extrabold">Good <span className="serif-i glow-red">questions</span>.</Reveal>
          <p className="ar mt-4 text-lg text-muted">أسئلة بتتسأل كتير.</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">The useful details before we put a date on the calendar.</p>
        </div>
        <div className="glow-card overflow-hidden rounded-[1.8rem] border-line bg-card/60 px-5 sm:px-8">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const ar = /[\u0600-\u06FF]/.test(f.q);
            return (
              <div key={f.q} className="border-b border-line last:border-b-0">
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6">
                  <span className={`font-display text-base font-bold tracking-tight sm:text-lg ${ar ? "ar" : ""}`}>{f.q}</span>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${isOpen ? "rotate-45 border-red bg-red text-white shadow-[0_0_22px_rgba(255,36,24,.45)]" : "border-line text-muted"}`}><Plus size={16} /></span>
                </button>
                <div className="grid transition-[grid-template-rows] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden"><p className={`max-w-xl pb-6 text-sm leading-relaxed text-muted ${ar ? "ar text-base" : ""}`}>{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const rows: [string, boolean | string, boolean | string, boolean | string][] = [
  ["Talk directly to the builders", true, true, false],
  ["Studio-level design & motion", true, "Depends", true],
  ["Web + mobile + backend in one team", true, false, true],
  ["Arabic / English with full RTL", true, "Rarely", "Rarely"],
  ["Weekly clickable builds", true, "Sometimes", "Sometimes"],
  ["Post-launch support", true, "Ad hoc", true],
  ["Startup pricing & speed", true, true, false],
];

function Cell({ v, hero }: { v: boolean | string; hero?: boolean }) {
  if (v === true) return <span className={`inline-block h-3 w-3 rounded-full ${hero ? "bg-red shadow-[0_0_14px_rgba(255,36,24,.9)]" : "bg-fg/70"}`} aria-label="Yes" />;
  if (v === false) return <span className="inline-block h-px w-4 bg-muted" aria-label="No" />;
  return <span className="text-xs text-muted">{v}</span>;
}

export function Compare() {
  return (
    <section className="relative overflow-hidden py-[clamp(4rem,8vw,7rem)]">
      <div aria-hidden className="aura left-[-16rem] top-16 h-[30rem] w-[30rem] opacity-15" />
      <div className="wrap relative">
        <Label>05 — Why Phantoms</Label>
        <Reveal as="h2" className="font-display tight mt-5 max-w-3xl text-[clamp(2.6rem,6vw,5.2rem)] font-extrabold">Agency polish. <span className="serif-i glow-red">Startup</span> speed.</Reveal>
        <Fade className="glow-card mt-10 overflow-x-auto rounded-[1.8rem] bg-card/60 p-2 sm:mt-12 sm:p-4">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead><tr className="border-b border-line text-xs uppercase tracking-[0.16em]"><th className="py-4 pl-4 pr-4 font-semibold text-muted" /><th className="rounded-t-2xl bg-red px-5 py-4 text-center font-bold text-white shadow-[0_0_30px_rgba(255,36,24,.2)]">Phantoms</th><th className="px-5 py-4 text-center font-semibold text-muted">Freelancer</th><th className="px-5 py-4 text-center font-semibold text-muted">Big agency</th></tr></thead>
            <tbody>{rows.map(([k, a, b, c]) => <tr key={k} className="border-b border-line last:border-b-0"><td className="py-5 pl-4 pr-4 text-sm font-medium">{k}</td><td className="bg-red/10 px-5 text-center"><Cell v={a} hero /></td><td className="px-5 text-center"><Cell v={b} /></td><td className="px-5 text-center"><Cell v={c} /></td></tr>)}</tbody>
          </table>
        </Fade>
      </div>
    </section>
  );
}
