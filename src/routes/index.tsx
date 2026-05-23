import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Palette, Video, QrCode, PenTool, Phone, Mail, Send, Sparkles, Globe, CreditCard, MousePointerClick } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import logo from "@/assets/kms-logo.jpg";

const TELEGRAM_USERNAME = "kalabms";

function orderOnTelegram(serviceTitle: string) {
  const message = `Hi Kalab! 👋 I'd like to order: ${serviceTitle}. Please share details on pricing, timeline, and what you need from me to get started.`;
  try {
    navigator.clipboard?.writeText(message);
    toast.success("Order message copied!", {
      description: "Paste it in the Telegram chat that just opened.",
    });
  } catch {
    // ignore clipboard failures
  }
  window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

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
    details:
      "Your logo is the face of your brand — and I make sure it tells the right story. I design custom, original logos built around your business, your audience, and your vision. Every project starts with understanding what makes you unique, then I sketch and refine multiple concepts until we land on something powerful. You'll get a clean, scalable logo that looks sharp on a business card, a billboard, a phone screen, or a t-shirt. Final delivery includes all file formats (PNG, JPG, SVG, PDF), light and dark versions, and a simple guide on how to use it. Unlimited revisions until you genuinely love it.",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    desc: "Eye-catching graphics for social media, print, and web.",
    details:
      "I create graphics that stop the scroll and make your brand impossible to ignore. Social media posts, story templates, Instagram and Facebook ads, flyers, posters, banners, brochures, menus, packaging, event graphics, T-shirt designs — if it needs to look good, I can design it. Every piece is built to match your brand colors, fonts, and personality so everything you put out feels consistent and professional. Whether you need a single post or a full month of content, I deliver clean, modern designs that actually convert viewers into customers.",
  },
  {
    icon: Video,
    title: "Video Editing",
    desc: "Polished edits, transitions, and storytelling that hook viewers.",
    details:
      "I turn raw footage into videos people actually finish watching. Reels, TikToks, YouTube videos, wedding films, event highlights, business promos, product showcases, and ads — I handle it all. Each edit includes professional color grading, smooth transitions, sound design, music syncing, subtitles, motion graphics, and pacing that keeps the viewer locked in. I focus on storytelling first, then polish — because beautiful clips mean nothing if the message doesn't land. Quick turnaround, clean delivery, and revisions until it feels right.",
  },
  {
    icon: QrCode,
    title: "QR Code Menus",
    desc: "Modern digital menus for restaurants, cafés, and events.",
    details:
      "Skip the printing costs and outdated menus. I build sleek, mobile-friendly digital menus that your customers open instantly by scanning a QR code — no app, no signup. Perfect for restaurants, cafés, hotels, food trucks, and events. You can update prices, items, and photos anytime without reprinting anything. I design the menu to match your brand, organize it for easy browsing, and deliver a print-ready QR code you can stick on tables, walls, or receipts. Clean, fast, and saves you money every month.",
  },
  {
    icon: Globe,
    title: "Website Design & Publishing",
    desc: "Custom websites built and published for your business — fast, modern, and ready to go live.",
    details:
      "I design and build complete websites for businesses, restaurants, portfolios, personal brands, and small shops — then publish them so they're live on the internet, ready for the world. Every site is mobile-friendly, fast-loading, SEO-friendly, and crafted to match your brand. I handle the whole process: design, content layout, contact buttons, social links, photo galleries, hosting, and publishing. Best part — you can ask me to change anything anytime: text, photos, colors, new pages, new sections. Your website grows with your business.",
  },
  {
    icon: CreditCard,
    title: "Business Cards",
    desc: "Professionally designed business cards that leave a lasting impression on every client.",
    details:
      "First impressions matter, and a well-designed business card still beats a phone contact every time. I design premium, modern business cards that reflect your brand and feel valuable in someone's hand. Front and back designs, multiple style options (minimal, bold, luxury, creative), and proper print-ready files (PDF/PNG) with bleed, crop marks, and the right dimensions — so you can take them straight to any print shop without issues. Whether you need 50 cards or 5,000, I make sure yours stands out.",
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
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">What I do</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Services tailored to your brand</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Tap a card to read the full details — then hit{" "}
              <span className="text-primary font-medium">Order on Telegram</span> only when you're ready.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setOpenService(i)}
                className="group relative text-left rounded-2xl border border-border bg-card p-7 hover:border-primary/50 hover:-translate-y-1 transition-[var(--transition-smooth)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest px-2 py-1 border border-primary/20">
                  <MousePointerClick className="h-3 w-3" />
                  Tap for details
                </span>
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl mb-5"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-primary opacity-70 group-hover:opacity-100 transition-opacity">Read first → Order after</p>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Contact us</p>
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

      <Dialog open={openService !== null} onOpenChange={(o) => !o && setOpenService(null)}>
        <DialogContent className="sm:max-w-md">
          {active && (
            <>
              <DialogHeader>
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl mb-3"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <active.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <DialogTitle className="font-serif text-2xl">{active.title}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed pt-2">
                  {active.details}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs uppercase tracking-widest text-primary mb-2">Ready to order?</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Clicking below opens Telegram and sends me a message that you want{" "}
                  <span className="text-foreground font-medium">{active.title}</span> — no typing needed.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      orderOnTelegram(active.title);
                      setOpenService(null);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-[var(--transition-smooth)]"
                  >
                    <Send className="h-4 w-4" />
                    Order on Telegram
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenService(null)}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-card/40 px-5 py-2.5 text-sm font-medium hover:bg-accent transition-[var(--transition-smooth)]"
                  >
                    Not yet — keep browsing
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
