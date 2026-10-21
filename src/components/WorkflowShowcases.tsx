import { useEffect, useRef, useState, type ReactNode } from "react";
import { Film, Palette, TrendingUp, Heart, MessageCircle, Bookmark, ArrowUpRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import motionDemo from "@/assets/kms-motion-demo.mp4.asset.json";
import motionWebm from "@/assets/kms-motion-demo.webm.asset.json";
import sneaker from "@/assets/social-sneaker.jpg";
import { telegramLink } from "@/lib/telegram";

const suppliedVideo = "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31910-large.mp4";

function Workflow({ number, category, title, description, tools, children, inquiry }: {
  number: string; category: string; title: string; description: string; tools: string[]; children: ReactNode; inquiry: string;
}) {
  return <article className="workflow-card flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
      <span className="text-xs font-medium text-foreground">{category}</span>
      <span className="font-mono text-xs text-workflow-cyan">/{number}</span>
    </div>
    {children}
    <div className="flex flex-1 flex-col p-5 md:p-7">
      <h3 className="text-xl font-medium leading-snug md:text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
        {tools.map(tool => <li key={tool} className="rounded border border-border bg-secondary/50 px-2 py-1 font-mono text-[10px] text-muted-foreground">{tool}</li>)}
      </ul>
      <Button asChild variant="link" className="mt-5 h-auto w-fit whitespace-normal p-0 text-left text-workflow-cyan">
        <a href={telegramLink("https://t.me/kalabms", inquiry)} target="_blank" rel="noreferrer"><Send />Inquire on Telegram<ArrowUpRight /></a>
      </Button>
    </div>
  </article>;
}

export function VideoWorkflow() {
  const [fallback, setFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if ((videoRef.current?.readyState ?? 0) < 2) setFallback(true);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, []);
  return <Workflow number="01" category="Video Editing & Motion Graphics" title="Cinematic Speed Ramps & Velocity Edits"
    description="High-octane commercial edits, smooth speed ramping, and precise beat-syncing."
    tools={["Adobe Premiere Pro", "After Effects", "CapCut", "Alight Motion"]} inquiry="Video Production">
    <div className="relative aspect-video overflow-hidden bg-background">
      <video ref={videoRef} key={fallback ? "fallback" : "supplied"} src={fallback ? undefined : suppliedVideo} onError={() => setFallback(true)}
        autoPlay muted loop playsInline controls preload="metadata" aria-label="Cinematic editing sample video"
        className="h-full w-full object-contain">
        {fallback && <><source src={motionWebm.url} type="video/webm" /><source src={motionDemo.url} type="video/mp4" /></>}
      </video>
      <span className="pointer-events-none absolute left-3 top-3 rounded border border-border bg-background/90 px-2 py-1 text-[9px] font-mono text-workflow-cyan">
        {fallback ? "KMS MOTION · SAMPLE ANIMATION" : "MIXKIT · SAMPLE FOOTAGE"}
      </span>
    </div>
  </Workflow>;
}

function IdentityArtwork({ final }: { final: boolean }) {
  return <div className={`identity-artwork ${final ? "identity-final" : "identity-draft"}`}>
    <span className="font-mono text-[9px] text-muted-foreground">{final ? "02 / IDENTITY SYSTEM" : "01 / INITIAL EXPLORATION"}</span>
    <div className="identity-wordmark" aria-hidden="true"><span>K</span><span className={final ? "text-primary" : ""}>M</span><span>S</span></div>
    <span className="text-xs font-medium text-foreground">{final ? "CREATIVE" : "creative?"}</span>
    <div className="identity-grid mt-5 border-t border-border pt-3">
      <div><span className="text-xl font-medium">Aa</span><p className="mt-1 text-[9px] text-muted-foreground">{final ? "Precision / Typography" : "Type exploration"}</p></div>
      <div className="flex items-center gap-1.5" aria-label={final ? "Purple, cyan and obsidian brand palette" : "Draft grayscale palette"}>
        <span className={`h-7 w-7 rounded ${final ? "bg-primary" : "bg-muted-foreground"}`} />
        <span className={`h-7 w-7 rounded ${final ? "bg-workflow-cyan" : "bg-border"}`} />
        <span className="h-7 w-7 rounded border border-border bg-background" />
      </div>
    </div>
  </div>;
}

export function BrandWorkflow() {
  const [reveal, setReveal] = useState(50);
  return <Workflow number="02" category="Graphic Design & Logo Identity" title="Brand Identity & Logo Redesign"
    description="Transforming basic concepts into high-end, unforgettable visual identities."
    tools={["Adobe Photoshop", "Illustrator", "Brand Kit Design"]} inquiry="Graphic & Logo Design">
    <div className="relative aspect-[4/3] overflow-hidden border-b border-border" aria-label="Brand identity before and after comparison">
      <IdentityArtwork final={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${reveal}%)` }}><IdentityArtwork final /></div>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-workflow-cyan" style={{ left: `${reveal}%` }}>
        <span className="absolute top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-workflow-cyan bg-background text-workflow-cyan">↔</span>
      </div>
    </div>
    <div className="px-5 pt-4">
      <div className="mb-3 flex justify-between gap-4 text-[10px] text-muted-foreground"><span>Raw Concept / Draft</span><span className="text-right text-workflow-cyan">Final KMS Creative Brand Package</span></div>
      <input type="range" min={0} max={100} value={reveal} onChange={e => setReveal(Number(e.target.value))} aria-label="Brand comparison position" className="w-full cursor-ew-resize accent-primary" />
    </div>
  </Workflow>;
}

const socialPlatforms = [
  { id: "tiktok", name: "TikTok", hook: "STOP.\nLOOK AGAIN.", label: "THE PRODUCT DROP", views: "128.4K", likes: "12.8K", saves: "2.1K" },
  { id: "instagram", name: "Instagram", hook: "BUILT TO\nSTAND OUT.", label: "THE BRAND STORY", views: "86.2K", likes: "8.6K", saves: "1.7K" },
  { id: "youtube", name: "YouTube", hook: "ONE EDIT.\nALL THE IMPACT.", label: "THE CREATIVE PROCESS", views: "215.7K", likes: "21.3K", saves: "3.4K" },
];

export function SocialWorkflow() {
  const [saved, setSaved] = useState(false);
  return <Workflow number="03" category="Social Media & Promotional Marketing" title="Viral Social Growth & Content Strategy"
    description="Scaling creator and business profiles across TikTok, Instagram, and YouTube with high-converting short-form content."
    tools={["Content Strategy", "Analytics", "Short-Form Editing"]} inquiry="Social Media Management">
    <Tabs defaultValue="tiktok" className="border-b border-border p-4">
      <TabsList className="grid h-auto w-full grid-cols-3 bg-secondary">
        {socialPlatforms.map(p => <TabsTrigger key={p.id} value={p.id} className="px-2 py-2 text-xs">{p.name}</TabsTrigger>)}
      </TabsList>
      {socialPlatforms.map(p => <TabsContent key={p.id} value={p.id}>
        <div className="social-phone relative mx-auto mt-4 aspect-[9/14] w-full max-w-[240px] overflow-hidden rounded-3xl border border-border bg-background">
          <img src={sneaker} width={768} height={1024} alt="Silver sneaker campaign concept with purple and cyan lighting" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="social-shade absolute inset-0" />
          <span className="absolute left-4 top-4 font-mono text-[9px] text-workflow-cyan">KMS / {p.label}</span>
          <div className="absolute inset-x-4 bottom-12">
            <p className="whitespace-pre-line font-display text-[26px] font-bold leading-tight text-foreground">{p.hook}</p>
            <span className="mt-3 inline-block border-l-2 border-workflow-cyan pl-2 text-[10px] text-foreground">Creative that moves people.</span>
          </div>
          <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-foreground">
            <span className="text-[10px]">@kms_creative16</span>
            <Button variant="ghost" size="icon" aria-label={saved ? "Unsave campaign concept" : "Save campaign concept"} aria-pressed={saved} onClick={() => setSaved(!saved)} className="h-7 w-7"><Bookmark className={saved ? "fill-workflow-cyan text-workflow-cyan" : ""} /></Button>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-workflow-cyan" />{p.views}</span>
          <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-primary" />{p.likes}</span>
          <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{p.saves}</span>
        </div>
        <p className="mt-2 text-center font-mono text-[9px] text-muted-foreground">CONCEPT CAMPAIGN · ILLUSTRATIVE METRICS</p>
      </TabsContent>)}
    </Tabs>
  </Workflow>;
}

export function WorkflowShowcases() {
  return <section className="mx-auto mb-24 max-w-6xl px-6" aria-labelledby="workflow-heading">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><span className="text-xs font-mono text-workflow-cyan">CRAFT / PROCESS / IMPACT</span><h2 id="workflow-heading" className="mt-3 text-3xl font-light md:text-4xl">Inside the <span className="font-serif italic text-primary">creative process.</span></h2></div>
      <div className="flex gap-3 text-primary" aria-hidden="true"><Film className="h-4 w-4" /><Palette className="h-4 w-4" /><TrendingUp className="h-4 w-4 text-workflow-cyan" /></div>
    </div>
    <div className="workflow-theme grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3"><VideoWorkflow /><BrandWorkflow /><SocialWorkflow /></div>
  </section>;
}