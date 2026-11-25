import { Marquee } from "@/components/ui";
import { marqueeTech } from "@/data/site";

export function MarqueeStrip() {
  return (
    <section className="relative py-10 sm:py-14" aria-label="Capabilities">
      <Marquee
        duration={55}
        itemClass="font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold uppercase tracking-[-0.05em] leading-[1.1]"
        items={[
          "Web",
          <span key="a" className="serif-i normal-case text-red">apps</span>,
          "SaaS",
          <span key="b" className="ar text-[0.7em] font-bold">ذكاء اصطناعي</span>,
          "Robotics",
          <span key="c" className="jp text-[0.8em] text-red">幻影</span>,
        ]}
        separator={<span className="h-3 w-3 rotate-45 bg-red" />}
      />
      <Marquee
        reverse
        duration={70}
        className="mt-4 border-y border-line py-4"
        itemClass="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-muted"
        items={marqueeTech}
        separator={<span className="h-1 w-1 rounded-full bg-muted/60" />}
      />
    </section>
  );
}
