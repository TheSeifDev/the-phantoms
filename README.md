# Phantoms — Hub site

Team portfolio + startup site for **Phantoms** (Alexandria, Egypt). Web · Apps · SaaS, plus the two flagships **RAFIQ** and **OMNI**.

> Built in the shadows. Felt everywhere.  ·  幻影

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) · **React 19**
- **Tailwind CSS v4** (tokens in `src/app/globals.css`)
- **GSAP** (ScrollTrigger + SplitText) · **Lenis** smooth scroll
- **three.js** — hero particle "red sun" and the OMNI microbot swarm
- **next-themes** — dark (default) / light
- **next/font** — Bricolage Grotesque (display), Montserrat (sub), IBM Plex Sans Arabic (AR), Instrument Serif (italic accent), Noto Serif JP subset (kanji)
- **Neon Postgres** (`@neondatabase/serverless`) + **zod** for the contact form, optional **Resend** email

## Run

```bash
pnpm install
cp .env.example .env.local   # fill in what you need
pnpm dev                     # http://localhost:3000
pnpm build && pnpm start
```

## Routes

| Route | What |
| --- | --- |
| `/` | Hex preloader → Hero (floating draggable cards + three.js hex prisms) → About bento → Flagship (RAFIQ 3D cloud / OMNI swarm) → Services (sticky stacking cards) → Work (horizontal pinned scroll) → Process → Team (3D glass carousel) → Memories (scroll-velocity rows) → CTA → bento footer |
| `/work` | Filterable grid (All / Web / App / SaaS) |
| `/work/[slug]` | Case-study template (statically generated from `src/data/projects.ts`) |
| `/flagship/rafiq` · `/flagship/omni` | Flagship pages (RAFIQ: warm and calm; OMNI: dark, scroll-driven swarm) |
| `/services` | Services, comparison table, process, FAQ |
| `/team` | Team carousel, squads, memories |
| `/memories` | Full memories wall (photos from `public/memories/`) |
| `/contact` | Lead form (+ WhatsApp fallback) |
| `/api/contact` | Route handler: zod → Neon → optional Resend |

## Content — everything lives in `src/data/`

- `site.ts` — contact info, nav, stats, marquee, process steps, FAQs
- `projects.ts` — projects/case studies, services, **members**, squads

### Team photos
Drop a photo named after the member's `slug` and it is picked up automatically:

```
public/team/seif-ayman.webp      (jpg / png also work)
public/team/ahmed-eid.webp
public/team/phantom-03.webp
```

`phantom-03 … phantom-08` are **placeholder members** — replace them in `members` (name, role, slug, bio) when you have the real team.

### Memories (old team)
Put any photos in `public/memories/` — they become the two rounded-tile marquee rows. Until there are photos, neutral placeholder tiles are shown. Click a real photo for the lightbox.

### Japanese glyph
Only the footer katakana wordmark remains. If you add Japanese text, run `pnpm jp` to regenerate the font subset.

### Command palette
`⌘K` / `Ctrl K` opens a palette to jump between pages and actions.

## Contact form → Neon

1. Create a Neon project, copy the connection string into `DATABASE_URL` (locally in `.env.local`, in production in Vercel → Settings → Environment Variables).
2. The table is created automatically on the first lead (`db/schema.sql` has the same SQL).
3. Optional: `RESEND_API_KEY` (+ `CONTACT_TO`, `CONTACT_FROM`) emails every lead to you.

Without any env vars the form still works for the visitor (the lead is only logged on the server) — set `DATABASE_URL` before going live. Spam protection: honeypot field + a small per-IP rate limit.

## Deploy

Import the repo on Vercel (framework: Next.js, no config). Set `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL` and optionally the Resend variables.

## Roadmap / architecture notes

- This repo is the **Hub**. RAFIQ and OMNI live inside it as `/flagship/*` for now; later they can move to their own sites (`rafiq.` / `omni.` subdomains) while the Hub keeps the case-study pages.
- Phase 2: `/products`, `/courses`, blog.

## Design notes
Dark ink + phantom red + paper white, from the logo. Premium creative look: **film grain + glowing red light** everywhere (`.film-grain`, `.aura`, `.glow-card`, `.edge-glow`, `.glow-red` in `globals.css`), no grid backgrounds. Hero is a three.js glowing hex tunnel; theme switch plays a hexagon-block wave; page transitions drop in from the top. Team is a 35-member wall with Phantom ID cards (`src/data/projects.ts` → `members`; photos in `public/team/<slug>.webp`), memories is a draggable polaroid collage (`public/memories/`, max ~6 photos), work is an interactive index with cursor preview, process is a horizontal timeline (images in `public/process/`). Japanese influence is limited to the footer katakana. Motion is GSAP + Lenis and respects `prefers-reduced-motion`.
