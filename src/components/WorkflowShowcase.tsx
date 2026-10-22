import { useState } from "react";
import { Film, Palette, TrendingUp, Code, Heart, Eye, Moon, Monitor, Smartphone } from "lucide-react";

const VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31910-large.mp4";
const CYAN = "oklch(0.82 0.14 205)";

const tabs = [
  { id: "video", label: "Video & Motion", icon: Film, title: "Cinematic Speed Ramps & Velocity Edits", desc: "High-octane commercial edits, smooth speed ramping, and precise beat-syncing.", tags: ["Adobe Premiere Pro", "After Effects", "CapCut", "Alight Motion"] },
  { id: "brand", label: "Brand Identity", icon: Palette, title: "Brand Identity & Logo Redesign", desc: "Transforming basic concepts into high-end, unforgettable visual identities.", tags: ["Adobe Photoshop", "Illustrator", "Brand Kit Design"] },
  { id: "social", label: "Social Media", icon: TrendingUp, title: "Viral Social Growth & Content Strategy", desc: "Scaling creator and business profiles across TikTok, Instagram, and YouTube with high-converting short-form content.", tags: ["Content Strategy", "Analytics", "Short-Form Editing"] },
  { id: "web", label: "Web Development", icon: Code, title: "High-End Web Applications & Portfolios", desc: "Lightning-fast, modern web experiences built with clean code and futuristic UI/UX design.", tags: ["HTML/CSS/JavaScript", "Tailwind CSS", "Lovable.dev", "React"] },
] as const;

function VideoDemo() {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
      <video src={VIDEO_URL} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
      <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em]" style={{ color: CYAN }}>● Live preview</span>
    </div>
  );
}

function BrandDemo() {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-border select-none">
      {/* Final */}
      <div className="absolute inset-0 grid grid-cols-2 gap-4 p-5" style={{ background: "linear-gradient(150deg, oklch(0.2 0.08 295), oklch(0.09 0.02 290))" }}>
        <div className="grid place-items-center">
          <div className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl font-serif text-4xl italic text-primary-foreground" style={{ background: `linear-gradient(135deg, oklch(0.62 0.25 295), ${CYAN})`, boxShadow: "0 0 40px oklch(0.6 0.25 295 / 0.5)" }}>K</div>
            <div className="mt-3 text-xs uppercase tracking-[0.3em]">Kora Coffee</div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div className="flex gap-1.5">{["oklch(0.62 0.25 295)", CYAN, "oklch(0.3 0.1 295)", "oklch(0.95 0.01 295)"].map((c) => <div key={c} className="h-8 flex-1 rounded-lg" style={{ background: c }} />)}</div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground"><div><div className="font-serif text-xl text-foreground">Aa</div>Display</div><div><div className="text-xl text-foreground">Aa</div>Body</div></div>
          <div className="grid grid-cols-4 gap-1 opacity-60">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-2 rounded-sm border border-foreground/30" />)}</div>
        </div>
        <span className="absolute bottom-3 right-3 text-[9px] uppercase tracking-[0.25em]" style={{ color: CYAN }}>Final KMS Creative Brand Package</span>
      </div>
      {/* Draft */}
      <div className="absolute inset-0 grid place-items-center bg-muted" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <div className="text-center text-muted-foreground">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-dashed border-muted-foreground/50 text-3xl">k</div>
          <div className="mt-3 text-xs">kora coffe (draft)</div>
        </div>
        <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.25em]">Raw Concept / Draft</span>
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-primary" style={{ left: `${pos}%`, boxShadow: "0 0 12px var(--primary)" }}>
        <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-primary text-xs text-primary-foreground">⇆</span>
      </div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Compare draft and final" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
    </div>
  );
}

function SocialDemo() {
  const posts = [
    { hook: "3 MISTAKES killing your brand", v: "1.2M", h: 295 },
    { hook: "POV: your café goes viral", v: "860K", h: 205 },
    { hook: "Watch this logo come alive", v: "2.4M", h: 310 },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-5">
      {posts.map((p) => (
        <div key={p.hook} className="group relative aspect-[9/16] overflow-hidden rounded-[22px] border-4 border-foreground/10 transition-transform duration-500 hover:-translate-y-2" style={{ background: `linear-gradient(170deg, oklch(0.5 0.2 ${p.h}), oklch(0.1 0.03 290))` }}>
          <div className="absolute left-1/2 top-1.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-background/60" />
          <div className="absolute inset-x-2 top-1/3 text-center text-sm md:text-xl font-bold uppercase leading-tight tracking-tight">{p.hook}</div>
          <div className="absolute bottom-3 left-2 right-2 flex items-center justify-between text-[10px] md:text-xs">
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.v}</span>
            <Heart className="h-3.5 w-3.5 text-primary" fill="currentColor" />
          </div>
        </div>
      ))}
    </div>
  );
}

function WebDemo() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [dark, setDark] = useState(true);
  const bg = dark ? "oklch(0.12 0.02 280)" : "oklch(0.96 0.01 290)";
  const fg = dark ? "oklch(0.95 0.01 290)" : "oklch(0.2 0.03 290)";
  return (
    <div>
      <div className="mb-3 flex gap-2">
        {(["desktop", "mobile"] as const).map((d) => (
          <button key={d} onClick={() => setDevice(d)} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${device === d ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"}`}>
            {d === "desktop" ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}{d}
          </button>
        ))}
        <button onClick={() => setDark(!dark)} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"><Moon className="h-3 w-3" />{dark ? "Dark" : "Light"}</button>
      </div>
      <div className={`mx-auto overflow-hidden rounded-2xl border border-border transition-all duration-500 ${device === "mobile" ? "max-w-[240px]" : "max-w-full"}`}>
        <div className="flex items-center gap-1.5 border-b border-border/60 bg-card px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-foreground/25" /><span className="h-2 w-2 rounded-full bg-foreground/25" /><span className="h-2 w-2 rounded-full bg-foreground/25" />
          <span className="ml-2 flex-1 truncate rounded-md bg-background/50 px-2 py-0.5 text-[10px] text-muted-foreground">nova-studio.app</span>
        </div>
        <div className="relative p-5 transition-colors duration-500" style={{ background: bg, color: fg, minHeight: 240 }}>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl" style={{ background: "oklch(0.6 0.25 295 / 0.5)" }} />
          <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full blur-3xl" style={{ background: "oklch(0.8 0.14 205 / 0.35)" }} />
          <div className="relative flex items-center justify-between text-[10px]"><b>NOVA</b>{device === "desktop" && <span className="opacity-60">Work · About · Contact</span>}</div>
          <div className={`relative mt-6 ${device === "desktop" ? "text-3xl" : "text-xl"} font-light leading-tight`}>Design the <i className="font-serif" style={{ color: "oklch(0.7 0.22 295)" }}>future</i></div>
          <div className={`relative mt-5 grid gap-2 ${device === "desktop" ? "grid-cols-3" : "grid-cols-1"}`}>
            {["Fast", "Responsive", "Secure"].map((t) => (
              <div key={t} className="rounded-xl border p-3 text-xs backdrop-blur-md" style={{ background: dark ? "oklch(1 0 0 / 0.06)" : "oklch(1 0 0 / 0.6)", borderColor: "oklch(0.7 0.1 295 / 0.3)" }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const demos = { video: VideoDemo, brand: BrandDemo, social: SocialDemo, web: WebDemo };

export function WorkflowShowcase() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("video");
  const t = tabs.find((x) => x.id === active)!;
  const Demo = demos[active];
  return (
    <section id="workflows" className="max-w-6xl mx-auto px-6 mb-32">
      <span className="eyebrow">Service workflows</span>
      <h2 className="font-light text-4xl md:text-5xl tracking-[-0.02em] mt-4 mb-10">How I <span className="font-serif italic text-primary">work</span></h2>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((x) => (
          <button key={x.id} onClick={() => setActive(x.id)} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs uppercase tracking-[0.14em] transition-all ${active === x.id ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`} style={active === x.id ? { boxShadow: "0 0 24px oklch(0.6 0.25 295 / 0.35)" } : undefined}>
            <x.icon className="h-3.5 w-3.5" />{x.label}
          </button>
        ))}
      </div>
      <div key={t.id} className="card-premium grid gap-8 p-6 md:grid-cols-[1fr_1.4fr] md:p-10 animate-in fade-in duration-500">
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl md:text-3xl font-light tracking-tight">{t.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {t.tags.map((g) => <span key={g} className="rounded-full border px-3 py-1 text-[11px]" style={{ borderColor: "oklch(0.82 0.14 205 / 0.4)", color: CYAN }}>{g}</span>)}
          </div>
        </div>
        <Demo />
      </div>
    </section>
  );
}
