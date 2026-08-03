import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Send } from "lucide-react";
import { PageShell, TELEGRAM_URL } from "@/components/SiteShell";
import { services } from "@/lib/services";

const EXTERNAL_URL = "https://kmscreative.vercel.app";

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
  beforeLoad: () => {
    throw redirect({ href: EXTERNAL_URL });
  },
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
        content: "KMs Creative — high-end video production, motion graphics, brand design and full-stack web development built with precision and style.",
      },
      { "http-equiv": "refresh", content: `0; url=${EXTERNAL_URL}` },
    ],
    links: [{ rel: "canonical", href: EXTERNAL_URL }],
  }),
});

function Home() {
  useEffect(() => {
    window.location.replace(EXTERNAL_URL);
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4">KMs Creative</p>
        <h1 className="text-2xl font-light tracking-tight text-foreground">Redirecting…</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          If you are not redirected,{" "}
          <a href={EXTERNAL_URL} className="text-primary underline underline-offset-4">
            tap here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
