"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { nav } from "@/data/site";

type Ctx = { go: (href: string) => void };
const TransitionContext = createContext<Ctx>({ go: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const labelFor = (href: string) => {
  const base = "/" + (href.split("/")[1] ?? "");
  return nav.find((n) => n.href === base) ?? { label: href === "/" ? "Home" : "Phantoms" };
};

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const kanji = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const busy = useRef(false);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  const play_out = useCallback(() => {
    const el = panel.current;
    if (!el) return;
    gsap.to(el, {
      yPercent: -100,
      duration: 0.9,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(el, { yPercent: 100 });
        pending.current = false;
        busy.current = false;
      },
    });
    gsap.fromTo(
      [kanji.current, word.current],
      { opacity: 1 },
      { opacity: 0, duration: 0.4, delay: 0.1 },
    );
  }, []);

  // route changed → reveal the new page
  useEffect(() => {
    if (!pending.current) return;
    if (safety.current) clearTimeout(safety.current);
    window.scrollTo(0, 0);
    const t = setTimeout(play_out, 120);
    return () => clearTimeout(t);
  }, [pathname, play_out]);

  const go = useCallback(
    (href: string) => {
      if (busy.current) return;
      const target = href.split("#")[0].split("?")[0] || "/";
      if (target === pathname || prefersReducedMotion() || !panel.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      pending.current = true;
      const l = labelFor(target);
      if (word.current) word.current.textContent = l.label;
      gsap.set(panel.current, { yPercent: 100 });
      gsap.to(panel.current, {
        yPercent: 0,
        duration: 0.8,
        ease: "expo.inOut",
        onComplete: () => router.push(href),
      });
      gsap.fromTo(
        [kanji.current, word.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.35, stagger: 0.08, ease: "expo.out" },
      );
      // never get stuck on the wipe
      safety.current = setTimeout(play_out, 4000);
    },
    [pathname, router, play_out],
  );

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div
        ref={panel}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] grid place-items-center overflow-hidden bg-red text-white"
        style={{ transform: "translateY(100%)", borderRadius: "50% 50% 0 0 / 8% 8% 0 0" }}
      >
        <div className="text-center">
          <div ref={kanji} className="mx-auto mb-5 h-14 w-14">
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <path d="M100 8 L180 54 L180 146 L100 192 L20 146 L20 54 Z" fill="none" stroke="#fff" strokeWidth="9" strokeLinejoin="round" />
            </svg>
          </div>
          <div
            ref={word}
            className="font-display text-[clamp(2.4rem,9vw,6rem)] font-extrabold uppercase leading-none tracking-[-0.05em]"
          />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

/** Internal link that plays the page-transition wipe. External links render normally. */
export function TLink({ href, children, onClick, ...rest }: Props) {
  const { go } = usePageTransition();
  const external = /^(https?:|mailto:|tel:)/.test(href);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (href.startsWith("#")) return;
    e.preventDefault();
    go(href);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
