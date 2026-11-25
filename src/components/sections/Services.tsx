"use client";

import { ArrowUpRight } from "lucide-react";
import { TLink } from "@/components/layout/PageTransition";
import { Fade, Label, Reveal } from "@/components/ui";
import { projects, services } from "@/data/projects";

function FolderCard({ s, i }: { s: (typeof services)[number]; i: number }) {
  const count = projects.filter((p) => p.types.includes(s.key)).length;
  return (
    <Fade delay={i * 0.1}>
      <TLink
        href={`/services#${s.key.toLowerCase()}`}
        className="folder group block transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2"
        data-cursor="MORE"
      >
        {/* header art */}
        <div className="relative h-[13rem] overflow-hidden rounded-[1.7rem] sm:h-[14rem]">
          <div
            className="absolute inset-[-20%] blur-2xl transition-transform duration-[1200ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-125 group-hover:rotate-6"
            style={{
              background: `radial-gradient(40% 50% at 25% 35%, ${s.hue[0]} 0%, transparent 70%), radial-gradient(45% 55% at 80% 70%, #ff9a3c 0%, transparent 70%), radial-gradient(35% 40% at 60% 20%, #fff 0%, transparent 70%), ${s.hue[1]}`,
            }}
          />
          <div className="grain absolute inset-0" />
          <div className="absolute right-6 top-5 text-right text-white">
            <div className="font-display text-xl font-bold leading-tight tracking-tight">
              Phantoms
              <br />
              {s.title}
            </div>
          </div>
          <span className="jp absolute -bottom-3 left-4 select-none text-7xl text-white/25">{s.kanji}</span>
        </div>

        {/* panel with folder tab */}
        <div className="relative -mt-4 min-h-[19rem] rounded-[1.7rem] rounded-tl-none bg-[#1c1c20] p-6 text-white">
          <span className="folder-tab" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-xl font-bold tracking-tight">{s.title}</div>
              <div className="ar mt-1 text-base text-white/50">{s.ar}</div>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-red group-hover:bg-red">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/60">{s.line}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {s.stack.map((t) => (
              <li key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/55">
                {t}
              </li>
            ))}
          </ul>
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
            <div className="font-display flex items-end gap-2">
              <span className="text-6xl font-semibold leading-[0.8] tracking-[-0.05em]">{s.n}</span>
              <span className="mb-0.5 text-sm text-white/50">{s.title}</span>
            </div>
            <span className="text-sm font-bold">
              {count} {count === 1 ? "case" : "cases"}
            </span>
          </div>
        </div>
      </TLink>
    </Fade>
  );
}

export function Services({ bare = false }: { bare?: boolean }) {
  return (
    <section className={`relative ${bare ? "pb-10 pt-4" : "py-24 sm:py-32"}`} id="services">
      <div className="wrap">
        {!bare && (
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <Label>Services · 技</Label>
            <Reveal as="h2" className="font-display tight mt-6 text-[clamp(2.8rem,8vw,7.5rem)] font-extrabold">
              Three ways we <span className="serif-i text-red">build</span>.
            </Reveal>
          </div>
          <Fade className="max-w-sm">
            <p className="ar text-xl font-semibold">مواقع، تطبيقات، وأنظمة SaaS.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pick a lane — or combine them. Every product ships with design, engineering and launch
              support from one team.
            </p>
          </Fade>
        </div>
        )}

        <div className={`${bare ? "" : "mt-16"} grid gap-4 lg:grid-cols-3`}>
          {services.map((s, i) => (
            <FolderCard key={s.key} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { FolderCard };
