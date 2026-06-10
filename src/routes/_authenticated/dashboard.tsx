import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/SiteShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — KMs Creative" },
      { name: "description", content: "Your KMs Creative client dashboard." },
    ],
  }),
});

type Profile = { display_name: string | null; avatar_url: string | null };

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data as Profile | null);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  const name = profile?.display_name || email.split("@")[0] || "Client";

  return (
    <PageShell>
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Client area</span>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-28 h-28 rounded-full overflow-hidden border border-primary/30 bg-card flex items-center justify-center shrink-0" style={{ boxShadow: "var(--shadow-glow)" }}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Sparkles className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Welcome, <span className="font-serif italic text-primary">{name}</span>.
            </h1>
            <p className="text-muted-foreground mt-3 text-sm">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
          {[
            { t: "Active projects", v: "0" },
            { t: "Pending reviews", v: "0" },
            { t: "Files delivered", v: "0" },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-border bg-card/40 p-6" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{c.t}</div>
              <div className="text-4xl font-light mt-4">{c.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card/40 p-8" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <h2 className="text-xl font-light mb-3">Your workspace is ready.</h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            This is your private client area. Project updates, deliverables, and invoices will appear here as we kick off your work together.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
