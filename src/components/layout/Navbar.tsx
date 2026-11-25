"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useReady } from "@/lib/ready";
import { TLink } from "@/components/layout/PageTransition";
import { Logo, ThemeToggle } from "@/components/ui/Brand";
import { CommandMenu, openCommand } from "@/components/layout/CommandMenu";
import { nav, site } from "@/data/site";

export function Navbar() {
  const pathname = usePathname();
  const ready = useReady();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const ind = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLDivElement>(null);

  // entrance once the loader is done
  useEffect(() => {
    if (!bar.current) return;
    if (!ready || prefersReducedMotion()) {
      if (ready) gsap.set(bar.current, { opacity: 1 });
      return;
    }
    gsap.fromTo(bar.current, { yPercent: -160, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay: 0.2 });
  }, [ready]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // sliding active indicator
  useEffect(() => {
    const wrap = list.current;
    const el = ind.current;
    if (!wrap || !el) return;
    const place = (target?: HTMLElement | null, instant = false) => {
      if (!target) {
        gsap.to(el, { opacity: 0, duration: 0.3 });
        return;
      }
      const w = wrap.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      gsap.to(el, { x: r.left - w.left, width: r.width, opacity: 1, duration: instant ? 0 : 0.5, ease: "expo.out" });
    };
    const active = () => wrap.querySelector<HTMLElement>(`[data-href="/${pathname.split("/")[1]}"]`);
    place(active(), true);
    const links = wrap.querySelectorAll<HTMLElement>("[data-href]");
    const enter = (e: Event) => place(e.currentTarget as HTMLElement);
    const out = () => place(active());
    links.forEach((l) => l.addEventListener("pointerenter", enter));
    wrap.addEventListener("pointerleave", out);
    return () => {
      links.forEach((l) => l.removeEventListener("pointerenter", enter));
      wrap.removeEventListener("pointerleave", out);
    };
  }, [pathname]);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // mobile menu animation
  const first = useRef(true);
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    if (first.current) {
      first.current = false;
      return;
    }
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) {
      gsap.set(m, { display: "flex" });
      gsap.fromTo(m, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(m.querySelectorAll("[data-m]"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, delay: 0.3, ease: "expo.out" });
    } else {
      gsap.to(m, { clipPath: "circle(0% at 92% 4%)", duration: 0.6, ease: "expo.inOut", onComplete: () => void gsap.set(m, { display: "none" }) });
    }
  }, [open]);

  return (
    <>
      <header ref={bar} className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4" style={{ opacity: 0 }}>
        <nav
          aria-label="Primary"
          className={`pill-nav pointer-events-auto flex items-center gap-1 rounded-full p-1.5 pl-2 transition-shadow duration-500 ${
            scrolled ? "shadow-[0_12px_40px_-12px_rgba(0,0,0,.6)]" : ""
          }`}
        >
          <TLink href="/" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3" data-cursor="HOME" aria-label="Phantoms home">
            <Logo size={32} />
            <span className="font-display text-[0.95rem] font-extrabold tracking-[-0.03em]">PHANTOMS</span>
          </TLink>

          <div ref={list} className="relative ml-1 hidden items-center lg:flex">
            <span ref={ind} className="absolute inset-y-0 left-0 rounded-full bg-fg/[0.08]" style={{ opacity: 0, width: 0 }} />
            {nav.map((n) => (
              <TLink
                key={n.href}
                href={n.href}
                data-href={n.href}
                className="relative rounded-full px-4 py-2.5 text-[0.8rem] font-semibold tracking-[0.01em] text-fg/80 transition-colors hover:text-fg"
              >
                {n.label}
              </TLink>
            ))}
          </div>

          <div className="ml-2 hidden items-center gap-1.5 lg:flex">
            <button
              type="button"
              onClick={openCommand}
              aria-label="Open command menu"
              className="mono flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-[0.7rem] text-muted transition-colors hover:border-red hover:text-fg"
            >
              <Command size={13} /> K
            </button>
            <ThemeToggle />
            <TLink
              href="/contact"
              data-magnet="0.15"
              data-cursor="TALK"
              className="group flex h-10 items-center gap-2 rounded-full bg-fg pl-5 pr-1.5 text-[0.8rem] font-bold text-bg transition-colors hover:bg-red hover:text-white"
            >
              Let&apos;s talk
              <span className="grid h-7 w-7 place-items-center rounded-full bg-red text-white transition-colors group-hover:bg-white group-hover:text-red">
                <ArrowUpRight size={14} strokeWidth={2.6} />
              </span>
            </TLink>
          </div>

          <div className="ml-2 flex items-center gap-1.5 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full bg-fg text-bg"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* mobile fullscreen menu */}
      <div
        ref={menu}
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-bg px-6 pb-8 pt-28 lg:hidden"
        style={{ clipPath: "circle(0% at 92% 4%)" }}
      >
        <div className="relative flex flex-col">
          {[{ href: "/", label: "Home" }, ...nav].map((n, i) => (
            <TLink
              key={n.href}
              href={n.href}
              data-m
              className="font-display flex items-baseline gap-4 border-b border-line py-3.5 text-[clamp(2.2rem,10vw,3.6rem)] font-extrabold tracking-[-0.05em]"
            >
              <span className="mono text-xs font-normal text-red">0{i + 1}</span>
              {n.label}
            </TLink>
          ))}
        </div>
        <div data-m className="relative space-y-3">
          <TLink href="/contact" className="btn btn-red w-full justify-between">
            <span>Start a project</span>
            <span className="btn-icon">
              <ArrowUpRight size={16} />
            </span>
          </TLink>
          <p className="ar text-center text-lg">عندك فكرة؟ خلينا نبنيها.</p>
          <p className="mono text-center text-xs text-muted">{site.email}</p>
        </div>
      </div>
      <CommandMenu />
    </>
  );
}
