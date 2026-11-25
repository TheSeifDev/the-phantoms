"use client";

import { useEffect, useState } from "react";
import { Check, Code2, Copy, Mail, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/site";

function Clock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const update = () => setNow(new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="mono text-sm text-fg">{now || "--:--:--"}</span>;
}

export function ContactInfo() {
  const [copied, setCopied] = useState(false);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  }

  const cards = [
    { label: "Email", value: site.email, icon: Mail, action: copyEmail, actionLabel: copied ? "Copied" : "Copy" },
    { label: "WhatsApp", value: "Chat with the team", icon: MessageCircle, href: site.whatsapp },
    { label: "Phone", value: site.phone, icon: Phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { label: "GitHub", value: "ThePhantoms", icon: Code2, href: site.github },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3"><span className="glow-dot h-2 w-2 animate-pulse" /><span className="rounded-full border border-red/30 bg-red/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-red">Booking projects for Q1</span></div>
      <p className="mt-4 text-sm text-muted">Usually replying within one working day.</p>
      <div className="mt-8 rounded-[1.4rem] border border-line bg-surface/50 p-5"><div className="flex items-center justify-between"><span className="label">Alexandria local time</span><span className="h-1.5 w-1.5 rounded-full bg-[#2bd96b] shadow-[0_0_10px_#2bd96b]" /></div><div className="mt-3 flex items-end justify-between"><span className="font-display text-4xl font-extrabold tracking-[-0.06em]">{site.location}</span><Clock /></div></div>
      <div className="mt-3 space-y-2">
        {cards.map(({ label, value, icon: Icon, href, action, actionLabel }) => {
          const content = <><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red/10 text-red"><Icon size={17} /></span><span className="min-w-0"><span className="label block">{label}</span><span className="mt-1 block truncate text-sm font-semibold">{value}</span></span>{action && <button type="button" onClick={action} className="ml-auto inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-muted transition hover:text-red">{copied ? <Check size={13} /> : <Copy size={13} />}{actionLabel}</button>}</>;
          return href ? <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="glow-card flex items-center gap-3 rounded-[1.2rem] p-3.5">{content}</a> : <div key={label} className="glow-card flex items-center gap-3 rounded-[1.2rem] p-3.5">{content}</div>;
        })}
      </div>
    </div>
  );
}
