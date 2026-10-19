import { useRef } from "react";
import { Play, ExternalLink, Send, Zap, Smartphone, Gauge } from "lucide-react";
import { telegramLink } from "@/lib/telegram";
import { useSiteSettings } from "@/hooks/use-site-settings";
import shortPoster from "@/assets/work-short.jpg";
import longPoster from "@/assets/work-long.jpg";
import brandImg from "@/assets/work-brand.jpg";
import webImg from "@/assets/work-web.jpg";

type Clip = { title: string; meta: string; poster: string; src?: string };

// Drop a 5–10s MP4 into `src` and it will autoplay (muted) on hover.
const shortForm: Clip[] = [
  { title: "Creator Reel", meta: "9:16 · Captions", poster: shortPoster },
  { title: "Product Teaser", meta: "9:16 · Motion", poster: shortPoster },
  { title: "Event Recap", meta: "9:16 · Beat-synced", poster: shortPoster },
];
const longForm: Clip[] = [
  { title: "Cinematic Brand Film", meta: "16:9 · Colour grade", poster: longPoster },
  { title: "Motion Graphics Explainer", meta: "16:9 · 2D animation", poster: longPoster },
];

const designs = [
  { title: "Logo Mockups", meta: "Wordmarks & monograms", pos: "75% 30%" },
  { title: "Brand Identity Cards", meta: "Stationery & business cards", pos: "50% 50%" },
  { title: "Promotional Posters", meta: "Print & social", pos: "15% 50%" },
];

const sites = [
  {
    title: "SaaS Landing Page",
    url: "nexora.app",
    features: [
      { icon: Zap, label: "Fast loading" },
      { icon: Smartphone, label: "Mobile-first" },
      { icon: Gauge, label: "SEO ready" },
    ],
  },
  {
    title: "Studio Portfolio",
    url: "kmscreative.lovable.app",
    demo: "https://kmscreative.lovable.app",
    features: [
      { icon: Zap, label: "Animations" },
      { icon: Smartphone, label: "Responsive" },
      { icon: Gauge, label: "Published" },
    ],
  },
];

function VideoCard({ clip, vertical }: { clip: Clip; vertical?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-card/40 ${vertical ? "aspect-[9/16]" : "aspect-video"}`}
      onMouseEnter={() => ref.current?.src && ref.current.play().catch(() => {})}
      onMouseLeave={() => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      }}
    >
      <video
        ref={ref}
        src={clip.src}
        poster={clip.poster}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="glass grid h-12 w-12 place-items-center rounded-full text-primary transition-transform group-hover:scale-110">
          <Play className="h-5 w-5 fill-current" />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-sm font-semibold">{clip.title}</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{clip.meta}</p>
      </div>
    </div>
  );
}

function GroupTitle({ label, title, action }: { label: string; title: string; action?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">{label}</span>
        <h3 className="mt-2 text-2xl font-light tracking-tight md:text-3xl">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function PortfolioSection() {
  const { settings } = useSiteSettings();
  const ask = (service: string) => (
    <a
      href={telegramLink(settings.telegram_url, service)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary hover:bg-primary/20"
    >
      <Send className="h-3 w-3" /> Inquire
    </a>
  );

  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-28 space-y-24 px-6 py-24">
      <div>
        <span className="eyebrow">Selected Work</span>
        <h2 className="mt-6 max-w-2xl text-4xl font-light leading-[1.05] tracking-[-0.035em] md:text-6xl">
          Film, design and <span className="font-serif italic text-primary">the web.</span>
        </h2>
      </div>

      {/* Video */}
      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">Video Editing & Motion</span>
            <h3 className="mt-2 text-2xl font-light tracking-tight md:text-3xl">Short-Form Edits</h3>
          </div>
          {ask("Video Editing")}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {shortForm.map((c, i) => (
            <div key={c.title} className={i === 2 ? "hidden md:block" : ""}>
              <VideoCard clip={c} vertical />
            </div>
          ))}
        </div>
        <h3 className="mb-6 mt-12 text-2xl font-light tracking-tight md:text-3xl">Long-Form Edits</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {longForm.map((c) => (
            <VideoCard key={c.title} clip={c} />
          ))}
        </div>
      </div>

      {/* Design */}
      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <GroupTitle label="Logo & Graphic Design" title="Brand identity gallery" />
          {ask("Graphic Design")}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {designs.map((d) => (
            <figure key={d.title} className="group overflow-hidden rounded-2xl border border-border bg-card/40">
              <div className="aspect-square overflow-hidden">
                <img
                  src={brandImg}
                  alt={d.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  style={{ objectPosition: d.pos }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <figcaption className="p-4">
                <p className="text-sm font-semibold">{d.title}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{d.meta}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Web */}
      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <GroupTitle label="Website Development" title="Live site previews" />
          {ask("Website Development")}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {sites.map((s) => (
            <div key={s.title} className="group overflow-hidden rounded-2xl border border-border bg-card/40 transition-colors hover:border-primary/40">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="ml-3 truncate rounded-full bg-muted/40 px-3 py-0.5 text-[10px] text-muted-foreground">{s.url}</span>
              </div>
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={webImg}
                  alt={`${s.title} preview`}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {s.features.map((f) => (
                      <span key={f.label} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] text-primary">
                        <f.icon className="h-3 w-3" /> {f.label}
                      </span>
                    ))}
                  </div>
                </div>
                {s.demo && (
                  <a
                    href={s.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary-foreground"
                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                  >
                    Live demo <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
