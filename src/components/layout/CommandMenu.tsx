"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CornerDownLeft, Copy, FileText, Home, Mail, MessageCircle, Moon, Search, Sparkles, Users } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { usePageTransition } from "@/components/layout/PageTransition";
import { projects } from "@/data/projects";
import { nav, site } from "@/data/site";

export const openCommand = () => window.dispatchEvent(new Event("phantoms:cmd"));

type Item = { id: string; label: string; hint: string; icon: React.ReactNode; run: () => void };

/** ⌘K / Ctrl+K command palette */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const { go } = usePageTransition();
  const { resolvedTheme, setTheme } = useTheme();

  const close = useCallback(() => setOpen(false), []);

  const items: Item[] = useMemo(() => {
    const nav_: Item[] = [{ id: "home", label: "Home", hint: "Page", icon: <Home size={16} />, run: () => go("/") }].concat(
      nav.map((n) => ({
        id: n.href,
        label: n.label,
        hint: "Page",
        icon: n.href === "/team" ? <Users size={16} /> : <FileText size={16} />,
        run: () => go(n.href),
      })),
    );
    const flag: Item[] = [
      { id: "rafiq", label: "RAFIQ — flagship", hint: "Project", icon: <Sparkles size={16} />, run: () => go("/flagship/rafiq") },
      { id: "omni", label: "OMNI — flagship", hint: "Project", icon: <Sparkles size={16} />, run: () => go("/flagship/omni") },
    ];
    const work: Item[] = projects
      .filter((p) => !p.flagship)
      .map((p) => ({ id: p.slug, label: p.title, hint: "Case study", icon: <FileText size={16} />, run: () => go(`/work/${p.slug}`) }));
    const actions: Item[] = [
      { id: "start", label: "Start a project", hint: "Action", icon: <Sparkles size={16} />, run: () => go("/contact") },
      { id: "wa", label: "Chat on WhatsApp", hint: "Action", icon: <MessageCircle size={16} />, run: () => window.open(site.whatsapp, "_blank") },
      { id: "mail", label: `Copy ${site.email}`, hint: "Action", icon: <Copy size={16} />, run: () => void navigator.clipboard?.writeText(site.email) },
      { id: "mailto", label: "Send an email", hint: "Action", icon: <Mail size={16} />, run: () => (window.location.href = `mailto:${site.email}`) },
      { id: "theme", label: resolvedTheme === "light" ? "Switch to dark" : "Switch to light", hint: "Theme", icon: <Moon size={16} />, run: () => setTheme(resolvedTheme === "light" ? "dark" : "light") },
    ];
    return [...nav_, ...flag, ...work, ...actions];
  }, [go, resolvedTheme, setTheme]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((x) => x.label.toLowerCase().includes(s) || x.hint.toLowerCase().includes(s)) : items;
  }, [items, q]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const ev = () => setOpen(true);
    window.addEventListener("keydown", key);
    window.addEventListener("phantoms:cmd", ev);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("phantoms:cmd", ev);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setI(0);
    requestAnimationFrame(() => input.current?.focus());
    gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo("[data-cmd-panel]", { y: 24, scale: 0.97, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" });
  }, [open]);

  if (!open) return null;
  const run = (it?: Item) => {
    if (!it) return;
    close();
    setTimeout(it.run, 60);
  };
  return (
    <div ref={root} className="fixed inset-0 z-[95] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div data-cmd-panel className="w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_40px_120px_-20px_rgba(0,0,0,.8)]">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search size={16} className="text-muted" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setI(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") (e.preventDefault(), setI((v) => Math.min(list.length - 1, v + 1)));
              if (e.key === "ArrowUp") (e.preventDefault(), setI((v) => Math.max(0, v - 1)));
              if (e.key === "Enter") run(list[i]);
            }}
            placeholder="Search pages, projects, actions…"
            className="h-14 flex-1 bg-transparent text-[0.95rem] outline-none placeholder:text-muted"
          />
          <kbd className="mono rounded-md border border-line px-1.5 py-0.5 text-[0.65rem] text-muted">ESC</kbd>
        </div>
        <ul className="max-h-[48vh] overflow-y-auto p-2">
          {list.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">Nothing found.</li>}
          {list.map((it, idx) => (
            <li key={it.id}>
              <button
                type="button"
                onMouseEnter={() => setI(idx)}
                onClick={() => run(it)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ${idx === i ? "bg-red/15 text-fg" : "text-fg/80"}`}
              >
                <span className={idx === i ? "text-red" : "text-muted"}>{it.icon}</span>
                <span className="flex-1 font-semibold">{it.label}</span>
                <span className="mono text-[0.65rem] uppercase tracking-wider text-muted">{it.hint}</span>
                {idx === i && <CornerDownLeft size={13} className="text-red" />}
              </button>
            </li>
          ))}
        </ul>
        <div className="mono flex items-center justify-between border-t border-line px-5 py-3 text-[0.65rem] text-muted">
          <span>↑ ↓ navigate · ↵ select</span>
          <span>Phantoms ⌘K</span>
        </div>
      </div>
    </div>
  );
}
