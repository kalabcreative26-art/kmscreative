import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Send } from "lucide-react";
import { PageShell, TELEGRAM_URL } from "@/components/SiteShell";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — KMs Creative" },
      {
        name: "description",
        content:
          "Multi-disciplinary creative expert specializing in Premiere Pro, After Effects, Alight Motion, brand design and web development.",
      },
      { property: "og:title", content: "About — KMs Creative" },
      {
        property: "og:description",
        content: "Meet the creative behind KMs Creative.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <PageShell>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">About</span>
        <h1 className="text-5xl md:text-7xl font-light mt-6 mb-12 tracking-[-0.02em] leading-[1.05]">
          A multi-disciplinary{" "}
          <span className="font-serif italic text-primary">creative</span> expert.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light leading-[1.8] max-w-3xl">
          I am a multi-disciplinary creative expert. My process combines advanced technical skills in
          Adobe Premiere Pro, After Effects, and Alight Motion with a passion for clean, modern design.
          Whether I am developing a website, designing a brand identity, or editing cinematic video, my
          goal is to deliver professional, high-quality results that make your business stand out.
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border/60 pt-10">
          {[
            { k: "Premiere Pro", v: "Video" },
            { k: "After Effects", v: "Motion" },
            { k: "Alight Motion", v: "Mobile" },
            { k: "React / TS", v: "Web" },
          ].map((s) => (
            <div key={s.k}>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{s.v}</div>
              <div className="text-sm font-medium tracking-tight">{s.k}</div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-primary-foreground rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-transform"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Send className="h-4 w-4" />
            Get Started
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </PageShell>
  );
}
