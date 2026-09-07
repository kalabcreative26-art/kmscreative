import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Film, Palette, QrCode, Sparkles, Code, type LucideIcon } from "lucide-react";

type Work = {
  title: string;
  category: string;
  blurb: string;
  tags: string[];
  icon: LucideIcon;
  hue: number;
  slug: string;
};

const works: Work[] = [
  {
    title: "Monogram Identity",
    category: "Logo Design",
    blurb: "A serif monogram system with a purple accent mark, built for print, screen and social.",
    tags: ["Wordmark", "Guidelines", "Vector kit"],
    icon: Palette,
    hue: 295,
    slug: "graphic-design",
  },
  {
    title: "Campaign Graphics Kit",
    category: "Graphic Design",
    blurb: "Posters, story frames and feed templates on one grid so every post feels intentional.",
    tags: ["Posters", "Social kit", "Print"],
    icon: Sparkles,
    hue: 282,
    slug: "graphic-design",
  },
  {
    title: "Cinematic Brand Film",
    category: "Video Editing",
    blurb: "Colour-graded brand story cut in Premiere Pro, paced for retention from frame one.",
    tags: ["4K", "Colour grade", "Sound design"],
    icon: Film,
    hue: 308,
    slug: "video-production",
  },
  {
    title: "Vertical Reel Series",
    category: "Video Editing",
    blurb: "Six short-form edits with kinetic captions and motion overlays for daily posting.",
    tags: ["9:16", "Captions", "Motion"],
    icon: Film,
    hue: 270,
    slug: "motion-graphics",
  },
  {
    title: "Restaurant QR Menu",
    category: "QR Menu Creation",
    blurb: "A scannable digital menu with branded table cards — update prices without reprinting.",
    tags: ["QR system", "Table cards", "Mobile-first"],
    icon: QrCode,
    hue: 300,
    slug: "business-essentials",
  },
  {
    title: "Studio Website Build",
    category: "Web Development",
    blurb: "A fast, responsive site designed, built and published end to end with hosting handled.",
    tags: ["React", "Responsive", "Published"],
    icon: Code,
    hue: 288,
    slug: "web-development",
  },
];

export function PortfolioSection() {
  return (
    <section id="work" className="max-w-6xl mx-auto px-6 py-28 md:py-36 scroll-mt-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
        <div>
          <span className="eyebrow">Selected Work</span>
          <h2 className="text-4xl md:text-6xl font-light mt-6 tracking-[-0.035em] leading-[1.05] max-w-2xl">
            Logos, graphics, film and{" "}
            <span className="font-serif italic text-primary">QR menus.</span>
          </h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          A snapshot of the work I deliver. Every piece is built to the same standard, whatever the format.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((w) => (
          <Link
            key={w.title}
            to="/services/$slug"
            params={{ slug: w.slug }}
            className="card-premium group flex flex-col overflow-hidden"
          >
            <div
              className="relative h-44 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, oklch(0.42 0.22 ${w.hue} / 0.75), oklch(0.16 0.06 ${w.hue} / 0.9))`,
              }}
            >
              <div
                className="absolute inset-0 opacity-60 transition-transform duration-[900ms] ease-out group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 30% 20%, oklch(0.75 0.22 ${w.hue} / 0.45), transparent 60%)`,
                }}
              />
              <w.icon className="absolute bottom-5 left-6 h-8 w-8 text-white/85 transition-transform duration-500 group-hover:-translate-y-1" />
              <ArrowUpRight className="absolute top-5 right-5 h-5 w-5 text-white/70 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
            </div>

            <div className="flex flex-1 flex-col p-7">
              <span className="text-[10px] uppercase tracking-[0.32em] font-semibold text-primary">
                {w.category}
              </span>
              <h3 className="text-xl font-light tracking-tight mt-4">{w.title}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mt-3 flex-1">{w.blurb}</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {w.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
