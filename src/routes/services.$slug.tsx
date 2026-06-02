import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Send, Check } from "lucide-react";
import { PageShell, TELEGRAM_URL } from "@/components/SiteShell";
import { getService, services } from "@/lib/services";

export const Route = createFileRoute("/services/$slug")({
  component: ServicePage,
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.service;
    const title = s ? `${s.title} — KMs Creative` : "Service — KMs Creative";
    const desc = s?.short ?? "KMs Creative services.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-light mb-6">Service not found</h1>
        <Link to="/" className="text-primary uppercase tracking-[0.3em] text-xs">Back home</Link>
      </section>
    </PageShell>
  ),
});

function ServicePage() {
  const { service } = Route.useLoaderData() as { service: import("@/lib/services").Service };
  const Icon = service.icon;
  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <PageShell>
      <article className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft className="h-3 w-3" />
          All services
        </Link>

        {/* HERO */}
        <header className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-24">
          <div className="md:col-span-8">
            <div
              className="w-14 h-14 rounded-2xl border border-primary/30 flex items-center justify-center text-primary-foreground mb-8"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Service</span>
            <h1 className="text-5xl md:text-7xl font-light mt-4 mb-8 tracking-[-0.02em] leading-[1.05]">
              {service.title}
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-[1.8] max-w-2xl">
              {service.long}
            </p>
          </div>
          <aside className="md:col-span-4 space-y-8 md:pt-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Tools</div>
              <ul className="space-y-1.5 text-sm">
                {service.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Deliverables</div>
              <ul className="space-y-1.5 text-sm">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-primary mt-1 shrink-0" />
                    <span className="text-muted-foreground">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </header>

        {/* GALLERY */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              Selected <span className="font-serif italic text-primary">work</span>
            </h2>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hidden md:block">
              Project showcase
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {service.gallery.map((g, i) => (
              <div
                key={g.title}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-card"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, oklch(0.5 0.25 ${g.hue} / 0.6), transparent 55%), radial-gradient(circle at 70% 70%, oklch(0.35 0.2 ${g.hue + 15} / 0.5), transparent 55%), linear-gradient(135deg, oklch(0.12 0.04 ${g.hue}), oklch(0.08 0.03 ${g.hue}))`,
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-background/80 via-transparent to-transparent">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-primary/90 mb-1">
                    0{i + 1} · {g.tag}
                  </span>
                  <h3 className="text-xl font-light tracking-tight">{g.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="relative rounded-3xl border border-primary/20 overflow-hidden p-12 md:p-16 text-center"
          style={{
            background:
              "radial-gradient(ellipse at top, oklch(0.3 0.18 295 / 0.4), transparent 60%), oklch(0.08 0.02 285)",
          }}
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-[-0.02em] leading-[1.1] mb-6 max-w-2xl mx-auto">
            Let's build your{" "}
            <span className="font-serif italic text-primary">{service.title.toLowerCase()}</span>{" "}
            project.
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto font-light">
            Message me directly on Telegram with your brief — I'll reply with next steps.
          </p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-primary-foreground rounded-full text-sm font-semibold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-transform"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Send className="h-4 w-4" />
            Get Started
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </section>

        {/* Other services */}
        <section className="mt-24">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
            Explore more
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex items-center justify-between p-6 rounded-xl border border-border bg-card/40 hover:bg-card hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <s.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-light">{s.title}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </PageShell>
  );
}
