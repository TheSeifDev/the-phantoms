"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { Button, Label, Reveal } from "@/components/ui";
import { TLink } from "@/components/layout/PageTransition";

const reasons = [
  ["01", "You get the actual team", "No sales layer between the brief and the people shaping the product. You talk to the builders, see the work and make decisions together."],
  ["02", "The first week has a shape", "We turn an open question into a useful scope, a direction and something you can react to — before a long build disappears over the horizon."],
  ["03", "The hand-off is not the finish line", "Launch includes the operating details: readable code, documented decisions, a calm release and a clear next step."],
  ["04", "Small enough to care", "A 35-person team gives us range without turning your product into a queue number. The work stays close and accountable."],
] as const;

export function WhyClients() {
  return (
    <section id="why-clients" data-section="Why clients" className="relative overflow-hidden py-24 sm:py-36">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
          <div>
            <Label>Why clients pick us</Label>
            <Reveal as="h2" className="font-display tight mt-7 max-w-[8ch] text-[clamp(3rem,6vw,6.7rem)] font-extrabold">Good people. <span className="serif-i text-red">Serious</span> follow-through.</Reveal>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted">If you want a vendor to disappear after delivery, we are probably not the right fit. If you want a product partner who stays useful, let&apos;s talk.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Button href="/contact" variant="red" cursor="TALK">Talk to the team</Button><TLink href="/work" className="group inline-flex h-[3.1rem] items-center gap-2 rounded-full border border-line px-5 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition hover:border-red hover:text-red">See the work <ArrowUpRight size={15} className="transition group-hover:rotate-45" /></TLink></div>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {reasons.map(([number, title, line]) => (
              <article key={number} className="group grid gap-5 py-7 sm:grid-cols-[4rem_1fr] sm:py-9">
                <span className="mono text-[0.68rem] text-red">{number}</span>
                <div>
                  <h3 className="flex items-center gap-3 font-display text-[clamp(1.7rem,3vw,2.8rem)] font-bold leading-none tracking-[-0.055em] transition group-hover:text-red"><Check size={18} className="shrink-0 text-red" />{title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{line}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
