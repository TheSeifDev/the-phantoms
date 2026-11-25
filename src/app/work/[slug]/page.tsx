import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Code2 } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { PageHero } from "@/components/sections/PageHero";
import { CTA } from "@/components/sections/CTA";
import { Fade, Label, ProjectCover } from "@/components/ui";
import { TLink } from "@/components/layout/PageTransition";

export function generateStaticParams() {
  return projects.filter((p) => !p.flagship).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: p.title, description: p.tagline } : {};
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <PageHero label={`${p.types.join(" · ")} · ${p.year}`} title={p.title} kanji={p.kanji}>
        {p.tagline}
      </PageHero>

      <section className="pb-10">
        <div className="wrap">
          <Fade>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-line bg-surface sm:aspect-[16/8]">
              <ProjectCover p={p} fit="top" />
            </div>
          </Fade>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <Fade>
              <dl className="space-y-6 lg:sticky lg:top-28">
                {[
                  ["Role", p.role],
                  ["Status", p.status],
                  ["Year", p.year],
                ].map(([k, v]) => (
                  <div key={k} className="dotted pb-4">
                    <dt className="label">{k}</dt>
                    <dd className="mt-2 text-base font-medium">{v}</dd>
                  </div>
                ))}
                <div>
                  <dt className="label">Stack</dt>
                  <dd className="mt-3 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span key={s} className="chip">{s}</span>
                    ))}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-red" data-cursor="LIVE">
                      <span>Visit live</span>
                      <span className="btn-icon"><ArrowUpRight size={16} /></span>
                    </a>
                  )}
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-ghost">
                      <span>Source</span>
                      <span className="btn-icon"><Code2 size={16} /></span>
                    </a>
                  )}
                </div>
              </dl>
            </Fade>

            <div className="space-y-14">
              <Fade>
                <p className="font-display text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
                  {p.summary}
                </p>
              </Fade>
              <Fade>
                <Label>The challenge</Label>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{p.challenge}</p>
              </Fade>
              <Fade>
                <Label>Our approach</Label>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{p.solution}</p>
              </Fade>
              <Fade>
                <Label>Highlights</Label>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {p.highlights.map((h, i) => (
                    <li key={h} className="rounded-2xl border border-line bg-surface p-5">
                      <span className="font-display text-sm font-bold text-red">{String(i + 1).padStart(2, "0")}</span>
                      <p className="mt-2 text-sm font-medium leading-snug">{h}</p>
                    </li>
                  ))}
                </ul>
              </Fade>
            </div>
          </div>

          <TLink
            href={next.flagship ? `/flagship/${next.slug}` : `/work/${next.slug}`}
            data-cursor="NEXT"
            className="group mt-24 flex items-center justify-between gap-6 border-y border-line py-10"
          >
            <div>
              <span className="label">Next project</span>
              <div className="font-display mt-3 text-[clamp(2.4rem,7vw,6rem)] font-extrabold leading-none tracking-[-0.05em] transition-colors group-hover:text-red">
                {next.title}
              </div>
            </div>
            <span className="jp text-[clamp(3rem,9vw,8rem)] leading-none text-fg/10 transition-colors group-hover:text-red/60">{next.kanji}</span>
          </TLink>
        </div>
      </section>
      <CTA />
    </>
  );
}
