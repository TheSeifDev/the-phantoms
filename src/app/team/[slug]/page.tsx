import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { members } from "@/data/projects";
import { teamPhotos } from "@/lib/media";
import { PageHero } from "@/components/sections/PageHero";
import { MemberVisual } from "@/components/sections/TeamWall";
import { CTA } from "@/components/sections/CTA";
import { TLink } from "@/components/layout/PageTransition";
import { Fade, Label } from "@/components/ui";

export function generateStaticParams() {
  return members.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = members.find((item) => item.slug === slug);
  return member ? { title: `${member.name} · Team`, description: `${member.role} in the ${member.squad} track at Phantoms.` } : {};
}

export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = members.find((item) => item.slug === slug);
  if (!member) notFound();

  const photos = teamPhotos();
  const index = members.findIndex((item) => item.slug === member.slug);
  const previous = members[(index - 1 + members.length) % members.length];
  const next = members[(index + 1) % members.length];
  const peers = members.filter((item) => item.squad === member.squad && item.slug !== member.slug).slice(0, 4);

  return (
    <>
      <PageHero label={`${member.id} / ${member.squad}`} title={member.name} ar={member.placeholder ? "فانتوم من الفريق." : "المؤسس اللي بيحط المعيار."}>
        {member.role} — one of the people making Phantoms useful, sharp and ready to ship.
      </PageHero>

      <section className="pb-20 sm:pb-28">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            <Fade>
              <div className="edge-glow relative overflow-hidden rounded-[2rem] border border-line bg-card p-2 shadow-[0_0_80px_-30px_rgba(255,36,24,.5)]">
                <div className="relative aspect-[0.82] overflow-hidden rounded-[1.55rem] bg-surface"><MemberVisual member={member} src={photos[member.slug]} className="absolute inset-0 h-full w-full" /><div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4"><div><span className="mono text-[0.58rem] uppercase tracking-[0.2em] text-white/55">Phantom identity</span><p className="font-display mt-2 text-2xl font-extrabold tracking-[-0.06em] text-white">{member.name}</p></div><span className="hex-flat grid h-14 w-14 shrink-0 place-items-center border border-red/70 bg-red/20 mono text-[0.58rem] font-bold text-red">{member.id}</span></div></div>
              </div>
            </Fade>

            <Fade delay={0.1} className="flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2"><span className="chip !border-red/50 !text-red">{member.squad}</span><span className="chip">{member.handle}</span>{member.lead && <span className="chip !border-red/50 !text-red">Founder</span>}</div>
                <h2 className="font-display tight mt-7 max-w-[11ch] text-[clamp(2.8rem,6vw,6rem)] font-extrabold">Built for the <span className="serif-i text-red">edge.</span></h2>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">{member.bio}</p>
              </div>
              <div className="mt-12 grid gap-5 border-y border-line py-5 sm:grid-cols-2">
                <div><Label>Track</Label><p className="mt-2 font-display text-xl font-bold tracking-[-0.04em]">{member.squad}</p></div>
                <div><Label>Phantom ID</Label><p className="mono mt-2 text-xl font-bold text-red">{member.id}</p></div>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {member.link ? <a href={member.link} target="_blank" rel="noreferrer" className="btn btn-red"><span>Visit link</span><span className="btn-icon"><ExternalLink size={16} /></span></a> : <TLink href="/contact" className="btn btn-red"><span>Work with us</span><span className="btn-icon"><ArrowUpRight size={16} /></span></TLink>}
                <TLink href="/team" className="btn btn-ghost"><span>All members</span><span className="btn-icon"><ArrowUpRight size={16} /></span></TLink>
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {peers.length > 0 && <section className="pb-24">
        <div className="wrap">
          <div className="mb-7 flex items-end justify-between gap-4"><div><Label>Other members in this track</Label><h2 className="font-display tight mt-4 text-[clamp(2.3rem,4vw,4rem)] font-extrabold">More <span className="serif-i text-red">{member.squad}</span>.</h2></div><span className="mono hidden text-[0.6rem] uppercase tracking-[0.18em] text-muted sm:block">{peers.length} nearby</span></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{peers.map((peer) => <TLink key={peer.slug} href={`/team/${peer.slug}`} className="group overflow-hidden rounded-[1.35rem] border border-line bg-card p-2 transition hover:-translate-y-1 hover:border-red/60"><MemberVisual member={peer} src={photos[peer.slug]} className="aspect-[0.82] rounded-[1rem] brightness-75 transition duration-500 group-hover:brightness-100" /><span className="block px-2 pb-2 pt-3"><span className="block font-display text-lg font-bold tracking-[-0.05em]">{peer.name}</span><span className="mt-1 block truncate text-[0.63rem] text-muted">{peer.role}</span></span></TLink>)}</div>
        </div>
      </section>}

      <section className="pb-24">
        <div className="wrap"><div className="grid gap-3 sm:grid-cols-2"><TLink href={`/team/${previous.slug}`} className="group rounded-[1.5rem] border border-line bg-card p-5 transition hover:border-red/60"><span className="mono flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.18em] text-muted"><ArrowLeft size={14} /> Previous phantom</span><span className="mt-5 block font-display text-2xl font-extrabold tracking-[-0.06em] transition group-hover:text-red">{previous.name}</span><span className="mt-1 block text-xs text-muted">{previous.role}</span></TLink><TLink href={`/team/${next.slug}`} className="group rounded-[1.5rem] border border-line bg-card p-5 text-right transition hover:border-red/60"><span className="mono flex items-center justify-end gap-2 text-[0.58rem] uppercase tracking-[0.18em] text-muted">Next phantom <ArrowRight size={14} /></span><span className="mt-5 block font-display text-2xl font-extrabold tracking-[-0.06em] transition group-hover:text-red">{next.name}</span><span className="mt-1 block text-xs text-muted">{next.role}</span></TLink></div></div>
      </section>
      <CTA />
    </>
  );
}
