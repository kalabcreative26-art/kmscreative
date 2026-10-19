import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, Send, ShieldAlert, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/SiteShell";
import { useAuthState } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/inbox")({
  component: OwnerInbox,
  head: () => ({
    meta: [
      { title: "Studio Inbox — KMS Creative" },
      {
        name: "description",
        content: "Private KMS Creative studio inbox for reading and replying to client messages.",
      },
      { property: "og:title", content: "Studio Inbox — KMS Creative" },
      { property: "og:description", content: "Read and reply to client messages privately." },
    ],
  }),
});

type Conversation = {
  id: string;
  client_name: string;
  client_email: string;
  subject: string;
  service_slug: string | null;
  owner_unread_count: number;
  last_message_at: string;
};

type Msg = {
  id: string;
  body: string;
  is_from_owner: boolean;
  created_at: string;
  read_at: string | null;
};

function OwnerInbox() {
  const { loading: authLoading, userId, isOwner } = useAuthState();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    const { data } = await supabase
      .from("conversations")
      .select("id, client_name, client_email, subject, service_slug, owner_unread_count, last_message_at")
      .order("last_message_at", { ascending: false });
    setConversations((data ?? []) as Conversation[]);
    setLoading(false);
  }, []);

  const openConversation = useCallback(async (id: string) => {
    setActiveId(id);
    const { data } = await supabase
      .from("conversation_messages")
      .select("id, body, is_from_owner, created_at, read_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as Msg[]);

    const unread = (data ?? []).filter((m) => !m.is_from_owner && !m.read_at);
    if (unread.length) {
      await supabase
        .from("conversation_messages")
        .update({ read_at: new Date().toISOString() })
        .in("id", unread.map((m) => m.id));
      await supabase.from("conversations").update({ owner_unread_count: 0 }).eq("id", id);
      setConversations((cs) => cs.map((c) => (c.id === id ? { ...c, owner_unread_count: 0 } : c)));
    }
  }, []);

  useEffect(() => {
    if (isOwner) loadConversations();
    else if (!authLoading) setLoading(false);
  }, [isOwner, authLoading, loadConversations]);

  async function reply() {
    const body = draft.trim();
    if (!body || !activeId || !userId) return;
    setSending(true);
    setError(null);
    const { error: msgError } = await supabase
      .from("conversation_messages")
      .insert({ conversation_id: activeId, sender_id: userId, body, is_from_owner: true });
    setSending(false);
    if (msgError) {
      setError("Reply could not be sent. Please try again.");
      return;
    }
    setDraft("");
    await openConversation(activeId);
    await loadConversations();
  }

  if (authLoading || loading) {
    return (
      <PageShell>
        <section className="max-w-6xl mx-auto px-6 py-24 flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Opening your inbox…
        </section>
      </PageShell>
    );
  }

  if (!isOwner) {
    return (
      <PageShell>
        <section className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl border border-primary/20 bg-primary/10 grid place-items-center text-primary mb-6">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-light tracking-tight">Studio only</h1>
          <p className="text-muted-foreground font-light mt-3 text-sm">
            This inbox belongs to KMS Creative. Your own messages are on your dashboard.
          </p>
          <Link
            to="/dashboard"
            className="btn-primary-glow inline-flex items-center gap-2 rounded-full px-8 py-3.5 mt-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
          >
            Go to dashboard
          </Link>
        </section>
      </PageShell>
    );
  }

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const totalUnread = conversations.reduce((n, c) => n + c.owner_unread_count, 0);

  return (
    <PageShell>
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        <span className="eyebrow">Studio inbox</span>
        <h1 className="text-4xl md:text-6xl font-light mt-6 tracking-[-0.035em] leading-[1.05]">
          Client <span className="font-serif italic text-primary">messages.</span>
        </h1>
        <p className="text-muted-foreground font-light mt-4 text-sm">
          {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
          {totalUnread > 0 ? ` · ${totalUnread} unread` : ""} · replies appear only inside the client's dashboard.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
          <div className="lg:col-span-5 flex flex-col gap-3">
            {conversations.length === 0 ? (
              <div className="card-premium p-8 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl border border-primary/20 bg-primary/10 grid place-items-center text-primary mb-4">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-base font-light">No client messages yet</h3>
                <p className="text-sm text-muted-foreground font-light mt-2">
                  When a signed-in client writes from the website, they appear here.
                </p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => openConversation(c.id)}
                  className={`card-premium text-left p-5 transition-colors ${
                    c.id === activeId ? "border-primary/50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.client_name || "Client"}</p>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5 inline-flex items-center gap-1.5">
                        <Mail className="h-3 w-3" /> {c.client_email}
                      </p>
                    </div>
                    {c.owner_unread_count > 0 && (
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold text-primary-foreground"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        {c.owner_unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground/70 mt-3">
                    {c.subject} · {new Date(c.last_message_at).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="card-premium p-6 md:p-8">
              {!active ? (
                <p className="text-sm text-muted-foreground font-light py-10 text-center">
                  Select a conversation to read and reply.
                </p>
              ) : (
                <>
                  <div className="border-b border-border/60 pb-4 mb-5">
                    <h2 className="text-xl font-light tracking-tight">{active.client_name || "Client"}</h2>
                    <p className="text-[11px] text-muted-foreground mt-1">{active.client_email}</p>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto pr-1 space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.is_from_owner ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                            m.is_from_owner
                              ? "text-primary-foreground"
                              : "border border-border/70 bg-background/40"
                          }`}
                          style={
                            m.is_from_owner
                              ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }
                              : undefined
                          }
                        >
                          <span className="block text-[9px] uppercase tracking-[0.28em] opacity-70 mb-1.5">
                            {m.is_from_owner ? "You" : active.client_name || "Client"} ·{" "}
                            {new Date(m.created_at).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                          {m.body}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      maxLength={4000}
                      placeholder={`Reply to ${active.client_name || "this client"}…`}
                      className="w-full min-h-[110px] resize-y rounded-2xl bg-background/40 border border-border/70 px-5 py-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background/70 focus:ring-4 focus:ring-primary/10"
                    />
                    {error && <p className="text-destructive text-xs">{error}</p>}
                    <button
                      onClick={reply}
                      disabled={sending || !draft.trim()}
                      className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] disabled:opacity-50"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {sending ? "Sending" : "Send reply"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
