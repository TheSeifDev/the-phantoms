"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { TLink } from "@/components/layout/PageTransition";
import { Logo, ThemeToggle } from "@/components/ui/Brand";
import { Button } from "@/components/ui";
import { nav, site } from "@/data/site";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 240);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    if (open) {
      lenis.get()?.stop();
      document.body.style.overflow = "hidden";
      gsap.to(el, { clipPath: "circle(150% at 92% 4%)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(
        el.querySelectorAll("[data-m]"),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, delay: 0.35, ease: "expo.out" },
      );
    } else {
      lenis.get()?.start();
      document.body.style.overflow = "";
      gsap.to(el, { clipPath: "circle(0% at 92% 4%)", duration: 0.6, ease: "expo.inOut" });
    }
  }, [open, lenis]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hidden && !open ? "-translate-y-[130%]" : "translate-y-0"
        }`}
      >
        <div className="wrap pt-3 sm:pt-4">
          <div
            className={`flex items-center justify-between rounded-full border px-3 py-2 pl-4 transition-all duration-500 ${
              scrolled
                ? "border-line bg-bg/70 backdrop-blur-xl"
                : "border-transparent bg-transparent"
            }`}
          >
            <TLink href="/" className="flex items-center gap-3" data-cursor="HOME">
              <Logo size={38} />
              <span className="font-display text-lg font-extrabold tracking-[-0.04em] text-white mix-blend-difference">
                PHANTOMS
              </span>
              <span className="jp hidden text-xs text-muted sm:inline">幻影</span>
            </TLink>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {nav.map((n) => (
                <TLink
                  key={n.href}
                  href={n.href}
                  className={`group relative overflow-hidden rounded-full px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    active(n.href) ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  <span className="relative block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                    {n.label}
                  </span>
                  <span className="jp absolute inset-0 grid translate-y-full place-items-center text-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                    {n.jp}
                  </span>
                  {active(n.href) && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red" />
                  )}
                </TLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="hidden sm:block">
                <Button href="/contact" variant="red" className="!h-10 !text-[0.68rem]">
                  Start a project
                </Button>
              </div>
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        ref={menu}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-bg px-6 pb-8 pt-28 md:hidden"
        style={{ clipPath: "circle(0% at 92% 4%)" }}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-2">
          {[{ href: "/", label: "Home", jp: "家" }, ...nav].map((n, i) => (
            <TLink
              key={n.href}
              href={n.href}
              data-m
              className="font-display flex items-baseline justify-between border-b border-line py-4 text-5xl font-extrabold tracking-[-0.04em]"
            >
              <span>{n.label}</span>
              <span className="jp text-lg text-red">
                {String(i + 1).padStart(2, "0")} {n.jp}
              </span>
            </TLink>
          ))}
        </div>
        <div data-m className="space-y-4">
          <p className="ar text-2xl font-semibold">عندك فكرة؟ خلينا نبنيها.</p>
          <p className="text-sm text-muted">{site.email}</p>
        </div>
      </div>
    </>
  );
}
