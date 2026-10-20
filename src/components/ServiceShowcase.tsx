import { useRef, useState } from "react";
import { Play, ExternalLink, Check, Monitor, Smartphone, Zap } from "lucide-react";

/**
 * Sample media cards shown on each service page.
 * To add a real clip later, set `src` (short MP4, 5–10s, muted) and optional `poster`.
 */
type Clip = { title: string; tag: string; hue: number; src?: string; poster?: string };

const shortForm: Clip[] = [
  { title: "Product Reel", tag: "9:16 · 8s", hue: 295 },
  { title: "Kinetic Captions", tag: "9:16 · 6s", hue: 280 },
  { title: "Event Teaser", tag: "9:16 · 10s", hue: 310 },
];
const longForm: Clip[] = [
  { title: "Brand Commercial", tag: "16:9 · 4K", hue: 290 },
  { title: "Logo Reveal", tag: "16:9 · Motion", hue: 300 },
];

function VideoCard({ clip, vertical }: { clip: Clip; vertical: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setHover(true);
        ref.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHover(false);
        ref.current?.pause();
      }}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card ${vertical ? "aspect-[9/16]" : "aspect-video"}`}
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      {clip.src ? (
        <video
          ref={ref}
          src={clip.src}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{
            background: `radial-gradient(circle at 30% 25%, oklch(0.55 0.25 ${clip.hue} / 0.6), transparent 55%), linear-gradient(160deg, oklch(0.16 0.06 ${clip.hue}), oklch(0.07 0.02 ${clip.hue}))`,
          }}
        />
      )}
      <div className={`absolute inset-0 grid place-items-center transition-opacity ${hover && clip.src ? "opacity-0" : "opacity-100"}`}>
        <span className="glass grid h-12 w-12 place-items-center rounded-full text-foreground transition-transform group-hover:scale-110">
          <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" />
        </span>
      </div>
      {/* player chrome */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
        <span className="text-[10px] uppercase tracking-[0.28em] text-primary">{clip.tag}</span>
        <h4 className="text-base font-light tracking-tight mt-1">{clip.title}</h4>
        <div className="mt-3 h-0.5 w-full rounded-full bg-foreground/15 overflow-hidden">
          <div className="h-full w-0 bg-primary transition-all duration-[6000ms] ease-linear group-hover:w-full" />
        </div>
      </div>
    </div>
  );
}

function VideoShowcase() {
  return (
    <div className="space-y-14">
      <div>
        <Heading label="Short-Form Edits" sub="Vertical 9:16 · Reels, TikTok, Shorts" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {shortForm.map((c) => <VideoCard key={c.title} clip={c} vertical />)}
        </div>
      </div>
      <div>
        <Heading label="Long-Form Edits" sub="Horizontal 16:9 · YouTube, ads, brand films" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {longForm.map((c) => <VideoCard key={c.title} clip={c} vertical={false} />)}
        </div>
      </div>
    </div>
  );
}

function Heading({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
      <h3 className="text-xl md:text-2xl font-light tracking-tight">{label}</h3>
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{sub}</span>
    </div>
  );
}

function DesignShowcase() {
  return (
    <div className="space-y-14">
      <div>
        <Heading label="Logo Mockups" sub="Marks · wordmarks · monograms" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { m: "K", n: "Kora Coffee", h: 295 },
            { m: "Ab", n: "Abay Studio", h: 280 },
            { m: "◆", n: "Lumen", h: 310 },
            { m: "N", n: "Nile Tech", h: 270 },
          ].map((l) => (
            <div key={l.n} className="card-premium group aspect-square grid place-items-center p-6">
              <div className="text-center">
                <div
                  className="mx-auto grid h-16 w-16 place-items-center rounded-2xl font-serif text-3xl italic text-primary-foreground transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, oklch(0.6 0.24 ${l.h}), oklch(0.35 0.18 ${l.h}))` }}
                >
                  {l.m}
                </div>
                <div className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">{l.n}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Heading label="Brand Identity Cards" sub="Colour · type · usage" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[295, 280].map((h, i) => (
            <div key={h} className="card-premium p-7">
              <div className="flex items-center justify-between">
                <span className="font-serif italic text-2xl text-primary">{i ? "Abay Studio" : "Kora Coffee"}</span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Identity v1</span>
              </div>
              <div className="mt-6 flex gap-2">
                {[0.75, 0.55, 0.35, 0.18].map((l) => (
                  <div key={l} className="h-14 flex-1 rounded-xl" style={{ background: `oklch(${l} 0.2 ${h})` }} />
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div><div className="text-foreground text-2xl font-light">Aa</div>Display · Serif</div>
                <div><div className="text-foreground text-2xl font-light">Aa</div>Body · Sans</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Heading label="Promotional Posters" sub="Print · social · events" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["Grand Opening", "Summer Sale", "Live Night"].map((t, i) => (
            <div
              key={t}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border p-5 flex flex-col justify-between"
              style={{ background: `linear-gradient(170deg, oklch(0.45 0.22 ${285 + i * 12}), oklch(0.1 0.04 290))` }}
            >
              <span className="text-[9px] uppercase tracking-[0.35em] text-foreground/70">KMS · 2026</span>
              <div>
                <div className="font-serif italic text-3xl md:text-4xl leading-none transition-transform duration-500 group-hover:-translate-y-1">{t}</div>
                <div className="mt-3 h-px w-12 bg-foreground/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const sites = [
  { name: "Agency Site", url: "kmscreative.lovable.app", demo: "https://kmscreative.lovable.app", features: ["Multi-page", "Glass UI", "Telegram orders"], hue: 295 },
  { name: "Restaurant Landing", url: "demo-restaurant.app", features: ["QR menu", "Booking button", "Mobile-first"], hue: 280 },
  { name: "Creator Portfolio", url: "demo-portfolio.app", features: ["Video gallery", "Fast loading", "SEO ready"], hue: 305 },
];

function WebShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {sites.map((s) => (
        <div key={s.name} className="card-premium group overflow-hidden flex flex-col">
          {/* browser mockup */}
          <div className="border-b border-border/60">
            <div className="flex items-center gap-1.5 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-foreground/25" />
              <span className="h-2 w-2 rounded-full bg-foreground/25" />
              <span className="h-2 w-2 rounded-full bg-foreground/25" />
              <span className="ml-3 truncate rounded-full bg-foreground/5 px-3 py-0.5 text-[10px] text-muted-foreground">{s.url}</span>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden" style={{ background: `linear-gradient(160deg, oklch(0.2 0.08 ${s.hue}), oklch(0.08 0.02 ${s.hue}))` }}>
              <div className="absolute inset-0 p-5 transition-transform duration-700 group-hover:-translate-y-3">
                <div className="h-2 w-16 rounded-full bg-primary/70" />
                <div className="mt-4 h-4 w-3/4 rounded bg-foreground/70" />
                <div className="mt-2 h-4 w-1/2 rounded bg-foreground/40" />
                <div className="mt-4 h-6 w-24 rounded-full bg-primary" />
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((k) => <div key={k} className="h-12 rounded-lg bg-foreground/10" />)}
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-1 flex-col">
            <h4 className="text-lg font-light tracking-tight">{s.name}</h4>
            <div className="mt-3 flex gap-3 text-muted-foreground">
              <Monitor className="h-3.5 w-3.5" /><Smartphone className="h-3.5 w-3.5" /><Zap className="h-3.5 w-3.5" />
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground flex-1">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" />{f}</li>
              ))}
            </ul>
            {s.demo ? (
              <a href={s.demo} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-all hover:bg-primary/20 hover:scale-[1.03]">
                <ExternalLink className="h-3 w-3" /> Live demo
              </a>
            ) : (
              <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Demo coming soon
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Returns the showcase for a service, or null to use the default gallery. */
export function ServiceShowcase({ slug }: { slug: string }) {
  if (slug === "video-production" || slug === "motion-graphics") return <VideoShowcase />;
  if (slug === "graphic-design") return <DesignShowcase />;
  if (slug === "web-development") return <WebShowcase />;
  return null;
}

export function hasShowcase(slug: string) {
  return ["video-production", "motion-graphics", "graphic-design", "web-development"].includes(slug);
}
