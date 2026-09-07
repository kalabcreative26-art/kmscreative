import { useState, type FormEvent } from "react";
import { Phone, Mail, Send, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings, telHref } from "@/hooks/use-site-settings";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(5, "Tell me a bit more").max(2000, "Message is too long"),
});

export function ContactSection() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSending(true);
    const { error: dbError } = await supabase.from("contact_messages").insert(parsed.data);
    setSending(false);
    if (dbError) {
      setError("Something went wrong. Please try Telegram instead.");
      return;
    }
    setForm({ name: "", email: "", message: "" });
    setSent(true);
  };

  const field =
    "w-full rounded-2xl bg-background/40 border border-border/70 px-5 py-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background/70 focus:ring-4 focus:ring-primary/10";

  const directs = [
    { label: "Call", value: settings.phone, href: telHref(settings.phone), icon: Phone, external: false },
    { label: "Email", value: settings.email, href: `mailto:${settings.email}`, icon: Mail, external: false },
    {
      label: "Telegram",
      value: settings.telegram_url.replace(/^https?:\/\//, ""),
      href: settings.telegram_url,
      icon: Send,
      external: true,
    },
  ];

  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 py-28 md:py-36 scroll-mt-28">
      <div className="mb-16 md:mb-20">
        <span className="eyebrow">Contact</span>
        <h2 className="text-4xl md:text-6xl font-light mt-6 tracking-[-0.035em] leading-[1.05]">
          Let's build something{" "}
          <span className="font-serif italic text-primary">worth watching.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-7 card-premium p-8 md:p-10">
          {sent ? (
            <div className="flex flex-col items-center text-center py-14">
              <CheckCircle2 className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-2xl font-light tracking-tight mb-3">Message sent</h3>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                Thank you — your message reached {settings.brand_name}. I'll reply shortly, usually within a
                few hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-8 btn-ghost-glow rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className={field}
                  placeholder="Your name"
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className={field}
                  placeholder="Your email"
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <textarea
                className={`${field} min-h-[160px] resize-y`}
                placeholder="What would you like to create?"
                maxLength={2000}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              {error && <p className="text-destructive text-xs">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="btn-primary-glow inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] disabled:opacity-60"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? "Sending" : "Send message"}
              </button>
            </form>
          )}
        </div>

        {/* Direct contact */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {directs.map((d) => (
            <a
              key={d.label}
              href={d.href}
              {...(d.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="card-premium group flex items-center gap-5 p-6"
            >
              <span className="grid place-items-center h-12 w-12 shrink-0 rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110">
                <d.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.32em] text-muted-foreground/70 font-semibold">
                  {d.label}
                </span>
                <span className="block truncate text-sm mt-1">{d.value}</span>
              </span>
            </a>
          ))}
          <div className="card-premium p-6 text-xs leading-relaxed text-muted-foreground">
            Prefer instant replies? Telegram is the fastest way to reach {settings.brand_name}.
          </div>
        </div>
      </div>
    </section>
  );
}
