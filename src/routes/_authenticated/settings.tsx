import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { z } from "zod";
import { PageShell } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/hooks/use-site-settings";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Studio Settings — KMS Creative" },
      { name: "description", content: "Update the KMS Creative studio name, logo, phone number, email and Telegram link." },
      { property: "og:title", content: "Studio Settings — KMS Creative" },
      { property: "og:description", content: "Manage your studio brand details." },
    ],
  }),
});

const schema = z.object({
  brand_name: z.string().trim().min(1, "Name is required").max(60),
  logo_url: z.string().trim().max(500).optional().or(z.literal("")),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  email: z.string().trim().email("Enter a valid email").max(255),
  telegram_url: z.string().trim().url("Enter a valid link").max(255),
});

function SettingsPage() {
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("brand_name, logo_url, phone, email, telegram_url")
      .eq("id", "default")
      .maybeSingle()
      .then(({ data }) => {
        if (data) setForm({ ...DEFAULT_SETTINGS, ...data });
        setLoading(false);
      });
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSaving(true);
    const { error: dbError } = await supabase
      .from("site_settings")
      .upsert({ id: "default", ...parsed.data, logo_url: parsed.data.logo_url || null, updated_at: new Date().toISOString() });
    setSaving(false);
    if (dbError) {
      setError("Could not save. Please try again.");
      return;
    }
    setSaved(true);
  };

  const field =
    "w-full rounded-2xl bg-background/40 border border-border/70 px-5 py-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background/70 focus:ring-4 focus:ring-primary/10";

  const fields: { key: keyof SiteSettings; label: string; placeholder: string; hint?: string }[] = [
    { key: "brand_name", label: "Studio name", placeholder: "KMS Creative" },
    { key: "logo_url", label: "Logo image link", placeholder: "https://…", hint: "Paste a link to your logo image. Leave empty to keep the built-in logo." },
    { key: "phone", label: "Phone number", placeholder: "+251978792495" },
    { key: "email", label: "Email address", placeholder: "you@example.com" },
    { key: "telegram_url", label: "Telegram link", placeholder: "https://t.me/username" },
  ];

  return (
    <PageShell>
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <span className="eyebrow">Settings</span>
        <h1 className="text-4xl md:text-6xl font-light mt-6 mb-4 tracking-[-0.035em] leading-[1.05]">
          Your studio <span className="font-serif italic text-primary">details.</span>
        </h1>
        <p className="text-muted-foreground font-light mb-12 max-w-xl">
          Change these anytime — the website updates everywhere instantly.
        </p>

        {loading ? (
          <div className="card-premium p-10 flex items-center gap-3 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your details…
          </div>
        ) : (
          <form onSubmit={onSubmit} className="card-premium p-8 md:p-10 space-y-6">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-[10px] uppercase tracking-[0.28em] font-semibold text-muted-foreground/80 mb-3">
                  {f.label}
                </label>
                <input
                  className={field}
                  placeholder={f.placeholder}
                  value={(form[f.key] as string) ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
                {f.hint && <p className="text-[11px] text-muted-foreground/70 mt-2">{f.hint}</p>}
              </div>
            ))}

            {form.logo_url ? (
              <div className="flex items-center gap-4 rounded-2xl border border-border/60 p-4">
                <span className="grid place-items-center h-12 w-16 rounded-xl bg-white">
                  <img src={form.logo_url} alt="Logo preview" className="h-8 w-auto object-contain" />
                </span>
                <span className="text-xs text-muted-foreground">Logo preview</span>
              </div>
            ) : null}

            {error && <p className="text-destructive text-xs">{error}</p>}
            {saved && (
              <p className="flex items-center gap-2 text-primary text-xs">
                <CheckCircle2 className="h-4 w-4" /> Saved — your website is updated.
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-full px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving" : "Save changes"}
            </button>
          </form>
        )}
      </section>
    </PageShell>
  );
}
