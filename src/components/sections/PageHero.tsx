import type { ReactNode } from "react";
import { Fade, Label, Reveal } from "@/components/ui";

export function PageHero({
  label,
  title,
  ar,
  children,
  kanji,
}: {
  label: string;
  title: ReactNode;
  ar?: string;
  children?: ReactNode;
  kanji?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 sm:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,36,24,.35), transparent 65%)" }}
      />
      {kanji && (
        <span className="jp pointer-events-none absolute -right-[2%] top-[8%] select-none text-[min(48vw,30rem)] leading-none text-fg/[0.04]">
          {kanji}
        </span>
      )}
      <div className="wrap relative">
        <Label>{label}</Label>
        <Reveal immediate as="h1" className="font-display tight mt-7 max-w-[16ch] text-[clamp(3rem,9.5vw,9rem)] font-extrabold">
          {title}
        </Reveal>
        {ar && (
          <Fade delay={0.3}>
            <p className="ar mt-6 text-[clamp(1.2rem,2.4vw,2rem)] font-semibold">{ar}</p>
          </Fade>
        )}
        {children && (
          <Fade delay={0.4} className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            {children}
          </Fade>
        )}
      </div>
    </section>
  );
}
