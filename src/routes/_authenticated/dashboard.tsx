import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Sparkles, Folder, Mail, MessageSquare, Send, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, TELEGRAM_URL } from "@/components/SiteShell";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Client Dashboard — KMs Creative" },
      { name: "description", content: "Your private KMs Creative client dashboard with active projects and messages." },
    ],
  }),
});

type Profile = { display_name: string | null; avatar_url: string | null };
type Project = { id: string; project_name: string; description: string | null; status: string; progress: number; due_date: string | null; client_email: string; updated_at: string };
type Message = { id: string; subject: string; body: string; read: boolean; created_at: string };

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const userEmail = user.email ?? "";
      setEmail(userEmail);

      const [{ data: p }, { data: pr }, { data: ms }] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url").eq("id", user.id).maybeSingle(),
        supabase.from("projects").select("*").ilike("client_email", userEmail).order("due_date", { ascending: true, nullsFirst: false }),
        supabase.from("messages").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(p as Profile | null);
      setProjects((pr ?? []) as Project[]);
      setMessages((ms ?? []) as Message[]);
      setLoading(false);
    })();
  }, []);

  async function markRead(id: string) {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, read: true } : x)));
    await supabase.from("messages").update({ read: true }).eq("id", id);
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  const name = profile?.display_name || email.split("@")[0] || "Client";
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();
  const activeCount = projects.filter((p) => p.status !== "Completed").length;
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Client area</span>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </div>

        {/* Greeting */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div
            className="w-24 h-24 rounded-full overflow-hidden border border-primary/30 bg-card flex items-center justify-center shrink-0"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Sparkles className="h-7 w-7 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">{greeting}</p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Welcome back, <span className="font-serif italic text-primary">{name}</span>.
            </h1>
            <p className="text-muted-foreground mt-3 text-sm font-light">
              Here's what's happening with your work at KMs Creative.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
          <StatCard icon={<Folder className="h-4 w-4" />} label="Active projects" value={activeCount} />
          <StatCard icon={<Mail className="h-4 w-4" />} label="Unread messages" value={unreadCount} />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Completed" value={projects.filter((p) => p.status === "Completed").length} />
        </div>

        {/* Active Projects */}
        <div className="mt-16">
          <SectionHeader
            eyebrow="01"
            title="My Active Projects"
            right={
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] uppercase tracking-[0.25em] text-primary hover:underline inline-flex items-center gap-2"
              >
                Request new <ArrowRight className="h-3 w-3" />
              </a>
            }
          />
          <div className="mt-6 space-y-3">
            {loading ? (
              <Skeleton />
            ) : projects.length === 0 ? (
              <EmptyState
                icon={<Folder className="h-5 w-5" />}
                title="No active projects yet"
                body="When we kick off your project, it will appear here with live progress and updates."
                cta={
                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-primary-foreground text-xs uppercase tracking-[0.2em] font-semibold"
                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                  >
                    <Send className="h-3 w-3" />
                    Start a project
                  </a>
                }
              />
            ) : (
              projects.map((p) => <ProjectRow key={p.id} project={p} />)
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="mt-16">
          <SectionHeader
            eyebrow="02"
            title="Messages from KMS Creative"
            right={
              unreadCount > 0 ? (
                <span className="text-[11px] uppercase tracking-[0.25em] text-primary">{unreadCount} new</span>
              ) : null
            }
          />
          <div className="mt-6 space-y-3">
            {loading ? (
              <Skeleton />
            ) : messages.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="h-5 w-5" />}
                title="No messages yet"
                body="Updates, deliverables, and notes from the studio will land here."
              />
            ) : (
              messages.map((m) => <MessageRow key={m.id} message={m} onOpen={() => markRead(m.id)} />)
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 rounded-2xl border border-border bg-card/40 p-8 text-center" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <h2 className="text-2xl font-light tracking-tight mb-2">
            Need something? <span className="font-serif italic text-primary">Just ask.</span>
          </h2>
          <p className="text-sm text-muted-foreground font-light mb-6 max-w-md mx-auto">
            The fastest way to reach the studio is on Telegram — usually a same-day reply.
          </p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-primary-foreground text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Send className="h-3 w-3" />
            Message KMS Creative
          </a>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
            ← Back to site
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="text-3xl font-light mt-3">{value}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, right }: { eyebrow: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-4">
      <div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 font-mono">{eyebrow}</span>
        <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-1">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <div className="group rounded-xl border border-border bg-card/40 p-5 hover:border-primary/40 transition-colors" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary">{project.status}</span>
          </div>
          <h3 className="text-lg font-medium truncate">{project.project_name}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground font-light mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground/70 inline-flex items-center gap-1 shrink-0">
          <Clock className="h-3 w-3" />
          {project.due_date ? `Due ${new Date(project.due_date).toLocaleDateString()}` : formatDate(project.updated_at)}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${project.progress}%`, background: "var(--gradient-primary)" }} />
        </div>
      </div>
    </div>
  );
}

function MessageRow({ message, onOpen }: { message: Message; onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  function toggle() {
    if (!open && !message.read) onOpen();
    setOpen((v) => !v);
  }
  return (
    <button
      type="button"
      onClick={toggle}
      className={`w-full text-left rounded-xl border bg-card/40 p-5 transition-colors hover:border-primary/40 ${message.read ? "border-border" : "border-primary/40"}`}
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {!message.read && <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />}
          <div className="min-w-0 flex-1">
            <h3 className={`text-base truncate ${message.read ? "font-light" : "font-medium"}`}>{message.subject}</h3>
            {!open && <p className="text-sm text-muted-foreground font-light mt-1 line-clamp-1">{message.body}</p>}
            {open && <p className="text-sm text-muted-foreground font-light mt-2 whitespace-pre-wrap leading-relaxed">{message.body}</p>}
          </div>
        </div>
        <span className="text-xs text-muted-foreground/70 shrink-0">{formatDate(message.created_at)}</span>
      </div>
    </button>
  );
}

function EmptyState({ icon, title, body, cta }: { icon: React.ReactNode; title: string; body: string; cta?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/20 p-10 text-center">
      <div className="w-12 h-12 mx-auto rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-base font-light">{title}</h3>
      <p className="text-sm text-muted-foreground font-light mt-2 max-w-sm mx-auto">{body}</p>
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1].map((i) => (
        <div key={i} className="h-24 rounded-xl border border-border bg-card/30 animate-pulse" />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}
