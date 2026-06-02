import { Link } from "@tanstack/react-router";
import { Sparkles, Send } from "lucide-react";
import type { ReactNode } from "react";

export const TELEGRAM_URL = "https://t.me/kalabms";

export function SiteNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg border border-primary/30 flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-medium text-sm tracking-[0.2em] uppercase">
            KMs<span className="text-primary"> · </span>Creative
          </span>
        </Link>
        <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.25em] font-medium text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>About</Link>
          <a href="/#services" className="hover:text-primary transition-colors">Services</a>
        </div>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Send className="h-3 w-3" />
          Get Started
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
        <p>© {new Date().getFullYear()} KMs Creative · All rights reserved</p>
        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
          t.me/kalabms
        </a>
      </div>
    </footer>
  );
}

export function PageBackground() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% -10%, oklch(0.3 0.18 295 / 0.4), transparent 55%), radial-gradient(ellipse at 80% 90%, oklch(0.25 0.15 280 / 0.35), transparent 60%), linear-gradient(180deg, oklch(0.05 0.012 285), oklch(0.03 0.008 285))",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div
        className="pointer-events-none fixed top-1/3 -left-32 w-[420px] h-[420px] rounded-full blur-[140px] opacity-30 -z-10 animate-pulse"
        style={{ background: "oklch(0.55 0.25 295)", animationDuration: "7s" }}
      />
      <div
        className="pointer-events-none fixed bottom-1/4 -right-32 w-[480px] h-[480px] rounded-full blur-[160px] opacity-20 -z-10 animate-pulse"
        style={{ background: "oklch(0.45 0.22 280)", animationDuration: "9s", animationDelay: "1s" }}
      />
    </>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen text-foreground antialiased selection:bg-primary/30 overflow-hidden scroll-smooth">
      <PageBackground />
      <SiteNav />
      <div className="pt-24">{children}</div>
      <SiteFooter />
    </main>
  );
}
