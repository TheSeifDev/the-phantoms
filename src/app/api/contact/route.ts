import { NextResponse } from "next/server";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000),
  kind: z.string().trim().max(60).optional(),
  budget: z.string().trim().max(60).optional(),
  company: z.string().optional(), // honeypot
});

// tiny in-memory limiter (per instance) — enough to blunt casual spam
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many requests — please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your name, email and message." }, { status: 400 });
  }
  const d = parsed.data;
  if (d.company) return NextResponse.json({ ok: true }); // bot — pretend success

  let stored = false;
  let mailed = false;

  // 1) Neon Postgres
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const sql = neon(dbUrl);
      await sql`CREATE TABLE IF NOT EXISTS leads (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        kind TEXT,
        budget TEXT,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`INSERT INTO leads (name, email, kind, budget, message)
                VALUES (${d.name}, ${d.email}, ${d.kind ?? null}, ${d.budget ?? null}, ${d.message})`;
      stored = true;
    } catch (e) {
      console.error("[contact] neon error", e);
    }
  }

  // 2) Optional email notification through Resend
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? "the.phantoms.dev@gmail.com";
  if (key) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? "Phantoms <onboarding@resend.dev>",
          to: [to],
          reply_to: d.email,
          subject: `New lead — ${d.name} (${d.kind ?? "project"})`,
          text: `${d.name} <${d.email}>\n${d.kind ?? ""} · ${d.budget ?? ""}\n\n${d.message}`,
        }),
      });
      mailed = r.ok;
    } catch (e) {
      console.error("[contact] resend error", e);
    }
  }

  if (!stored && !mailed) {
    // Nothing is configured (or both failed): log it and be honest with the visitor.
    console.log("[contact] lead (unpersisted)", d);
    if (dbUrl || key) {
      return NextResponse.json(
        { error: "We couldn't save your message. Please email us or use WhatsApp." },
        { status: 502 },
      );
    }
  }
  return NextResponse.json({ ok: true });
}
