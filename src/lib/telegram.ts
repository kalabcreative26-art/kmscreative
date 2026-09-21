import { services } from "@/lib/services";

export const TELEGRAM_FALLBACK = "https://t.me/kalabms";

/** Ready-to-send message text for a given service (or a general enquiry). */
export function telegramMessageFor(serviceTitle?: string) {
  if (!serviceTitle) {
    return "Hello KMS Creative! I found you through your website and I'd like to discuss a project.";
  }
  return `Hello KMS Creative! I'd like to order ${serviceTitle}. Please tell me about pricing and the next steps.`;
}

/** Telegram deep link with the message already typed in. */
export function telegramLink(baseUrl: string, serviceTitle?: string) {
  const base = (baseUrl || TELEGRAM_FALLBACK).replace(/\/+$/, "");
  return `${base}?text=${encodeURIComponent(telegramMessageFor(serviceTitle))}`;
}

export const telegramChoices = [
  ...services.map((s) => ({ slug: s.slug, title: s.title, short: s.short })),
  {
    slug: "general",
    title: "Something else",
    short: "Not sure yet — let's talk it through.",
  },
];
