"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, MessageCircle } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Button, Label, Reveal, RotatingBadge } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { ScrollMarquee } from "@/components/ui/ScrollMarquee";
import { TLink } from "@/components/layout/PageTransition";
import { site } from "@/data/site";

export function CTA({ id = "contact-cta" }: { id?: string }) {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-cta-card]",
        { scale: 0.9, borderRadius: "5rem" },
        {
          scale: 1,
          borderRadius: "3rem",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 30%", scrub: true },
        },
      );
      gsap.to("[data-cta-hex]", {
        y: -140,
        rotate: 60,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo("[data-cta-in]", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 60%", once: true } });
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section ref={root} id={id} data-section="Contact" className="relative px-3 pb-6 pt-6 sm:px-4">
      <div
        data-cta-card
        className="relative isolate overflow-hidden rounded-[3rem] bg-[#0a0a0c] text-white ring-1 ring-white/10"
        style={{ boxShadow: "0 60px 160px -60px rgba(255,36,24,.45)" }}
      >
        {/* glow + grid */}
        <div aria-hidden className="grid-lines absolute inset-0 -z-10 opacity-60 [--grid:rgba(255,255,255,.06)]" />
        <div aria-hidden className="blob-glow -bottom-40 left-1/2 -z-10 h-[30rem] w-[70rem] -translate-x-1/2" style={{ background: "radial-gradient(closest-side, rgba(255,36,24,.55), rgba(255,120,30,.18) 55%, transparent)" }} />
        {/* giant outlined marquee */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none opacity-90">
          <ScrollMarquee speed={60}>
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="font-display flex items-center whitespace-nowrap text-[clamp(8rem,22vw,22rem)] font-extrabold leading-none tracking-[-0.06em] [-webkit-text-stroke:1.5px_rgba(255,255,255,0.09)] text-transparent">
                LET&apos;S BUILD
                <HexOutline size={90} className="mx-10 text-white/10" />
              </span>
            ))}
          </ScrollMarquee>
        </div>
        <div data-cta-hex aria-hidden className="absolute right-[6%] top-[10%] -z-10 text-red/50">
          <HexOutline size={120} />
        </div>
        <div data-cta-hex aria-hidden className="absolute bottom-[12%] left-[4%] -z-10 text-white/15">
          <HexOutline size={70} />
        </div>

        <div className="wrap relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div data-cta-in className="flex items-center gap-4">
              <Label className="!text-white/60">Contact us</Label>
              <span className="mono inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-white/70">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#2bd96b]" /> Replies in one working day
              </span>
            </div>
            <Reveal as="h2" className="font-display tight mt-8 max-w-[14ch] text-[clamp(3rem,8.4vw,8rem)] font-extrabold">
              Have an idea? Let&apos;s <span className="serif-i text-red">build</span> it.
            </Reveal>
            <p data-cta-in className="ar mt-5 text-[clamp(1.3rem,2.6vw,2.1rem)] font-semibold">
              عندك فكرة؟ خلينا نبنيها.
            </p>

            <div data-cta-in className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="/contact" variant="red" cursor="START">
                Start a project
              </Button>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                data-magnet="0.2"
                className="group inline-flex h-[3.1rem] items-center gap-2.5 rounded-full border border-white/20 px-6 text-[0.74rem] font-bold uppercase tracking-[0.08em] transition-colors hover:border-[#25d366] hover:bg-[#25d366] hover:text-[#04210f]"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <button
                type="button"
                onClick={copy}
                className="mono inline-flex h-[3.1rem] items-center gap-2.5 rounded-full bg-white/[0.07] px-5 text-[0.78rem] text-white/85 backdrop-blur transition-colors hover:bg-white/15"
              >
                {copied ? <Check size={15} className="text-[#2bd96b]" /> : <Copy size={15} />}
                {copied ? "Copied!" : site.email}
              </button>
            </div>
          </div>

          <div data-cta-in className="hidden lg:block">
            <TLink href="/contact" data-cursor="TALK" className="block text-white">
              <RotatingBadge text="Get in touch • Get in touch • " size={190}>
                <span className="grid h-16 w-16 place-items-center rounded-full bg-red text-white">
                  <ArrowUpRight size={26} />
                </span>
              </RotatingBadge>
            </TLink>
          </div>
        </div>
      </div>
    </section>
  );
}
