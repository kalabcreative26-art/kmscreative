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
