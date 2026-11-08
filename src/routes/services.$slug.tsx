import { Button } from "@/components/ui/button";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Send, Check } from "lucide-react";
import { PageShell, TELEGRAM_URL } from "@/components/SiteShell";
import { getService, services } from "@/lib/services";
import { telegramLink } from "@/lib/telegram";
import { useSiteSettings } from "@/hooks/use-site-settings";
import menuScreenshot from "@/assets/website-menu.jpg";
import estateScreenshot from "@/assets/website-estate.jpg";
import barberScreenshot from "@/assets/website-barber.jpg";
import portfolioScreenshot from "@/assets/website-portfolio.jpg";
import film from "@/assets/creative-film.mp4.asset.json";
import reel from "@/assets/creator-reel.mp4.asset.json";
import event from "@/assets/event-recap.mp4.asset.json";
import product from "@/assets/product-story.mp4.asset.json";
import filmPoster from "@/assets/creative-film-poster.jpg.asset.json";
import reelPoster from "@/assets/creator-reel-poster.jpg.asset.json";
import eventPoster from "@/assets/event-recap-poster.jpg.asset.json";
import productPoster from "@/assets/product-story-poster.jpg.asset.json";

const videoExamples = [
  { source: film.url, poster: filmPoster.url },
  { source: reel.url, poster: reelPoster.url },
  { source: event.url, poster: eventPoster.url },
  { source: product.url, poster: productPoster.url },
];

const websiteScreenshots = [
  { src: menuScreenshot, alt: "Custom restaurant menu website concept screenshot" },
  { src: estateScreenshot, alt: "Real estate website concept screenshot" },
  { src: barberScreenshot, alt: "Barbershop website concept screenshot" },
  { src: portfolioScreenshot, alt: "Creative portfolio website concept screenshot" },
];

export const Route = createFileRoute("/services/$slug")({
  component: ServicePage,
  loader: ({ params }) => {
    if (!getService(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const s = loaderData ? getService(loaderData.slug) : undefined;
    const title = s ? `${s.title} — KMS Creative` : "Service — KMS Creative";
    const desc = s?.short ?? "KMS Creative services.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-light mb-6">Service not found</h1>
        <Link to="/" className="text-primary uppercase tracking-normal text-xs">Back home</Link>
      </section>
    </PageShell>
  ),
});

function ServicePage() {
  const { slug } = Route.useLoaderData();
  const service = getService(slug);
  if (!service) throw notFound();
  const { settings } = useSiteSettings();
  const inquireLink = telegramLink(settings.telegram_url || TELEGRAM_URL, service.title);
  const Icon = service.icon;
  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <PageShell>
      <article className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-normal text-muted-foreground hover:text-primary transition-colors mb-12"
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
            <span className="text-[10px] uppercase tracking-normal font-bold text-primary">Service</span>
            <h1 className="text-5xl md:text-7xl font-light mt-4 mb-8 tracking-normal leading-[1.05]">
              {service.title}
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-[1.8] max-w-2xl">
              {service.long}
            </p>
            <div className="mt-10">
              <Button asChild variant="glass" className="h-auto"><a                 href={inquireLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-normal text-primary transition-all hover:bg-primary/20 hover:border-primary/60 hover:scale-[1.03] active:scale-95"
              >
                <Send className="h-3 w-3" />
                Inquire on Telegram
              </a></Button>
            </div>
          </div>
          <aside className="md:col-span-4 space-y-8 md:pt-10">
            <div>
              <div className="text-[10px] uppercase tracking-normal text-muted-foreground mb-3">Tools</div>
              <ul className="space-y-1.5 text-sm">
                {service.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-normal text-muted-foreground mb-3">Deliverables</div>
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
            <h2 className="text-3xl md:text-4xl font-light tracking-normal">
              Selected <span className="font-serif italic text-primary">work</span>
            </h2>
            <span className="text-[10px] uppercase tracking-normal text-muted-foreground hidden md:block">
              Project showcase
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {service.slug === "web-development" ? websiteScreenshots.map((image) => (
              <div key={image.src} className="expo-glass-effect group aspect-[30/19] overflow-hidden rounded-2xl border border-border bg-card">
                <img src={image.src} alt={image.alt} loading="lazy" width={1440} height={912} className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none" />
              </div>
            )) : service.slug === "video-production" ? videoExamples.map((video, index) => (
              <div key={video.source} className="expo-glass-effect aspect-[16/10] overflow-hidden rounded-2xl bg-card">
                <video controls playsInline preload="none" poster={video.poster} aria-label={`Video production example ${index + 1}`} className="h-full w-full object-contain">
                  <source src={video.source} type="video/mp4" />
                </video>
              </div>
            )) : service.gallery.map((g, i) => (
              <div
                key={g.title}
                className="expo-glass-effect group relative aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-card"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, oklch(0.5 0.25 ${g.hue} / 0.6), transparent 55%), radial-gradient(circle at 70% 70%, oklch(0.35 0.2 ${g.hue + 15} / 0.5), transparent 55%), linear-gradient(135deg, oklch(0.12 0.04 ${g.hue}), oklch(0.08 0.03 ${g.hue}))`,
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-background/80 via-transparent to-transparent">
                  <span className="text-[10px] uppercase tracking-normal text-primary/90 mb-1">
                    0{i + 1} · {g.tag}
                  </span>
                  <h3 className="text-xl font-light tracking-normal">{g.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative border-y border-border/50 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-light tracking-normal leading-[1.1] mb-6 max-w-2xl mx-auto">
            Let's build your{" "}
            <span className="font-serif italic text-primary">{service.title.toLowerCase()}</span>{" "}
            project.
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto font-light">
            Message me directly on Telegram with your brief — I'll reply with next steps.
          </p>
          <Button asChild variant="glass" className="h-auto"><a             href={inquireLink}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-primary-foreground rounded-full text-sm font-semibold uppercase tracking-normal hover:scale-[1.02] active:scale-95 transition-transform"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Send className="h-4 w-4" />
            Get Started
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a></Button>
        </section>

        {/* Other services */}
        <section className="mt-24">
          <div className="text-[10px] uppercase tracking-normal text-muted-foreground mb-8">
            Explore more
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="expo-glass-effect group flex items-center justify-between p-6 rounded-xl border border-border bg-card/40 hover:bg-card hover:border-primary/40 transition-all"
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
