import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Send } from "lucide-react";
import { PageShell, TELEGRAM_URL } from "@/components/SiteShell";
import { services } from "@/lib/services";

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"} ${className}`}
    >
      {children}
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "KMs Creative — Crafting Digital Excellence" },
      {
        name: "description",
        content:
          "KMs Creative — high-end video production, motion graphics, brand design and full-stack web development built with precision and style.",
      },
      { property: "og:title", content: "KMs Creative — Crafting Digital Excellence" },
      {
        property: "og:description",
        content: "Video, motion, design and web development. One studio. Premium results.",
      },
    ],
  }),
});

function Home() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-32 md:pt-24 md:pb-40">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] uppercase tracking-[0.3em] font-semibold mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Multi-disciplinary creative studio
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.02] tracking-[-0.02em] max-w-5xl">
            KMs Creative:{" "}
            <span className="font-serif italic font-normal" style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Crafting
            </span>{" "}
            Digital Excellence.
          </h1>
        </Reveal>

        <Reveal delay={280}>
          <p className="mt-10 text-base md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
            From high-end video production to full-stack website development, I bring your brand to life with precision and style.
          </p>
        </Reveal>

        <Reveal delay={420}>
          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <a
              href="#services"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-primary-foreground rounded-full text-sm font-semibold uppercase tracking-[0.15em] hover:scale-[1.02] active:scale-95 transition-transform"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              Explore Services
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-card border border-border hover:border-primary/40 rounded-full text-sm font-semibold uppercase tracking-[0.15em] transition-colors"
            >
              <Send className="h-4 w-4" />
              Get Started
            </a>
          </div>
        </Reveal>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="max-w-6xl mx-auto px-6 mb-32">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Services</span>
              <h2 className="text-4xl md:text-5xl font-light mt-6 tracking-tight max-w-2xl">
                Five disciplines.{" "}
                <span className="font-serif italic text-primary">One studio.</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Click any category to explore the work and start a project.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group relative block h-full p-8 rounded-2xl border border-border bg-card/40 hover:bg-card hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 30% 0%, oklch(0.55 0.25 295 / 0.18), transparent 70%)" }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-12">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/60 font-mono">
                      0{i + 1}
                    </span>
                    <div
                      className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                    >
                      <s.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-light mb-3 tracking-tight">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light mb-8">{s.short}</p>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-primary font-semibold">
                    Explore
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="work" className="max-w-6xl mx-auto px-6 mb-32">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Selected Work</span>
              <h2 className="text-4xl md:text-5xl font-light mt-6 tracking-tight max-w-2xl">
                A glimpse inside{" "}
                <span className="font-serif italic text-primary">KMs Creative.</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs font-light">
              Cinematic edits, identities and digital products — each crafted end-to-end in studio.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {[
            {
              tag: "Cinematic Edit",
              title: "Midnight Run",
              client: "Independent Short Film",
              desc: "Color-graded, rhythmically cut chase sequence with custom sound design and motion title cards.",
              meta: ["4K · DaVinci Resolve", "02:34 runtime", "2025"],
              gradient: "linear-gradient(135deg, oklch(0.35 0.18 295), oklch(0.18 0.08 285))",
              span: "md:col-span-4",
              tall: true,
            },
            {
              tag: "Motion Graphics",
              title: "Pulse Identity Reel",
              client: "Fintech Launch",
              desc: "Logo build, animated UI breakdowns and kinetic typography for a product launch trailer.",
              meta: ["After Effects", "0:45 loop"],
              gradient: "linear-gradient(135deg, oklch(0.45 0.22 305), oklch(0.22 0.1 290))",
              span: "md:col-span-2",
            },
            {
              tag: "Brand Identity",
              title: "Lumen & Co.",
              client: "Coffee Roastery",
              desc: "Wordmark, packaging system and full brand guidelines for a specialty roaster.",
              meta: ["Logo · Packaging", "Guidelines PDF"],
              gradient: "linear-gradient(135deg, oklch(0.4 0.16 300), oklch(0.2 0.06 280))",
              span: "md:col-span-2",
            },
            {
              tag: "Web Development",
              title: "Atelier Noir",
              client: "Luxury Boutique",
              desc: "Full-stack storefront with custom CMS, smooth-scroll storytelling and 99 Lighthouse score.",
              meta: ["Next.js · Stripe", "Custom CMS", "Live"],
              gradient: "linear-gradient(135deg, oklch(0.38 0.2 290), oklch(0.16 0.07 285))",
              span: "md:col-span-4",
            },
            {
              tag: "Color Grading",
              title: "Coastline",
              client: "Travel Documentary",
              desc: "Hand-graded LUTs and shot-matching across a 12-minute travel doc shot on three cameras.",
              meta: ["Resolve Studio", "Custom LUT pack"],
              gradient: "linear-gradient(135deg, oklch(0.42 0.18 295), oklch(0.18 0.09 280))",
              span: "md:col-span-3",
            },
            {
              tag: "Social Edit",
              title: "Daily Cuts",
              client: "Creator Channel",
              desc: "Weekly short-form edits — punchy pacing, captions and motion graphics built for the feed.",
              meta: ["Reels · Shorts · TikTok", "Weekly"],
              gradient: "linear-gradient(135deg, oklch(0.36 0.16 300), oklch(0.18 0.07 290))",
              span: "md:col-span-3",
            },
          ].map((w, i) => (
            <Reveal key={w.title} delay={i * 70} className={w.span}>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="group relative block h-full rounded-2xl border border-border bg-card/40 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div
                  className={`relative w-full ${w.tall ? "aspect-[16/10]" : "aspect-[4/3]"} overflow-hidden`}
                  style={{ background: w.gradient }}
                >
                  <div
                    className="absolute inset-0 opacity-60 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.4), transparent 50%)",
                    }}
                  />
                  <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(transparent 95%, rgba(255,255,255,0.6) 95%), linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.6) 95%)", backgroundSize: "24px 24px" }} />
                  <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/80 font-mono">
                    0{i + 1} / KMS
                  </div>
                  <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/40 backdrop-blur-md border border-primary-foreground/20 text-[10px] uppercase tracking-[0.25em] text-primary-foreground font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {w.tag}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-serif italic text-5xl md:text-7xl text-primary-foreground/90 group-hover:scale-105 transition-transform duration-700 select-none"
                      style={{ textShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
                    >
                      {w.title.split(" ")[0]}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-light tracking-tight">{w.title}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-3">{w.client}</p>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4">{w.desc}</p>
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-border/60">
                    {w.meta.map((m) => (
                      <span key={m} className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 font-mono">
                        {m}
                      </span>
                    )).reduce<ReactNode[]>((acc, el, idx) => {
                      if (idx > 0) acc.push(<span key={`dot-${idx}`} className="text-muted-foreground/30 text-[10px]">·</span>);
                      acc.push(el);
                      return acc;
                    }, [])}
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-primary hover:underline font-semibold"
            >
              Request the full portfolio
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </Reveal>
      </section>


      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <Reveal>
          <h2 className="font-light text-4xl md:text-5xl tracking-[-0.02em] leading-[1.1] mb-6">
            Ready to{" "}
            <span className="font-serif italic text-primary">stand out?</span>
          </h2>
          <p className="text-muted-foreground mb-10 text-lg font-light max-w-xl mx-auto">
            Let's talk about your project on Telegram and bring your vision to life.
          </p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-primary-foreground rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-transform"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Send className="h-4 w-4" />
            Get Started on Telegram
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Reveal>
      </section>
    </PageShell>
  );
}
