export type WorkType = "Web" | "App" | "SaaS";

export interface Project {
  slug: string;
  title: string;
  kanji: string;
  types: WorkType[];
  year: string;
  tagline: string;
  summary: string;
  role: string;
  status: string;
  stack: string[];
  url?: string;
  repo?: string;
  cover?: string; // public path, optional
  hue: [string, string]; // gradient fallback
  flagship?: boolean;
  challenge: string;
  solution: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    slug: "rafiq",
    title: "RAFIQ",
    kanji: "相棒",
    types: ["App", "SaaS"],
    year: "2025 — now",
    tagline: "A local-first Arabic AI companion that remembers, so you can just live.",
    summary:
      "An assistive companion for people living with memory loss — natural Arabic conversation, medication and appointment reminders, a caregiver app and a web dashboard. Conversation, memory and reminders keep working offline.",
    role: "Product, AI, full-stack, mobile, brand",
    status: "Flagship · Live prototype",
    stack: ["Electron", "React", "TypeScript", "Fastify", "SQLite", "MQTT", "RAG", "Expo"],
    url: "https://rafiq-tech.vercel.app",
    repo: "https://github.com/TheSeifDev/rafiq-system",
    cover: "/work/rafiq.webp",
    hue: ["#2563eb", "#0b1020"],
    flagship: true,
    challenge:
      "Memory loss takes away names, appointments and routines — and leaves families unable to be present every hour. The product has to be patient, honest about what it doesn't know, and private by default.",
    solution:
      "RAFIQ runs the language model, speech and memory on a small workstation in the home. A caregiver app and dashboard read from the same local source of truth, so the family sees one accurate picture instead of two.",
    highlights: [
      "Arabic-first, Egyptian-dialect aware conversation",
      "Reminders with logged delivery results",
      "User-triggered SOS chain that never over-promises",
      "Local-first architecture: keeps working with the internet cut",
    ],
  },
  {
    slug: "omni",
    title: "OMNI",
    kanji: "群",
    types: ["App"],
    year: "2026",
    tagline: "Microbots that think as one swarm.",
    summary:
      "A graduation-grade robotics concept inspired by the microbots of Big Hero 6 — thousands of small units coordinating through a shared control layer, visualised and simulated in the browser with Three.js.",
    role: "Concept, simulation, embedded, 3D",
    status: "Flagship · In development",
    stack: ["Three.js", "ESP32", "MQTT", "TypeScript", "Python"],
    cover: "/work/omni-swarm.webp",
    hue: ["#ff2418", "#12060a"],
    flagship: true,
    challenge:
      "Swarm behaviour is hard to explain and harder to debug. We needed a way to see, steer and test collective movement long before hardware exists.",
    solution:
      "A real-time swarm simulator drives the same control messages the hardware will receive over MQTT — so the visual layer and the embedded layer are designed against one protocol.",
    highlights: [
      "Instanced-mesh swarm rendered at 60 fps",
      "Formation morphing: scatter, wave, sphere",
      "One control protocol shared by simulator and hardware",
    ],
  },
  {
    slug: "phantoms-ops",
    title: "PHANTOMS Ops",
    kanji: "運営",
    types: ["SaaS", "Web", "App"],
    year: "2026",
    tagline: "The operations platform that runs the team itself.",
    summary:
      "Task assignment, member evaluations, performance ranking, push and WhatsApp notifications and an AI operations copilot — web, PWA and Android.",
    role: "Architecture, full-stack, UX",
    status: "In production",
    stack: ["React 19", "TypeScript", "Vite", "Tailwind v4", "Supabase", "Zustand", "TanStack Query", "Capacitor"],
    repo: "https://github.com/TheSeifDev/dashboard-phantoms",
    hue: ["#ff5a3c", "#14080a"],
    challenge:
      "A 25-person distributed team needs one place to assign work, review it fairly and see who is available — without spreadsheets and chat threads.",
    solution:
      "A Supabase-backed platform with row-level security, invitation-only member auth, verified device sessions, a ranked leaderboard and a copilot that must ask before any destructive action.",
    highlights: [
      "Row-level security and audited admin RPCs",
      "Persisted Arabic / English with RTL / LTR",
      "Contribution heatmap from real task approvals",
      "AI copilot with explicit confirmation on deletions",
    ],
  },
  {
    slug: "it-sum",
    title: "IT-SUM",
    kanji: "学び",
    types: ["Web"],
    year: "2026",
    tagline: "A learning platform and content hub for IT students.",
    summary:
      "Content delivery, quizzes, academic management and admin dashboards for IT students — built on a typed Next.js + NestJS stack.",
    role: "Full-stack, UI",
    status: "Live",
    stack: ["Next.js", "NestJS", "PostgreSQL", "Supabase", "Prisma"],
    url: "https://it-sum-seven.vercel.app/",
    cover: "/work/it-sum.webp",
    hue: ["#7c3aed", "#0c0a18"],
    challenge:
      "Course material, quizzes and results lived in scattered chats and files, with no way for staff to see progress.",
    solution:
      "A single platform with structured content, graded quizzes, student accounts and an admin layer — typed end-to-end so changes stay safe.",
    highlights: ["Quizzes and academic management", "Admin dashboards", "Typed API contracts"],
  },
  {
    slug: "trackup",
    title: "TrackUp",
    kanji: "記録",
    types: ["SaaS", "Web"],
    year: "2026",
    tagline: "Turn videos into actionable insights.",
    summary:
      "Video intelligence and playback analytics — real viewing sessions, scoped team access and provider-aware evidence.",
    role: "Product, full-stack",
    status: "Live",
    stack: ["Next.js", "React", "TypeScript", "Supabase"],
    url: "https://trakeup.vercel.app/",
    repo: "https://github.com/TheSeifDev/traking",
    cover: "/work/trackup.webp",
    hue: ["#06b6d4", "#07121a"],
    challenge: "Teams publish video but can't see how it's actually watched, or share that evidence safely.",
    solution: "Playback sessions are captured, scoped per team and presented as clear, provider-aware insight.",
    highlights: ["Real viewing sessions", "Scoped team access", "Provider-aware evidence"],
  },
  {
    slug: "nabd-masr",
    title: "Nabd Masr",
    kanji: "鼓動",
    types: ["Web"],
    year: "2026",
    tagline: "Connecting blood donors with recipients in real time.",
    summary:
      "A community healthcare platform that matches donors with recipients as requests happen.",
    role: "Full-stack, UX",
    status: "Private preview",
    stack: ["Next.js", "React", "Prisma", "MySQL"],
    hue: ["#e11d48", "#14070b"],
    challenge: "Urgent blood requests travel through social posts — slowly and without verification.",
    solution: "Structured requests, real-time matching and a clear donor journey.",
    highlights: ["Real-time matching", "Donor and recipient flows", "Prisma + MySQL data model"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const services = [
  {
    n: "01",
    key: "Web" as WorkType,
    title: "Web",
    ar: "مواقع ومنصات",
    kanji: "網",
    line: "Marketing sites, learning platforms, company websites and landing pages that look expensive and load fast.",
    items: ["Company & landing sites", "Learning & community platforms", "Dashboards and admin panels", "SEO, performance, accessibility"],
    stack: ["Next.js", "Tailwind", "GSAP", "Three.js"],
    hue: ["#ff2418", "#3a0000"],
  },
  {
    n: "02",
    key: "App" as WorkType,
    title: "Apps",
    ar: "تطبيقات موبايل وويب",
    kanji: "器",
    line: "Cross-platform mobile and desktop apps — offline-first when it matters, native-feeling always.",
    items: ["iOS & Android with Expo", "Desktop with Electron", "Realtime & offline sync", "Devices and IoT integration"],
    stack: ["React Native", "Expo", "Electron", "MQTT"],
    hue: ["#ff6a2b", "#2a0a00"],
  },
  {
    n: "03",
    key: "SaaS" as WorkType,
    title: "SaaS",
    ar: "أنظمة بتتباع كخدمة",
    kanji: "核",
    line: "Multi-tenant products with auth, billing-ready data models and the operational tooling to run them.",
    items: ["Auth, roles and tenancy", "Admin & analytics layers", "AI features & RAG", "API design and integrations"],
    stack: ["NestJS", "PostgreSQL", "Neon", "Supabase"],
    hue: ["#d4001a", "#1a0005"],
  },
];

export interface Member {
  slug: string;
  name: string;
  role: string;
  squad: string;
  kanji: string;
  bio: string;
  link?: string;
  linkLabel?: string;
  lead?: boolean;
  placeholder?: boolean;
}

// Add real members here. Drop a photo at public/team/<slug>.webp (or .jpg/.png)
// and it is picked up automatically — no code changes needed.
export const members: Member[] = [
  {
    slug: "seif-ayman",
    name: "Seif Ayman",
    role: "Founder & Technical Lead",
    squad: "Platform",
    kanji: "導",
    bio: "Defines architecture, API conventions and standards across web, desktop, AI and IoT work. Full-stack from schema to interface.",
    link: "https://theseif.vercel.app",
    linkLabel: "theseif.vercel.app",
    lead: true,
  },
  {
    slug: "ahmed-eid",
    name: "Ahmed Eid",
    role: "AI Team Leader",
    squad: "AI & Data",
    kanji: "智",
    bio: "Local LLMs, retrieval and voice. Designs the AI track of RAFIQ — from speech pipeline to benchmarks.",
    link: "https://7lf.dev",
    linkLabel: "7lf.dev",
    lead: true,
  },
  { slug: "phantom-03", name: "Phantom 03", role: "Frontend & Motion", squad: "Web", kanji: "動", bio: "Interfaces, motion systems and design engineering.", placeholder: true },
  { slug: "phantom-04", name: "Phantom 04", role: "Mobile Engineer", squad: "Apps", kanji: "携", bio: "Expo and React Native, offline-first mobile.", placeholder: true },
  { slug: "phantom-05", name: "Phantom 05", role: "Embedded & IoT", squad: "Hardware", kanji: "電", bio: "ESP32, sensors and MQTT — where code meets the room.", placeholder: true },
  { slug: "phantom-06", name: "Phantom 06", role: "UI / UX Designer", squad: "Design", kanji: "美", bio: "Brand, product design and prototypes.", placeholder: true },
  { slug: "phantom-07", name: "Phantom 07", role: "Security Engineer", squad: "Platform", kanji: "盾", bio: "Auth, hardening and secure-by-default architecture.", placeholder: true },
  { slug: "phantom-08", name: "Phantom 08", role: "Backend Engineer", squad: "Platform", kanji: "核", bio: "APIs, databases and the plumbing that keeps it up.", placeholder: true },
];

export const squads = [
  { name: "Web", jp: "網", note: "Sites, platforms, motion" },
  { name: "Apps", jp: "器", note: "Mobile & desktop" },
  { name: "AI & Data", jp: "智", note: "LLMs, RAG, voice" },
  { name: "Hardware", jp: "電", note: "ESP32, IoT, robotics" },
  { name: "Design", jp: "美", note: "Brand & product" },
  { name: "Platform", jp: "核", note: "Architecture & security" },
];
