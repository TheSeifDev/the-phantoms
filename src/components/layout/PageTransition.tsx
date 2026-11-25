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
import { prefersReducedMotion } from "@/lib/gsap";
import { hexWave } from "@/lib/hexwave";

type Ctx = { go: (href: string) => void };
const TransitionContext = createContext<Ctx>({ go: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

/** Same hexagon-block wave as the theme switch: floods from the top-centre, swaps the route underneath, dissolves. */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const resolver = useRef<(() => void) | null>(null);

  // route changed -> let the wave dissolve
  useEffect(() => {
    if (!resolver.current) return;
    window.scrollTo(0, 0);
    const r = resolver.current;
    resolver.current = null;
    const t = setTimeout(r, 160);
    return () => clearTimeout(t);
  }, [pathname]);

  const go = useCallback(
    (href: string) => {
      const target = href.split("#")[0].split("?")[0] || "/";
      if (target === pathname || prefersReducedMotion()) {
        router.push(href);
        return;
      }
      const bg = getComputedStyle(document.body).backgroundColor || "#08080a";
      hexWave({
        origin: { x: window.innerWidth / 2, y: 0 },
        cover: bg,
        onCovered: () => router.push(href),
        ready: () => new Promise<void>((res) => (resolver.current = res)),
      });
    },
    [pathname, router],
  );

  return <TransitionContext.Provider value={{ go }}>{children}</TransitionContext.Provider>;
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
