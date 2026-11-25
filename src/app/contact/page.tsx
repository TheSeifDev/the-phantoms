import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Fade } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Phantoms — tell us about your idea and we'll reply within one working day.",
};

export default function ContactPage() {
  const items = [
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: MessageCircle, label: "WhatsApp", value: site.phone, href: site.whatsapp },
    { icon: Phone, label: "Call", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Studio", value: site.location, href: undefined },
  ];
  return (
    <>
      <PageHero label="Contact · 連絡" title={<>Let&apos;s build <span className="serif-i text-red">it</span></>} ar="عندك فكرة؟ خلينا نبنيها." kanji="連" />
      <section className="pb-24 sm:pb-32">
        <div className="wrap grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Fade>
            <ContactForm />
          </Fade>
          <Fade delay={0.1}>
            <aside className="space-y-3">
              {items.map((it) => {
                const inner = (
                  <>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-red/15 text-red">
                      <it.icon size={18} />
                    </span>
                    <span>
                      <span className="label block">{it.label}</span>
                      <span className="mt-1 block break-all text-sm font-semibold">{it.value}</span>
                    </span>
                  </>
                );
                const cls = "flex items-center gap-4 rounded-[1.4rem] border border-line bg-surface p-5 transition-colors";
                return it.href ? (
                  <a key={it.label} href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`${cls} hover:border-red`}>
                    {inner}
                  </a>
                ) : (
                  <div key={it.label} className={cls}>{inner}</div>
                );
              })}
              <div className="rounded-[1.4rem] border border-line bg-surface p-5">
                <span className="label">Response time</span>
                <p className="font-display mt-3 text-3xl font-extrabold tracking-[-0.04em]">&lt; 24h</p>
                <p className="ar mt-1 text-sm text-muted">بنرد في نفس اليوم غالبًا.</p>
              </div>
            </aside>
          </Fade>
        </div>
      </section>
    </>
  );
}
