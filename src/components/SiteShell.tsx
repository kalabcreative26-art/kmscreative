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
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShaderBackground } from "@/components/ShaderBackground";
import { useTheme } from "@/hooks/use-theme";

export const TELEGRAM_URL = "https://t.me/kalabms";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  hash?: boolean;
  exact?: boolean;
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
  const [expanded, setExpanded] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const signedIn = useSignedIn();
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useRouterState({ select: (s) => s.location.pathname });

  // Collapse on outside click / esc
  useEffect(() => {
    if (!expanded) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setExpanded(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  // Collapse on route change
  useEffect(() => { setExpanded(false); }, [location]);

  const items: NavItem[] = [
    { to: "/", label: "Home", icon: Home, exact: true },
    { to: "/about", label: "About", icon: UserRound },
    { to: "/#services", label: "Services", icon: Layers, hash: true },
    signedIn
      ? { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
      : { to: "/auth", label: "Login", icon: LogIn },
  ];

  return (
    <div ref={rootRef} className="fixed top-4 inset-x-0 z-50 flex justify-center px-3">
      <div
        className={`glass glass-specular relative flex items-center rounded-full overflow-hidden gap-1 pl-3 pr-2 py-2 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          expanded ? "w-[min(96vw,780px)]" : "w-[min(96vw,360px)] md:w-[min(96vw,780px)]"
        }`}
        style={{ borderRadius: 9999 }}
      >
        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-2 shrink-0 pr-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow), inset 0 1px 0 rgba(255,255,255,0.4)" }}
          >
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:inline text-[11px] font-semibold tracking-[0.22em] uppercase whitespace-nowrap">
            KMs<span className="text-primary">·</span>Creative
          </span>
        </Link>

        {/* Nav items — always visible on md+, toggle on mobile */}
        <div
          className={`relative z-10 flex items-center gap-1 flex-1 min-w-0 md:flex ${
            expanded ? "flex" : "hidden"
          }`}
        >
          {items.map((it) => {
            const Icon = it.icon;
            const active =
              !it.hash &&
              (it.exact ? location === it.to : location.startsWith(it.to));
            const base = `group relative flex items-center justify-center gap-1.5 flex-1 min-w-0 px-3 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
              active
                ? "text-primary-foreground"
                : "text-foreground/80 hover:text-foreground hover:bg-white/5"
            }`;
            const activeBg = active
              ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }
              : undefined;
            return it.hash ? (
              <a key={it.to} href={it.to} className={base} style={activeBg}>
                <Icon className="h-3.5 w-3.5" />
                <span className="truncate">{it.label}</span>
              </a>
            ) : (
              <Link key={it.to} to={it.to} className={base} style={activeBg}>
                <Icon className="h-3.5 w-3.5" />
                <span className="truncate">{it.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right cluster */}
        <div className="relative z-10 flex items-center gap-1.5 shrink-0 ml-auto">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid place-items-center w-9 h-9 rounded-full text-foreground/80 hover:text-primary transition-colors"
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
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse menu" : "Expand menu"}
            aria-expanded={expanded}
            className="md:hidden grid place-items-center w-9 h-9 rounded-full text-foreground hover:text-primary transition-all"
            style={{ background: "var(--glass-tint-strong)" }}
          >
            <div className="relative w-4 h-4">
              <Menu className={`h-4 w-4 absolute inset-0 transition-all duration-300 ${expanded ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`} />
              <X className={`h-4 w-4 absolute inset-0 transition-all duration-300 ${expanded ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/40 py-12 mt-24">
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
  return <ShaderBackground />;
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
