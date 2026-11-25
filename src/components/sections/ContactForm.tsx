"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { site } from "@/data/site";

const kinds = ["Website", "App", "SaaS", "Other"];
const budgets = ["Under $1k", "$1k–5k", "$5k–15k", "$15k+", "Let's discuss"];
const timelines = ["ASAP", "1–2 months", "3–6 months", "Flexible"];

type FormState = "idle" | "sending" | "ok" | "error";

function Choice({ value, selected, onClick }: { value: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={`rounded-full border px-3.5 py-2 text-[0.63rem] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${selected ? "border-red bg-red text-white shadow-[0_0_24px_rgba(255,36,24,.28)]" : "border-line text-muted hover:border-fg hover:text-fg"}`}>
      {value}
    </button>
  );
}

function Field({ label, name, type = "text", required = false, defaultValue, placeholder }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string; placeholder?: string }) {
  return (
    <div className="relative">
      <input id={name} name={name} type={type} required={required} defaultValue={defaultValue} placeholder=" " autoComplete={name === "email" ? "email" : name === "name" ? "name" : "organization"} className="peer w-full border-b border-line bg-transparent px-0 pb-3 pt-5 text-base outline-none transition-colors placeholder:text-transparent focus:border-red" />
      <label htmlFor={name} className="pointer-events-none absolute left-0 top-1 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[0.82rem] peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-[0.62rem] peer-focus:font-bold peer-focus:text-red">{label}{required ? " *" : ""}</label>
      {placeholder && <span className="sr-only">{placeholder}</span>}
    </div>
  );
}

export function ContactForm() {
  const [kind, setKind] = useState("Website");
  const [budget, setBudget] = useState("Let's discuss");
  const [timeline, setTimeline] = useState("Flexible");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [prefill, setPrefill] = useState("");

  useEffect(() => {
    try {
      setPrefill(sessionStorage.getItem("ph-email") ?? "");
    } catch {}
    const queryType = new URLSearchParams(window.location.search).get("type")?.toLowerCase();
    const match = kinds.find((item) => item.toLowerCase() === queryType || item.toLowerCase().includes(queryType ?? "__none__"));
    if (match) setKind(match);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const companyName = String(data.get("companyName") ?? "").trim();
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
      setError("Please add your name, a valid email and a little more detail about the project.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    const context = [`Project type: ${kind}`, `Budget: ${budget}`, `Timeline: ${timeline}`, companyName ? `Company: ${companyName}` : ""].filter(Boolean).join("\n");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: `${context}\n\n${message}`, kind, budget, company: data.get("company") }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Something went wrong");
      setState("ok");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong");
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="edge-glow glass grid min-h-[34rem] place-items-center overflow-hidden rounded-[2rem] p-8 text-center sm:p-12">
        <div>
          <span className="mx-auto grid h-16 w-16 animate-[fadeUp_.6s_ease-out] place-items-center rounded-full bg-red text-white shadow-[0_0_50px_rgba(255,36,24,.6)]"><Check size={29} strokeWidth={2.5} /></span>
          <p className="label mt-7 justify-center">Transmission received</p>
          <h3 className="font-display mt-4 text-[clamp(2.6rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.06em]">We&apos;re on it.</h3>
          <p className="ar mt-4 text-xl font-semibold">وصلتنا — هنرد عليك قريب.</p>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-muted">We&apos;ll reply within one working day. If it&apos;s urgent, jump straight into WhatsApp.</p>
          <a href={`${site.whatsapp}?text=${encodeURIComponent("Hi Phantoms, I just sent a project brief.")}`} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] transition hover:border-red hover:text-red"><MessageCircle size={16} /> Open WhatsApp</a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="edge-glow glass relative overflow-hidden rounded-[2rem] p-6 sm:p-9 lg:p-11">
      <div className="aura -right-32 -top-32 h-72 w-72 opacity-20" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4"><p className="label">Project brief</p><span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">01 / 01</span></div>
        <h2 className="font-display mt-5 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-none tracking-[-0.06em]">Let&apos;s make it real.</h2>

        <fieldset className="mt-9"><legend className="label">I&apos;m thinking about a</legend><div className="mt-4 flex flex-wrap gap-2">{kinds.map((item) => <Choice key={item} value={item} selected={kind === item} onClick={() => setKind(item)} />)}</div></fieldset>
        <fieldset className="mt-7"><legend className="label">Budget range</legend><div className="mt-4 flex flex-wrap gap-2">{budgets.map((item) => <Choice key={item} value={item} selected={budget === item} onClick={() => setBudget(item)} />)}</div></fieldset>
        <fieldset className="mt-7"><legend className="label">Target timeline</legend><div className="mt-4 flex flex-wrap gap-2">{timelines.map((item) => <Choice key={item} value={item} selected={timeline === item} onClick={() => setTimeline(item)} />)}</div></fieldset>

        <div className="mt-10 grid gap-x-7 gap-y-6 sm:grid-cols-2"><Field label="Your name" name="name" required placeholder="Your name" /><Field label="Email address" name="email" type="email" required defaultValue={prefill} placeholder="you@company.com" /><Field label="Company (optional)" name="companyName" placeholder="Company" /></div>
        <div className="relative mt-8"><textarea id="message" name="message" required minLength={10} rows={4} maxLength={3000} placeholder=" " className="peer w-full resize-none border-b border-line bg-transparent px-0 pb-3 pt-5 text-base outline-none transition-colors focus:border-red" /><label htmlFor="message" className="pointer-events-none absolute left-0 top-1 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[0.82rem] peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-[0.62rem] peer-focus:font-bold peer-focus:text-red">Tell us about the idea *</label></div>
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        {state === "error" && <p className="mt-5 text-sm leading-relaxed text-red" role="alert">{error}</p>}
        <div className="mt-8 flex flex-wrap items-center gap-4"><Button type="submit" disabled={state === "sending"} cursor="SEND">{state === "sending" ? "Sending…" : "Send brief"}</Button>{state === "sending" && <Loader2 className="animate-spin text-red" size={19} />}<span className="text-xs text-muted">No sales pitch. Just a useful reply.</span></div>
      </div>
    </form>
  );
}
