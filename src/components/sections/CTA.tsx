"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, MessageCircle } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Button, Label, Reveal } from "@/components/ui";
import { TLink } from "@/components/layout/PageTransition";
import { site } from "@/data/site";

export function CTA() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const section = root.current;
    if (!section) return;

    const entrance = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 82%", once: true },
    });
    entrance.fromTo(
      "[data-cta-panel]",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    );
    entrance.fromTo(
      "[data-cta-copy]",
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", stagger: 0.1 },
      "-=0.35",
    );
  }, { scope: root });

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  }

  return (
    <section ref={root} id="contact-cta" data-section="Contact" className="relative px-3 pb-5 pt-5 sm:px-4">
      <div data-cta-panel className="mx-auto min-h-[34rem] w-full max-w-[72rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b090a] text-white shadow-none sm:min-h-[39rem] sm:rounded-[2.6rem]">
        <div className="wrap relative flex min-h-[34rem] flex-col justify-between py-12 sm:min-h-[39rem] sm:py-16">
          <div data-cta-copy className="flex items-center justify-between gap-4"><Label className="!text-white/60">Start a conversation</Label><span aria-hidden className="h-2 w-2 rounded-full bg-red" /></div>
          <div>
            <Reveal as="h2" className="font-display tight max-w-[11ch] text-[clamp(3.2rem,9vw,8.5rem)] font-extrabold">Have an idea? Let&apos;s <span className="serif-i text-red">build</span> it.</Reveal>
            <p data-cta-copy className="ar mt-6 text-[clamp(1.25rem,2.8vw,2.2rem)] font-semibold">عندك فكرة؟ خلينا نبنيها.</p>
            <div data-cta-copy className="mt-9 flex flex-wrap gap-3"><Button href="/contact" variant="red" cursor="START">Start a project</Button><a href={site.whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-[3.1rem] items-center gap-2 rounded-full border border-white/20 px-5 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition hover:border-[#25d366] hover:bg-[#25d366] hover:text-[#04210f]"><MessageCircle size={16} /> WhatsApp</a><button type="button" onClick={copy} className="inline-flex h-[3.1rem] items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-4 text-xs text-white/75 transition hover:bg-white/15">{copied ? <Check size={15} className="text-[#2bd96b]" /> : <Copy size={15} />}<span className="hidden sm:inline">{copied ? "Copied" : site.email}</span><span className="sm:hidden">{copied ? "Copied" : "Email"}</span></button></div>
          </div>
          <div data-cta-copy className="flex items-center justify-between border-t border-white/15 pt-5 text-[0.64rem] uppercase tracking-[0.15em] text-white/45"><span>Alexandria, Egypt</span><TLink href="/contact" className="group inline-flex items-center gap-2 text-white/75">Tell us everything <ArrowUpRight size={14} className="transition group-hover:rotate-45" /></TLink></div>
        </div>
      </div>
    </section>
  );
}
