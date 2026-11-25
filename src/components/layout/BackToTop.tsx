"use client";

import { ArrowUp } from "lucide-react";
import { useLenis } from "@/lib/lenis";

export function BackToTop() {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => {
        const l = lenis.get();
        if (l) l.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="group inline-flex items-center gap-2 uppercase tracking-[0.14em] transition-colors hover:text-fg"
    >
      Back to top
      <span className="grid h-7 w-7 place-items-center rounded-full border border-line transition-colors group-hover:border-red group-hover:bg-red group-hover:text-white">
        <ArrowUp size={13} />
      </span>
    </button>
  );
}
