import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Code2, ExternalLink } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { CTA } from "@/components/sections/CTA";
import { Fade, Label, ProjectCover, Reveal } from "@/components/ui";
import { TLink } from "@/components/layout/PageTransition";

export function generateStaticParams() {
  return projects.filter((project) => !project.flagship).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return project ? { title: `${project.title} case study`, description: project.tagline } : {};
}

function BrowserFrame({ project, compact = false }: { project: NonNullable<ReturnType<typeof getProject>>; compact?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[1.7rem] border border-white/15 bg-[#0b0b0e] p-2 shadow-[0_34px_100px_-48px_rgba(255,36,24,.65)] ${compact ? "" : "ring-1 ring-white/5"}`}>
      <div className="flex h-9 items-center gap-1.5 rounded-t-[1.1rem] border-b border-white/10 bg-[#17171c] px-4"><span className="h-2 w-2 rounded-full bg-[#ff5a52]" /><span className="h-2 w-2 rounded-full bg-[#f2b84b]" /><span className="h-2 w-2 rounded-full bg-[#2bc96f]" /><span className="mono ml-3 flex-1 truncate rounded-md bg-white/[.06] px-3 py-1 text-[0.52rem] text-white/35">{project.slug}.product</span></div>
      <div className={compact ? "h-52 overflow-hidden rounded-b-[1.1rem]" : "h-[min(62vw,39rem)] min-h-[22rem] overflow-hidden rounded-b-[1.1rem]"}><ProjectCover p={project} fit="top" className="object-top" /></div>
    </div>
  );
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.flagship) notFound();
  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const archiveNext = next.flagship ? projects.find((item) => !item.flagship) ?? next : next;

  return (
    <>
      <section className="relative overflow-hidden bg-[#0b0b0e] pb-14 pt-32 text-white sm:pb-20 sm:pt-40">
        <div className="aura -right-40 top-20 h-[28rem] w-[28rem] opacity-25" />
        <div className="wrap relative">
          <div className="flex flex-wrap items-center justify-between gap-4"><span className="label !text-white/55">Case study / {project.types.join(" · ")}</span><span className="mono text-[0.62rem] uppercase tracking-[0.16em] text-white/45">{project.year}</span></div>
          <Reveal immediate as="h1" className="font-display tight mt-8 max-w-[12ch] text-[clamp(3.8rem,10vw,10rem)] font-extrabold tracking-[-0.08em]">{project.title}<span className="text-red">.</span></Reveal>
          <Fade delay={0.3} className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.35rem)] leading-relaxed text-white/65">{project.tagline}</Fade>
          <Fade delay={0.4} className="mt-12"><BrowserFrame project={project} /></Fade>
        </div>
      </section>

      <main className="relative overflow-hidden py-16 sm:py-24">
        <div className="wrap">
          <section className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <Fade><div className="lg:sticky lg:top-28"><Label>Overview / the brief</Label><p className="mt-5 text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.04em]">{project.summary}</p></div></Fade>
            <Fade delay={0.1}><div className="grid gap-3 sm:grid-cols-2"><div className="card p-5"><span className="label">Role</span><p className="mt-3 text-sm font-medium leading-relaxed">{project.role}</p></div><div className="card p-5"><span className="label">Timeline</span><p className="mt-3 text-sm font-medium leading-relaxed">{project.year}</p></div><div className="card p-5"><span className="label">Status</span><p className="mt-3 text-sm font-medium leading-relaxed">{project.status}</p></div><div className="card p-5"><span className="label">Stack</span><div className="mt-3 flex flex-wrap gap-1.5">{project.stack.map((item) => <span key={item} className="chip">{item}</span>)}</div></div></div></Fade>
          </section>

          <section className="mt-24 grid gap-5 border-t border-line pt-10 sm:mt-32 sm:grid-cols-3">
            {[{ n: "01", title: "Challenge", body: project.challenge }, { n: "02", title: "Approach", body: project.solution }, { n: "03", title: "Result", body: project.highlights.join(" · ") }].map((item) => <Fade key={item.n}><article className="h-full border-l-2 border-red/45 pl-5"><span className="mono text-xs text-red">{item.n}</span><h2 className="font-display mt-5 text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">{item.title}</h2><p className="mt-4 text-sm leading-relaxed text-muted">{item.body}</p></article></Fade>)}
          </section>

          <section className="mt-24 sm:mt-32"><div className="flex items-end justify-between gap-6"><div><Label>Selected frames</Label><h2 className="font-display tight mt-5 max-w-[9ch] text-[clamp(2.7rem,6vw,5.8rem)] font-extrabold">The work, <span className="serif-i text-red">in use.</span></h2></div><span className="mono hidden text-[0.62rem] uppercase tracking-[0.16em] text-muted sm:block">Interface / system / detail</span></div><div className="mt-10 grid gap-4 md:grid-cols-[1.25fr_.75fr]"><Fade><BrowserFrame project={project} /></Fade><div className="flex flex-col gap-4"><Fade delay={0.08}><BrowserFrame project={project} compact /></Fade><Fade delay={0.16}><div className="card flex flex-1 flex-col justify-between p-6"><span className="label">What shipped</span><ul className="mt-6 space-y-4">{project.highlights.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed"><Check size={16} className="mt-0.5 shrink-0 text-red" />{item}</li>)}</ul></div></Fade></div></div></section>

          <section className="mt-20 flex flex-wrap gap-3 border-y border-line py-7"><span className="label mr-2">Keep exploring</span>{project.url && <a href={project.url} target="_blank" rel="noreferrer" className="btn btn-red"><span>Visit live</span><span className="btn-icon"><ExternalLink size={15} /></span></a>}{project.repo && <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn-ghost"><span>Source</span><span className="btn-icon"><Code2 size={15} /></span></a>}</section>

          <TLink href={archiveNext.flagship ? `/flagship/${archiveNext.slug}` : `/work/${archiveNext.slug}`} data-cursor="NEXT" className="group mt-20 flex items-center justify-between gap-6 border-b border-line pb-10 sm:mt-28"><div><span className="label">Next project</span><div className="font-display mt-4 text-[clamp(2.8rem,8vw,7rem)] font-extrabold leading-none tracking-[-0.07em] transition-colors group-hover:text-red">{archiveNext.title}</div></div><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-red group-hover:bg-red group-hover:text-white"><ArrowUpRight size={20} /></span></TLink>
          <TLink href="/work" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-fg"><ArrowLeft size={15} /> Back to all work</TLink>
        </div>
      </main>
      <CTA />
    </>
  );
}
