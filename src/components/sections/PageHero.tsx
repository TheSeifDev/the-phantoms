import type { ReactNode } from "react";
import { Fade, Label, Reveal } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";

export function PageHero({
  label,
  title,
  ar,
  children,
}: {
  label: string;
  title: ReactNode;
  ar?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-36 sm:pt-44">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob-glow left-1/2 top-[-18%] h-[28rem] w-[56rem] -translate-x-1/2" style={{ background: "radial-gradient(closest-side, rgba(255,36,24,.26), transparent)" }} />
        <div className="absolute -right-10 top-24 text-red/35">
          <HexOutline size={190} />
        </div>
        <div className="absolute right-[18%] top-52 hidden text-fg/10 md:block">
          <HexOutline size={70} />
        </div>
      </div>
      <div className="wrap relative">
        <Label>{label}</Label>
        <Reveal immediate as="h1" className="font-display tight mt-7 max-w-[16ch] text-[clamp(3rem,9vw,8.4rem)] font-extrabold">
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
