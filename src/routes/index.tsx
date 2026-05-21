import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Palette, Video, QrCode, PenTool, Phone, Mail, Send, Sparkles, Globe, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import logo from "@/assets/kms-logo.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "KMS Creative — Logos, Graphics, Video Editing & QR Menus" },
      { name: "description", content: "KMS Creative designs logos, graphics, edits videos, and creates QR code menus. Classy, creative work by Kalab." },
    ],
  }),
});

const services = [
  {
    icon: PenTool,
    title: "Logo Design",
    desc: "Distinctive logos that capture your brand identity.",
    details: "I design unique, memorable logos that represent your brand's personality and values. You'll get multiple concepts, unlimited revisions until you're happy, and final files in all formats you need (PNG, JPG, SVG, PDF) — ready for web, print, social media, and merchandise.",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    desc: "Eye-catching graphics for social media, print, and web.",
    details: "From social media posts and story templates to flyers, posters, banners, brochures, and digital ads — I create scroll-stopping visuals tailored to your brand. Perfect for businesses that want a consistent, professional look across every platform.",
  },
  {
    icon: Video,
    title: "Video Editing",
    desc: "Polished edits, transitions, and storytelling that hook viewers.",
    details: "I edit videos for Reels, TikTok, YouTube, weddings, events, ads, and promotional content. This includes color grading, smooth transitions, sound design, subtitles, motion graphics, and music syncing — turning raw footage into content people actually watch.",
  },
  {
    icon: QrCode,
    title: "QR Code Menus",
    desc: "Modern digital menus for restaurants, cafés, and events.",
    details: "Custom digital menus accessed by scanning a QR code — no app needed. Great for restaurants, cafés, hotels, and events. Easy to update anytime, mobile-friendly, and styled to match your brand. Print-ready QR code included.",
  },
  {
    icon: Globe,
    title: "Website Design & Publishing",
    desc: "Custom websites built and published for your business — fast, modern, and ready to go live.",
    details: "I design and publish complete websites for businesses, portfolios, and personal brands. Mobile-responsive, fast-loading, SEO-friendly, and tailored to your goals. I handle everything from design to publishing — and updates whenever you need them.",
  },
  {
    icon: CreditCard,
    title: "Business Cards",
    desc: "Professionally designed business cards that leave a lasting impression on every client.",
    details: "Premium business card designs that match your brand. Front and back layouts, multiple style options, and print-ready files (PDF/PNG) delivered with proper bleed and dimensions — ready to take straight to any print shop.",
  },
];

function Index() {
  const [openService, setOpenService] = useState<number | null>(null);
  const active = openService !== null ? services[openService] : null;
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="KMS Creative logo" className="h-10 w-10 rounded-md object-cover" />
            <span className="font-serif text-xl tracking-wide">KMS <span className="text-primary">Creative</span></span>
          </div>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-[var(--transition-smooth)]"
          >
            Get in touch
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Creative Studio
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
              Design that <span className="italic text-primary">speaks</span>.
              <br /> Stories that <span className="italic text-primary">stick</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              I'm Kalab — founder of KMS Creative. I craft logos, graphic design, video edits, and QR menus that elevate brands.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#services" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-[var(--transition-smooth)]"
                style={{ boxShadow: "var(--shadow-elegant)" }}>
                Explore services
              </a>
              <a href="#contact" className="rounded-full border border-border bg-card/40 px-6 py-3 text-sm font-medium hover:bg-accent transition-[var(--transition-smooth)]">
                Start a project
              </a>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-60"
              style={{ background: "var(--gradient-primary)" }}
            />
            <img
              src={logo}
              alt="KMS Creative"
              className="relative z-10 rounded-2xl bg-card p-6 max-w-sm w-full"
              style={{ boxShadow: "var(--shadow-glow)" }}
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">What I do</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Services tailored to your brand</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setOpenService(i)}
                className="group text-left rounded-2xl border border-border bg-card p-7 hover:border-primary/50 hover:-translate-y-1 transition-[var(--transition-smooth)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl mb-5"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">Tap to learn more →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Let's connect</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            Have a project in mind?
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
            Reach out through any channel below — I'd love to hear about your idea.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href="tel:+251978792495"
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:-translate-y-1 transition-[var(--transition-smooth)]"
            >
              <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Phone</p>
              <p className="font-medium">+251 978 792 495</p>
            </a>
            <a
              href="https://t.me/kalabms"
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:-translate-y-1 transition-[var(--transition-smooth)]"
            >
              <Send className="h-6 w-6 text-primary mx-auto mb-3" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Telegram</p>
              <p className="font-medium">@kalabms</p>
            </a>
            <a
              href="mailto:kalabcreative26@gmail.com"
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:-translate-y-1 transition-[var(--transition-smooth)]"
            >
              <Mail className="h-6 w-6 text-primary mx-auto mb-3" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Email</p>
              <p className="font-medium text-sm break-all">kalabcreative26@gmail.com</p>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-6 w-6 rounded object-cover" />
            <span>© {new Date().getFullYear()} KMS Creative. All rights reserved.</span>
          </div>
          <p>Crafted with care by Kalab.</p>
        </div>
      </footer>
    </main>
  );
}
