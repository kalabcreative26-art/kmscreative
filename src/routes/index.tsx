import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Palette, Video, QrCode, PenTool, Phone, Mail, Send, Sparkles, Globe, CreditCard, MousePointerClick } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import logo from "@/assets/kms-logo.jpg";

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
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="KMS Creative logo" className="h-8 w-8 rounded-md object-cover" />
            <span className="font-medium text-base tracking-tight">
              KMS <span className="text-primary">Creative</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <a
            href="#contact"
            className="md:hidden inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Get in touch
          </a>
        </nav>
      </header>

      <div className="pt-32 pb-20">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 relative mb-32 md:mb-40">
          <div
            className="absolute -top-24 -left-20 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-60"
            style={{ background: "var(--gradient-primary)" }}
          />

          <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <Sparkles className="h-3 w-3" />
              Creative Studio
            </div>

            <h1 className="text-5xl md:text-8xl font-light leading-[1.05] mb-8 tracking-tight">
              Design that <span className="font-serif italic font-medium text-primary">speaks</span>.<br />
              Stories that <span className="font-serif italic font-medium text-primary">stick</span>.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
              I'm Kalab — founder of KMS Creative. I craft logos, graphic design, video edits, and QR menus that elevate brands.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#services"
                className="inline-flex items-center justify-center px-10 py-4 bg-primary hover:opacity-90 text-primary-foreground rounded-full font-semibold transition-[var(--transition-smooth)] active:scale-95"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                Explore services
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-10 py-4 bg-card/40 hover:bg-accent border border-border rounded-full font-semibold transition-[var(--transition-smooth)] active:scale-95"
              >
                Start a project
              </a>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="mt-24 md:mt-32 relative max-w-2xl mx-auto group">
            <div
              className="absolute -inset-1 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div
              className="relative aspect-square md:aspect-[4/3] bg-card rounded-3xl overflow-hidden flex items-center justify-center border border-border"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              <img src={logo} alt="KMS Creative" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="max-w-6xl mx-auto px-6 mb-32 md:mb-40">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">What I do</span>
            <h2 className="text-4xl md:text-5xl font-light mt-6 mb-4 tracking-tight">
              Services tailored to your brand
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Tap a card to read the full details — then hit{" "}
              <span className="text-primary font-medium">Order on Telegram</span> only when you're ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setOpenService(i)}
                className="group relative text-left p-8 rounded-3xl bg-card/40 border border-border/60 hover:bg-card hover:border-primary/30 transition-[var(--transition-smooth)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <div className="flex justify-between items-start mb-10">
                  <div
                    className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/15 group-hover:scale-110 group-hover:bg-primary/20 transition-[var(--transition-smooth)]"
                  >
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground border border-border px-2.5 py-1 rounded-full group-hover:border-primary/30 group-hover:text-primary transition-colors">
                    <MousePointerClick className="h-3 w-3" />
                    Tap for details
                  </span>
                </div>
                <h3 className="text-2xl font-light mb-3 tracking-tight">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-10">{s.desc}</p>
                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest items-center">
                  <span className="text-primary opacity-70 group-hover:opacity-100 transition-opacity">Read First</span>
                  <span className="text-muted-foreground/40">→</span>
                  <span className="text-primary opacity-70 group-hover:opacity-100 transition-opacity">Order After</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="max-w-6xl mx-auto px-6 relative">
          <div
            className="absolute -bottom-40 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-40"
            style={{ background: "var(--gradient-primary)" }}
          />

          <div className="relative text-center max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Contact us</span>
            <h2 className="font-serif text-5xl md:text-7xl italic font-medium mt-6 mb-8 tracking-tight">
              Have a project in mind?
            </h2>
            <p className="text-muted-foreground mb-16 text-lg">
              Reach out through any channel below — I'd love to hear about your idea.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="tel:+251978792495"
                className="flex flex-col items-center p-10 rounded-3xl bg-card/40 border border-border/60 hover:bg-card hover:border-primary/30 transition-[var(--transition-smooth)] group"
              >
                <Phone className="h-9 w-9 text-primary mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.25} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">Phone</span>
                <span className="text-base md:text-lg font-medium tracking-tight">+251 978 792 495</span>
              </a>

              <a
                href="https://t.me/kalabms"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center p-10 rounded-3xl bg-card/40 border border-border/60 hover:bg-card hover:border-primary/30 transition-[var(--transition-smooth)] group"
              >
                <Send className="h-9 w-9 text-primary mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.25} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">Telegram</span>
                <span className="text-base md:text-lg font-medium tracking-tight">@kalabms</span>
              </a>

              <a
                href="mailto:kalabcreative26@gmail.com"
                className="flex flex-col items-center p-10 rounded-3xl bg-card/40 border border-border/60 hover:bg-card hover:border-primary/30 transition-[var(--transition-smooth)] group"
              >
                <Mail className="h-9 w-9 text-primary mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.25} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">Email</span>
                <span className="text-sm md:text-base font-medium tracking-tight break-all px-2">kalabcreative26@gmail.com</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-16 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          <img src={logo} alt="" className="w-12 h-12 rounded-xl object-cover mb-8 shadow-2xl" />
          <p className="text-muted-foreground text-sm mb-3 font-medium tracking-wide">
            © {new Date().getFullYear()} KMS Creative. All rights reserved.
          </p>
          <p className="text-muted-foreground/60 text-[10px] uppercase tracking-[0.3em] font-bold">
            Crafted with care by Kalab.
          </p>
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
