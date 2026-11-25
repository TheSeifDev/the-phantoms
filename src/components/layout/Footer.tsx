import { ArrowUpRight, Code2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { TLink } from "@/components/layout/PageTransition";
import { Logo } from "@/components/ui/Brand";
import { nav, site } from "@/data/site";
import { BackToTop } from "@/components/layout/BackToTop";
import { FooterClock, FooterForm } from "@/components/layout/FooterBits";

const cols = [
  {
    title: "Explore",
    links: [{ href: "/", label: "Home" }, ...nav],
  },
  {
    title: "What we build",
    links: [
      { href: "/services", label: "Websites" },
      { href: "/services", label: "Apps" },
      { href: "/services", label: "SaaS" },
      { href: "/flagship/rafiq", label: "RAFIQ" },
      { href: "/flagship/omni", label: "OMNI" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden pb-4 pt-8">
      <div className="wrap">
        <div className="grid gap-3 lg:grid-cols-12">
          {/* Brand card */}
          <div data-spot className="card relative flex min-h-[26rem] flex-col justify-between overflow-hidden p-7 sm:p-9 lg:col-span-6">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(255,36,24,.32), transparent 65%)" }}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Logo size={48} />
                <div>
                  <div className="font-display text-2xl font-extrabold tracking-[-0.04em]">PHANTOMS</div>
                  <div className="mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">Product team · Alexandria</div>
                </div>
              </div>
              <div className="mono flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.12em]">
                <span className="pulse-dot h-2 w-2 rounded-full bg-[#2bd96b]" style={{ boxShadow: "0 0 0 0 rgba(43,217,107,.6)" }} />
                Open for projects
              </div>
            </div>

            <div className="relative mt-10">
              <h3 className="font-display tight max-w-[14ch] text-[clamp(2rem,4.2vw,3.4rem)] font-extrabold">
                Let&apos;s build something <span className="serif-i text-red">worth</span> shipping.
              </h3>
              <p className="ar mt-3 text-lg text-muted">فريق شغله بيتكلم عنه.</p>
              <FooterForm />
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
            {cols.map((c) => (
              <div key={c.title} data-spot className="card p-7">
                <div className="label">{c.title}</div>
                <ul className="mt-6 space-y-1">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <TLink
                        href={l.href}
                        className="group font-display flex items-center justify-between py-1.5 text-[1.45rem] font-bold tracking-[-0.04em] transition-colors hover:text-red"
                      >
                        {l.label}
                        <ArrowUpRight size={18} className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                      </TLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div data-spot className="card flex flex-col justify-between p-7 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="label">Reach us</div>
                <FooterClock />
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  { icon: Mail, t: site.email, href: `mailto:${site.email}` },
                  { icon: MessageCircle, t: "WhatsApp", href: site.whatsapp },
                  { icon: Phone, t: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
                  { icon: Code2, t: "GitHub · ThePhantoms", href: site.github },
                ].map((c) => (
                  <a
                    key={c.t}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-line px-4 py-3 text-sm font-semibold transition-colors hover:border-red hover:bg-red/10"
                  >
                    <c.icon size={16} className="text-red" />
                    <span className="truncate">{c.t}</span>
                    <ArrowUpRight size={14} className="ml-auto opacity-40 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
              </div>
              <div className="mono mt-5 flex items-center gap-2 text-[0.68rem] text-muted">
                <MapPin size={13} className="text-red" /> {site.location} · {site.coords}
              </div>
            </div>
          </div>
        </div>

        {/* giant wordmark */}
        <div aria-hidden className="relative mt-6 select-none overflow-hidden text-center">
          <div
            className="font-display font-extrabold leading-[0.8] tracking-[-0.07em]"
            style={{
              fontSize: "clamp(3rem,16.4vw,21rem)",
              background: "linear-gradient(180deg, color-mix(in srgb, var(--fg) 24%, transparent) 0%, transparent 82%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            PHANTOMS
          </div>
        </div>

        <div className="mono flex flex-col items-center justify-between gap-3 border-t border-line pt-5 text-[0.68rem] uppercase tracking-[0.14em] text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Phantoms · All rights reserved</span>
          <span className="normal-case tracking-normal">
            Built in the shadows. Felt everywhere. <span className="jp ml-2 opacity-60">ファントムズ</span>
          </span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
