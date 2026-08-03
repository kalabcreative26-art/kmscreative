import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

const EXTERNAL_URL = "https://kmscreative.vercel.app";

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
      { property: "og:url", content: EXTERNAL_URL },
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
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4">
          KMs Creative
        </p>
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
