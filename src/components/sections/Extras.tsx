"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Fade, Label, Reveal } from "@/components/ui";
import { faqs } from "@/data/site";

/* ───────── FAQ accordion ───────── */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Label>FAQ</Label>
          <Reveal as="h2" className="font-display tight mt-6 text-[clamp(2.6rem,6vw,5.4rem)] font-extrabold">
            Good <span className="serif-i text-red">questions</span>.
          </Reveal>
          <p className="ar mt-4 text-lg text-muted">أسئلة بتتسأل كتير.</p>
        </div>
        <div className="border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const ar = /[\u0600-\u06FF]/.test(f.q);
            return (
              <div key={f.q} className="border-b border-line">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className={`font-display text-lg font-bold tracking-tight sm:text-xl ${ar ? "ar" : ""}`}>{f.q}</span>
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                      isOpen ? "rotate-45 border-red bg-red text-white" : "border-line"
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className={`max-w-xl pb-6 text-sm leading-relaxed text-muted ${ar ? "ar text-base" : ""}`}>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────── Comparison table ───────── */
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
    <section className="py-16 sm:py-24">
      <div className="wrap">
        <Label>Why Phantoms</Label>
        <Reveal as="h2" className="font-display tight mt-6 max-w-3xl text-[clamp(2.4rem,6vw,5.2rem)] font-extrabold">
          Agency polish. <span className="serif-i text-red">Startup</span> speed.
        </Reveal>
        <Fade className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-[0.16em]">
                <th className="py-4 pr-4 font-semibold text-muted" />
                <th className="rounded-t-2xl bg-red px-5 py-4 text-center font-bold text-white">Phantoms</th>
                <th className="px-5 py-4 text-center font-semibold text-muted">Freelancer</th>
                <th className="px-5 py-4 text-center font-semibold text-muted">Big agency</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, a, b, c]) => (
                <tr key={k} className="border-b border-line">
                  <td className="py-5 pr-4 text-sm font-medium">{k}</td>
                  <td className="bg-red/10 px-5 text-center"><Cell v={a} hero /></td>
                  <td className="px-5 text-center"><Cell v={b} /></td>
                  <td className="px-5 text-center"><Cell v={c} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fade>
      </div>
    </section>
  );
}
