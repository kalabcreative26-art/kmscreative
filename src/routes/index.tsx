import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Film, Sparkles, Palette, Mail, ArrowRight, Play, Send } from "lucide-react";
import { toast } from "sonner";

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

const TELEGRAM_USERNAME = "kalabms";

function sendInquiry() {
  const message = `Hi! I'd like to discuss a video editing / motion graphics project. Here's my brief:\n\n• Project type:\n• Timeline:\n• Reference / vision:`;
  try {
    navigator.clipboard?.writeText(message);
    toast.success("Inquiry template copied", { description: "Paste it into Telegram to start the conversation." });
  } catch {
    // ignore
  }
  window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "KMS Creative — Cinematic Video Editing & Motion Graphics" },
      {
        name: "description",
        content:
          "Professional video editing and motion graphics that turn raw footage into cinematic stories. High-retention, premium edits for brands and creators.",
      },
    ],
  }),
});

const services = [
  {
    icon: Film,
    title: "Professional Video Editing",
    desc: "Clean, rhythmic cuts and narrative-driven storytelling.",
    tag: "01",
  },
  {
    icon: Sparkles,
    title: "Motion Graphics",
    desc: "Custom animations, titles, and VFX that add a premium, cinematic feel.",
    tag: "02",
  },
  {
    icon: Palette,
    title: "Color Grading",
    desc: "Cinematic color correction to give your footage a high-end, professional look.",
    tag: "03",
  },
];

function Index() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = Math.min(scrollY / 1400, 1);

  return (
    <main
      className="relative min-h-screen text-foreground antialiased selection:bg-primary/30 overflow-hidden scroll-smooth"
      style={{
        background: `
          radial-gradient(ellipse at 50% -10%, oklch(0.22 0.04 80 / ${0.5 - t * 0.2}), transparent 55%),
          radial-gradient(ellipse at 80% ${90 - t * 20}%, oklch(0.14 0.02 60 / ${0.4 + t * 0.2}), transparent 60%),
          linear-gradient(180deg, oklch(0.05 0.002 280), oklch(0.03 0.002 280))
        `,
        transition: "background 0.6s ease-out",
      }}
    >
      {/* ambient grain / vignette */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div
        className="pointer-events-none fixed top-1/3 -left-32 w-[420px] h-[420px] rounded-full blur-[140px] opacity-[0.12] animate-pulse"
        style={{ background: "oklch(0.7 0.12 80)", animationDuration: "7s" }}
      />
      <div
        className="pointer-events-none fixed bottom-1/4 -right-32 w-[480px] h-[480px] rounded-full blur-[160px] opacity-[0.08] animate-pulse"
        style={{ background: "oklch(0.5 0.08 60)", animationDuration: "9s", animationDelay: "1s" }}
      />

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Play className="h-3.5 w-3.5 text-primary fill-primary" />
            </div>
            <span className="font-medium text-sm tracking-[0.2em] uppercase">
              KMS<span className="text-primary"> · </span>Studio
            </span>
          </div>
          <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.25em] font-medium text-muted-foreground">
            <a href="#work" className="hover:text-primary transition-colors">Work</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <button
            type="button"
            onClick={sendInquiry}
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Inquire
          </button>
          <a
            href="#contact"
            className="md:hidden inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
          >
            Inquire
          </a>
        </nav>
      </header>

      <div className="pt-32 pb-20">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 relative mb-40 md:mb-56">
          <div className="relative flex flex-col items-start max-w-4xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/5 text-primary text-[10px] uppercase tracking-[0.3em] font-semibold mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Now booking · 2026
              </div>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.02] mb-10 tracking-[-0.02em]">
                Turning Raw Footage
                <br />
                Into <span className="font-serif italic font-normal text-primary">Cinematic</span> Stories.
              </h1>
            </Reveal>

            <Reveal delay={280}>
              <p className="text-base md:text-xl text-muted-foreground font-light leading-relaxed mb-12 max-w-2xl">
                Professional video editing and motion graphics that demand attention and drive engagement.
                Let's make your next project unforgettable.
              </p>
            </Reveal>

            <Reveal delay={420}>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a
                  href="#work"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:opacity-90 hover:scale-[1.02] text-primary-foreground rounded-full text-sm font-semibold uppercase tracking-[0.15em] transition-[var(--transition-smooth)] active:scale-95"
                  style={{ boxShadow: "var(--shadow-glow)" }}
                >
                  View Portfolio
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  type="button"
                  onClick={sendInquiry}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-card hover:scale-[1.02] border border-border hover:border-primary/40 rounded-full text-sm font-semibold uppercase tracking-[0.15em] transition-[var(--transition-smooth)] active:scale-95"
                >
                  Let's Collaborate
                </button>
              </div>
            </Reveal>
          </div>

          {/* Showreel placeholder strip */}
          <Reveal delay={600} className="mt-24 md:mt-32">
            <div className="relative group">
              <div
                className="absolute -inset-1 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"
                style={{ background: "var(--gradient-primary)" }}
              />
              <div
                id="work"
                className="relative aspect-[16/9] bg-card rounded-3xl overflow-hidden border border-border flex items-center justify-center"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 40%, oklch(0.25 0.06 80 / 0.6), transparent 50%), radial-gradient(circle at 70% 60%, oklch(0.18 0.04 60 / 0.5), transparent 50%)",
                  }}
                />
                <button
                  type="button"
                  onClick={sendInquiry}
                  className="relative z-10 flex flex-col items-center gap-4 group/play"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-primary/40 bg-background/40 backdrop-blur-md flex items-center justify-center group-hover/play:scale-110 group-hover/play:bg-primary group-hover/play:border-primary transition-all duration-500">
                    <Play className="h-8 w-8 md:h-10 md:w-10 text-primary group-hover/play:text-primary-foreground fill-current ml-1 transition-colors" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-muted-foreground group-hover/play:text-primary transition-colors">
                    Showreel · 2026
                  </span>
                </button>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
                  <span>● REC</span>
                  <span>4K · 24fps</span>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ABOUT */}
        <section id="about" className="max-w-6xl mx-auto px-6 mb-40 md:mb-56">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
            <Reveal className="md:col-span-5">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">About</span>
              <h2 className="text-4xl md:text-6xl font-light mt-6 tracking-tight leading-[1.05]">
                Precision Meets <span className="font-serif italic text-primary">Creativity</span>.
              </h2>
            </Reveal>
            <Reveal delay={180} className="md:col-span-7">
              <p className="text-base md:text-lg text-muted-foreground font-light leading-[1.8]">
                I am a dedicated editor and motion designer specializing in high-retention content.
                My process blends technical precision in Adobe Premiere Pro and After Effects with a deep
                understanding of visual storytelling. I don't just edit videos; I craft experiences that
                elevate brands and captivate audiences. Whether it is commercial, social media, or
                long-form storytelling, I bring a polished, professional finish to every frame.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
                {[
                  { k: "Premiere Pro", v: "Editing" },
                  { k: "After Effects", v: "Motion" },
                  { k: "DaVinci", v: "Color" },
                ].map((s) => (
                  <div key={s.k}>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{s.v}</div>
                    <div className="text-sm font-medium tracking-tight">{s.k}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="max-w-6xl mx-auto px-6 mb-40 md:mb-56">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Services</span>
                <h2 className="text-4xl md:text-5xl font-light mt-6 tracking-tight">
                  Crafted for screens that <span className="font-serif italic text-primary">command</span> attention.
                </h2>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Three disciplines. One obsession with finish quality.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/60 rounded-3xl overflow-hidden border border-border/60">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <div className="group relative h-full p-10 bg-background/60 hover:bg-card transition-[var(--transition-smooth)] cursor-default">
                  <div className="flex items-center justify-between mb-12">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/60 font-mono">{s.tag}</span>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <s.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-light mb-4 tracking-tight">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light">{s.desc}</p>
                  <div
                    className="absolute bottom-0 left-0 h-px w-0 bg-primary group-hover:w-full transition-all duration-700"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="max-w-6xl mx-auto px-6 relative">
          <div
            className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20"
            style={{ background: "var(--gradient-primary)" }}
          />

          <div className="relative text-center max-w-3xl mx-auto">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Contact</span>
              <h2 className="font-light text-5xl md:text-7xl mt-6 mb-8 tracking-[-0.02em] leading-[1.05]">
                Let's Create Something <span className="font-serif italic text-primary">Great</span>.
              </h2>
              <p className="text-muted-foreground mb-14 text-lg font-light max-w-xl mx-auto leading-relaxed">
                I am currently accepting new projects. Let's discuss your vision and see how we can bring it to life.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <button
                type="button"
                onClick={sendInquiry}
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary hover:opacity-90 hover:scale-[1.02] text-primary-foreground rounded-full text-sm font-semibold uppercase tracking-[0.2em] transition-[var(--transition-smooth)] active:scale-95"
                style={{ boxShadow: "var(--shadow-glow)" }}
              >
                <Send className="h-4 w-4" />
                Send an Inquiry
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Reveal>

            <Reveal delay={350}>
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                <a href="mailto:kalabcreative26@gmail.com" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  kalabcreative26@gmail.com
                </a>
                <span className="hidden sm:block w-px h-4 bg-border" />
                <a href="https://t.me/kalabms" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                  <Send className="h-4 w-4" />
                  @kalabms
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-12 mt-32">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
          <p>© {new Date().getFullYear()} KMS Studio · All rights reserved</p>
          <p>Edited frame by frame · by Kalab</p>
        </div>
      </footer>
    </main>
  );
}
