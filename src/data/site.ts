export const site = {
  name: "Phantoms",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://the-phantoms.vercel.app",
  tagline: "Built in the shadows. Felt everywhere.",
  description:
    "Phantoms is an Alexandria-based product team building websites, apps and SaaS — and two flagship graduation projects, RAFIQ and OMNI.",
  email: "the.phantoms.dev@gmail.com",
  phone: "+20 122 136 9658",
  whatsapp: "https://wa.me/201221369658",
  location: "Alexandria, Egypt",
  coords: "31.2001° N · 29.9187° E",
  github: "https://github.com/ThePhantoms",
  rafiqUrl: "https://rafiq-tech.vercel.app",
};

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
  { href: "/memories", label: "Memories" },
  { href: "/contact", label: "Contact" },
];

export const stats = [
  { value: 25, suffix: "", label: "Members", note: "Engineers, designers and researchers working in focused squads." },
  { value: 12, suffix: "+", label: "Projects", note: "From landing pages to AI companions and ops platforms." },
  { value: 2, suffix: "", label: "Flagships", note: "RAFIQ and OMNI — our graduation-grade products." },
  { value: 1, suffix: "+", label: "Years", note: "Shipping together since 2025, out of Alexandria." },
];

export const marqueeTech = [
  "Next.js",
  "React Native",
  "NestJS",
  "TypeScript",
  "PostgreSQL",
  "Neon",
  "Supabase",
  "Three.js",
  "Electron",
  "FastAPI",
  "MQTT",
  "ESP32",
  "RAG",
  "Tailwind",
  "GSAP",
  "Docker",
];

export const processSteps = [
  {
    n: "01",
    title: "Discover",
    ar: "نفهم الفكرة",
    line: "We sit with the problem, the people and the constraints before touching code.",
    out: ["Problem statement", "Scope & risks", "Success criteria"],
  },
  {
    n: "02",
    title: "Design",
    ar: "نرسم الشكل",
    line: "Architecture and interface shaped together — data model, API, motion and brand.",
    out: ["Data model", "UI direction", "Clickable prototype"],
  },
  {
    n: "03",
    title: "Build",
    ar: "نبني بإتقان",
    line: "Small, reviewed, typed increments. You see real progress every week, not slides.",
    out: ["Weekly builds", "Typed contracts", "Reusable components"],
  },
  {
    n: "04",
    title: "Ship",
    ar: "نسلّم ونكمل",
    line: "Deploy, measure, iterate. We stay close after launch so it keeps working.",
    out: ["Production deploy", "Monitoring", "Iteration plan"],
  },
];

export const faqs = [
  {
    q: "What does a typical project look like?",
    a: "A short discovery call, a fixed scope and timeline, then weekly builds you can click. We usually start with a one-week design sprint, then move into build and launch.",
  },
  {
    q: "هل بتشتغلوا بالعربي والإنجليزي؟",
    a: "أيوه — الموقع أو التطبيق ممكن يبقى بالعربي، الإنجليزي أو الاتنين مع RTL كامل وخطوط مظبوطة. إحنا بنتكلم الاتنين في الشغل وفي التصميم.",
  },
  {
    q: "Who actually builds my product?",
    a: "The same people you talk to. Phantoms is a team of builders, not a sales layer — you get direct access to the engineers and designers on your project.",
  },
  {
    q: "Can you take an existing product forward?",
    a: "Yes. We audit what's there, agree on what to keep, and either refactor in place or rebuild the parts that hold you back — usually both.",
  },
  {
    q: "What happens after launch?",
    a: "You own the code and the infrastructure. We can stay on a monthly retainer for improvements and support, or hand over with documentation and a walkthrough.",
  },
  {
    q: "Do you build AI features?",
    a: "It's one of our strengths — RAFIQ runs local LLMs, speech and retrieval. We build assistants, RAG over your documents and voice interfaces, with honest limits.",
  },
];
