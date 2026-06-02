import { Film, Sparkles, Palette, Code, QrCode, type LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  short: string;
  long: string;
  tools: string[];
  deliverables: string[];
  gallery: { title: string; tag: string; hue: number }[];
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    slug: "video-production",
    title: "Video Production",
    short: "Cinematic edits crafted in Premiere Pro & CapCut.",
    long: "From commercials to social-first stories, I cut footage with rhythm, pacing and intention. Premiere Pro for long-form polish, CapCut for fast-turn vertical content — every frame engineered for retention.",
    tools: ["Adobe Premiere Pro", "CapCut Pro", "DaVinci Resolve"],
    deliverables: ["Short-form reels", "Brand commercials", "YouTube long-form", "Event highlights"],
    gallery: [
      { title: "Brand Commercial", tag: "16:9 · 4K", hue: 295 },
      { title: "Reel Series", tag: "9:16", hue: 280 },
      { title: "Event Recap", tag: "Doc style", hue: 310 },
      { title: "Product Story", tag: "Cinematic", hue: 290 },
    ],
    icon: Film,
  },
  {
    slug: "motion-graphics",
    title: "Motion Graphics",
    short: "Custom animation in After Effects & Alight Motion.",
    long: "Logo stings, kinetic typography, animated explainers and overlays that elevate any edit. I build flexible templates and one-off bespoke animations engineered for premium brand polish.",
    tools: ["Adobe After Effects", "Alight Motion", "Illustrator"],
    deliverables: ["Logo animations", "Kinetic typography", "Explainer videos", "Lower thirds & overlays"],
    gallery: [
      { title: "Logo Sting", tag: "Brand reveal", hue: 295 },
      { title: "Kinetic Type", tag: "Promo", hue: 285 },
      { title: "Explainer", tag: "2D motion", hue: 305 },
      { title: "UI Animation", tag: "App promo", hue: 290 },
    ],
    icon: Sparkles,
  },
  {
    slug: "graphic-design",
    title: "Graphic & Logo Design",
    short: "Brand identity with clean, modern aesthetics.",
    long: "Distinctive logos, full identity systems, social templates and print collateral. Type, color and grid systems built so your brand looks intentional everywhere it appears.",
    tools: ["Illustrator", "Photoshop", "Figma"],
    deliverables: ["Logos & marks", "Brand guidelines", "Social templates", "Posters & flyers"],
    gallery: [
      { title: "Wordmark", tag: "Identity", hue: 295 },
      { title: "Brand System", tag: "Guidelines", hue: 280 },
      { title: "Poster Series", tag: "Print", hue: 305 },
      { title: "Social Kit", tag: "Templates", hue: 290 },
    ],
    icon: Palette,
  },
  {
    slug: "web-development",
    title: "Website Development & Publishing",
    short: "Full-stack sites built and shipped end-to-end.",
    long: "Modern, responsive websites that load fast and convert. From landing pages to multi-page experiences, I handle design, build, deployment and the publishing pipeline so you go live worry-free.",
    tools: ["React", "TypeScript", "Tailwind CSS", "TanStack"],
    deliverables: ["Landing pages", "Portfolio sites", "Business websites", "Custom web apps"],
    gallery: [
      { title: "Agency Site", tag: "Multi-page", hue: 295 },
      { title: "Landing Page", tag: "Conversion", hue: 285 },
      { title: "Portfolio", tag: "Creator", hue: 305 },
      { title: "Web App", tag: "Custom", hue: 290 },
    ],
    icon: Code,
  },
  {
    slug: "business-essentials",
    title: "Business Essentials",
    short: "QR menus, business cards and brand collateral.",
    long: "The everyday assets that make your business feel professional — digital QR menus, polished business cards, branded stationery and the small details clients notice.",
    tools: ["Illustrator", "QR systems", "Print-ready PDF"],
    deliverables: ["QR menu systems", "Business cards", "Letterheads", "Brand collateral"],
    gallery: [
      { title: "QR Menu", tag: "Restaurant", hue: 295 },
      { title: "Business Card", tag: "Print", hue: 285 },
      { title: "Letterhead", tag: "Stationery", hue: 305 },
      { title: "Loyalty Card", tag: "Print", hue: 290 },
    ],
    icon: QrCode,
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
