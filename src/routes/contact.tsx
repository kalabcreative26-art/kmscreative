import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Phone, Send } from "lucide-react";
import { PageShell, TELEGRAM_URL, TIKTOK_URL, TikTokIcon } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { PUBLIC_PHONE, PUBLIC_PHONE_HREF } from "@/lib/public-contact";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact KMS Creative — Telegram, TikTok & Phone" },
      { name: "description", content: "Contact KMS Creative on Telegram, explore our TikTok, or call 0978792495." },
      { property: "og:title", content: "Contact KMS Creative" },
      { property: "og:description", content: "Connect with KMS Creative on Telegram, TikTok or by phone at 0978792495." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const contacts = [
  { name: "Telegram", detail: "@kalabms", href: TELEGRAM_URL, icon: Send, external: true },
  { name: "TikTok", detail: "@kms_creative16", href: TIKTOK_URL, icon: TikTokIcon, external: true },
  { name: "Phone", detail: PUBLIC_PHONE, href: PUBLIC_PHONE_HREF, icon: Phone, external: false },
];

function ContactPage() {
  return (
    <PageShell>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <span className="eyebrow">KMS Creative</span>
        <h1 className="text-5xl md:text-7xl font-normal mt-6 mb-14 leading-[1.1]">
          Contact <span className="font-serif italic text-primary">us.</span>
        </h1>
        <div className="border-t border-border">
          {contacts.map((contact) => (
            <Button key={contact.name} asChild variant="ghost" className="group h-auto w-full justify-start gap-5 rounded-none border-b border-border px-1 py-7 md:py-9 whitespace-normal hover:bg-primary/5">
              <a href={contact.href} {...(contact.external ? { target: "_blank", rel: "noreferrer" } : {})} aria-label={`${contact.name} ${contact.detail}`}>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <contact.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xl md:text-2xl font-display">{contact.name}</span>
                  <span className="block mt-1 text-sm text-muted-foreground break-words">{contact.detail}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none" />
              </a>
            </Button>
          ))}
        </div>
      </section>
    </PageShell>
  );
}