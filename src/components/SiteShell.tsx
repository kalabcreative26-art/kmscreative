import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  UserRound,
  Layers,
  LogIn,
  LayoutDashboard,
  Send,
  Sun,
  Moon,
  Menu,
  X,
  Settings,
  Mail,
} from "lucide-react";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import kmsLogo from "@/assets/kms-logo.jpg.asset.json";
import { ShaderBackground } from "@/components/ShaderBackground";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSiteSettings } from "@/hooks/use-site-settings";

const GlassArtefact = lazy(() =>
  import("@/components/GlassArtefact").then((m) => ({ default: m.GlassArtefact })),
);

export const TELEGRAM_URL = "https://t.me/kalabms";
export const TIKTOK_URL = "https://www.tiktok.com/@kms_creative16?_r=1&_t=ZS-9AeHYgayzrU";

/** Official TikTok mark (the icon library has no brand glyphs). */
export function TikTokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  hash?: boolean;
  exact?: boolean;
  external?: boolean;
};


function useSignedIn() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return signedIn;
}

export function SiteNav() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { settings } = useSiteSettings();
  const location = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const items: NavItem[] = [
    { to: "/", label: "Home", icon: Home, exact: true },
    { to: "/about", label: "About", icon: UserRound },
    { to: "/#services", label: "Services", icon: Layers, hash: true },
    {
      to: settings.telegram_url || TELEGRAM_URL,
      label: "Contact",
      icon: Mail,
      hash: true,
      external: true,
    },
  ];


  const isActive = (it: NavItem) =>
    !it.hash && (it.exact ? location === it.to : location.startsWith(it.to));

  const renderItem = (it: NavItem, variant: "desktop" | "mobile") => {
    const Icon = it.icon;
    const active = isActive(it);
    const base =
      variant === "desktop"
        ? `flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
            active ? "text-white" : "text-foreground/85 hover:text-foreground hover:bg-white/5"
          }`
        : `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
            active ? "text-white" : "text-foreground/85 hover:bg-white/5"
          }`;
    const activeStyle = active
      ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }
      : undefined;
    return it.hash ? (
      <a
        key={it.to}
        href={it.to}
        {...(it.external ? { target: "_blank", rel: "noreferrer" } : {})}
        className={base}
        style={activeStyle}
      >
        <Icon className={variant === "desktop" ? "h-3.5 w-3.5" : "h-4 w-4"} />
        <span>{it.label}</span>
      </a>
    ) : (
      <Link key={it.to} to={it.to} className={base} style={activeStyle}>
        <Icon className={variant === "desktop" ? "h-3.5 w-3.5" : "h-4 w-4"} />
        <span>{it.label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-3">
      <div className="w-[min(96vw,860px)]">
        {/* Top bar */}
        <div
          className="glass glass-specular relative flex items-center gap-1 pl-3 pr-2 py-2"
          style={{ borderRadius: 9999 }}
        >
          <Link to="/" className="relative z-10 flex items-center gap-2 shrink-0 pr-2" aria-label="KMS Creative home">
            <span
              className="grid place-items-center h-9 rounded-full px-2.5 shrink-0 bg-white"
              style={{ boxShadow: "var(--shadow-glow), inset 0 1px 0 rgba(255,255,255,0.4)" }}
            >
              <img
                src={kmsLogo.url}
                alt="KMS Creative logo"
                className="h-5 w-auto object-contain"
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="relative z-10 hidden md:flex items-center gap-1 flex-1 min-w-0 justify-center">
            {items.map((it) => renderItem(it, "desktop"))}
          </div>

          <div className="relative z-10 flex items-center gap-1.5 shrink-0 ml-auto">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid place-items-center w-9 h-9 rounded-full text-foreground/85 hover:text-primary transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <Send className="h-3 w-3" />
              Inquire
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="KMS Creative on TikTok"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <TikTokIcon className="h-3 w-3" />
              TikTok
            </a>
            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden grid place-items-center w-9 h-9 rounded-full text-foreground/85 hover:text-primary transition-colors"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu sheet */}
        {open && (
          <div
            className="glass glass-specular md:hidden mt-2 p-2 rounded-3xl flex flex-col gap-1"
            style={{ borderRadius: 24 }}
          >
            {items.map((it) => renderItem(it, "mobile"))}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <Send className="h-4 w-4" />
              Inquire
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <TikTokIcon className="h-4 w-4" />
              TikTok
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/40 py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
        <p>© {new Date().getFullYear()} KMS Creative · All rights reserved</p>
        <div className="flex items-center gap-7">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            t.me/kalabms
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="KMS Creative on TikTok"
            className="inline-flex items-center gap-2.5 hover:text-primary transition-colors"
          >
            <TikTokIcon className="h-3.5 w-3.5" />
            <span>TikTok</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export function PageBackground() {
  const isMobile = useIsMobile();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Skip heavy 3D artefact on mobile & when user prefers reduced motion.
  const showArtefact = !isMobile && !reducedMotion;

  return (
    <>
      <ShaderBackground lowPower={isMobile || reducedMotion} />
      {showArtefact && (
        <Suspense fallback={null}>
          <GlassArtefact />
        </Suspense>
      )}
    </>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen text-foreground antialiased selection:bg-primary/30 overflow-x-hidden scroll-smooth">
      <PageBackground />
      <SiteNav />
      <div className="pt-28 relative z-10">{children}</div>
      <SiteFooter />
    </main>
  );
}
