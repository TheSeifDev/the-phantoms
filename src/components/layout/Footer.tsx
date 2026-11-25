import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { TLink } from "@/components/layout/PageTransition";
import { Logo } from "@/components/ui/Brand";
import { nav, site } from "@/data/site";
import { BackToTop } from "@/components/layout/BackToTop";

export function Footer() {
  return (
    <footer className="relative overflow-hidden pb-4 pt-10">
      <div className="wrap">
        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          {/* Brand card */}
          <div className="relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-line bg-surface p-7 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(255,36,24,.35), transparent 65%)" }}
            />
            <div className="relative flex items-center gap-3">
              <Logo size={46} />
              <div>
                <div className="font-display text-2xl font-extrabold tracking-[-0.04em]">PHANTOMS</div>
                <div className="jp text-xs text-muted">ファントムズ · 幻影</div>
              </div>
            </div>
            <div className="relative mt-10 max-w-md">
              <p className="text-lg leading-snug">
                A product team from Alexandria. We design, build and ship web, apps and SaaS —
                quietly, then loudly.
              </p>
              <p className="ar mt-3 text-base text-muted">فريق شغله بيتكلم عنه.</p>
            </div>
            <div className="relative mt-10 flex flex-wrap gap-2">
              {[{ href: "/", label: "Home" }, ...nav, { href: "/flagship/rafiq", label: "RAFIQ" }, { href: "/flagship/omni", label: "OMNI" }].map(
                (n) => (
                  <TLink
                    key={n.href}
                    href={n.href}
                    className="chip transition-colors hover:border-red hover:text-fg"
                  >
                    {n.label}
                  </TLink>
                ),
              )}
            </div>
          </div>

          {/* Contact card */}
          <div className="flex min-h-[22rem] flex-col justify-between rounded-[2rem] border border-line bg-surface p-7 sm:p-9">
            <div>
              <span className="label">Say hello</span>
              <a
                href={`mailto:${site.email}`}
                className="font-display link-u mt-4 block break-all text-2xl font-bold tracking-[-0.03em] sm:text-3xl"
                data-cursor="EMAIL"
              >
                {site.email}
              </a>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-red" />
                <a href={site.whatsapp} target="_blank" rel="noreferrer" className="link-u hover:text-fg">
                  {site.phone} · WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={15} className="text-red" /> {site.location} · {site.coords}
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-red" />
                <a href={site.github} target="_blank" rel="noreferrer" className="link-u hover:text-fg">
                  github.com/ThePhantoms <ArrowUpRight size={12} className="inline" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="relative mt-6 select-none overflow-hidden" aria-hidden>
          <div
            className="font-display text-center font-extrabold uppercase leading-[0.78] tracking-[-0.06em]"
            style={{
              fontSize: "clamp(3rem, 16.4vw, 21rem)",
              background: "linear-gradient(180deg, var(--fg) 0%, transparent 92%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: 0.16,
              paddingBottom: "0.08em",
            }}
          >
            Phantoms
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-line pt-5 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Phantoms. All rights reserved.</span>
          <span className="jp">未来を創る — building the future, quietly.</span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
