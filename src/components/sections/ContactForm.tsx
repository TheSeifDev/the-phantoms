"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { site } from "@/data/site";

const kinds = ["Website", "Mobile app", "SaaS product", "AI feature", "Not sure yet"];
const budgets = ["< $1k", "$1k – $5k", "$5k – $15k", "$15k+", "Let's discuss"];

export function ContactForm() {
  const [kind, setKind] = useState<string>(kinds[0]);
  const [budget, setBudget] = useState<string>(budgets[4]);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setErr("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
          company: fd.get("company"), // honeypot
          kind,
          budget,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setState("ok");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="grid min-h-[28rem] place-items-center rounded-[2rem] border border-line bg-surface p-10 text-center">
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red text-white shadow-[0_0_50px_rgba(255,36,24,.6)]">
            <Check size={28} />
          </span>
          <h3 className="font-display mt-6 text-4xl font-extrabold tracking-[-0.04em]">Message received.</h3>
          <p className="ar mt-2 text-xl">وصلتنا رسالتك — هنرد عليك قريب.</p>
          <p className="mx-auto mt-4 max-w-sm text-sm text-muted">We reply within one working day. In a hurry? Ping us on WhatsApp.</p>
        </div>
      </div>
    );
  }

  const field =
    "w-full border-b border-line bg-transparent py-4 text-lg outline-none transition-colors placeholder:text-muted/60 focus:border-red";

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10" noValidate>
      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        <label className="block">
          <span className="label">Name</span>
          <input name="name" required minLength={2} autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="block">
          <span className="label">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={field} />
        </label>
      </div>

      <fieldset className="mt-8">
        <legend className="label">What are we building?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {kinds.map((k) => (
            <button
              type="button"
              key={k}
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                kind === k ? "border-red bg-red text-white" : "border-line text-muted hover:border-fg hover:text-fg"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="label">Budget</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {budgets.map((k) => (
            <button
              type="button"
              key={k}
              onClick={() => setBudget(k)}
              aria-pressed={budget === k}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-all ${
                budget === k ? "border-fg bg-fg text-bg" : "border-line text-muted hover:border-fg hover:text-fg"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-8 block">
        <span className="label">Tell us about it</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={4}
          placeholder="What problem are you solving? Any deadline? عادي تكتب بالعربي."
          className={`${field} resize-none`}
        />
      </label>

      {/* honeypot */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {state === "error" && <p className="mt-4 text-sm text-red" role="alert">{err}</p>}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={state === "sending"} cursor="SEND">
          {state === "sending" ? "Sending…" : "Send message"}
        </Button>
        {state === "sending" && <Loader2 className="animate-spin text-red" size={20} />}
        <a
          href={`${site.whatsapp}?text=${encodeURIComponent("Hi Phantoms, I'd like to talk about a project.")}`}
          target="_blank"
          rel="noreferrer"
          className="link-u inline-flex items-center gap-2 text-sm font-semibold"
        >
          <MessageCircle size={16} className="text-red" /> or chat on WhatsApp
        </a>
      </div>
    </form>
  );
}
