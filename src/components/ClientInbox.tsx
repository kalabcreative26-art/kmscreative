import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Msg = {
  id: string;
  body: string;
  is_from_owner: boolean;
  created_at: string;
  read_at: string | null;
};

export function ClientInbox({
  userId,
  email,
  displayName,
}: {
  userId: string;
  email: string;
  displayName: string;
}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async (id: string) => {
    const { data } = await supabase
      .from("conversation_messages")
      .select("id, body, is_from_owner, created_at, read_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as Msg[]);

    // Mark the studio's replies as read for this client.
    const unread = (data ?? []).filter((m) => m.is_from_owner && !m.read_at);
    if (unread.length) {
      await supabase
        .from("conversation_messages")
        .update({ read_at: new Date().toISOString() })
        .in("id", unread.map((m) => m.id));
      await supabase.from("conversations").update({ client_unread_count: 0 }).eq("id", id);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("conversations")
        .select("id")
        .eq("client_id", userId)
        .order("last_message_at", { ascending: false })
        .limit(1);
      if (!active) return;
      const id = data?.[0]?.id ?? null;
      setConversationId(id);
      if (id) await loadMessages(id);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [userId, loadMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  async function send() {
    const body = draft.trim();
    if (!body) return;
    setSending(true);
    setError(null);

    let id = conversationId;
    if (!id) {
      const { data, error: convError } = await supabase
        .from("conversations")
        .insert({
          client_id: userId,
          client_email: email,
          client_name: displayName,
          subject: "Website message",
        })
        .select("id")
        .single();
      if (convError || !data) {
        setSending(false);
        setError("Could not start the conversation. Please try again.");
        return;
      }
      id = data.id;
      setConversationId(id);
    }

    const { error: msgError } = await supabase
      .from("conversation_messages")
      .insert({ conversation_id: id, sender_id: userId, body, is_from_owner: false });
    setSending(false);
    if (msgError) {
      setError("Message could not be sent. Please try again.");
      return;
    }
    setDraft("");
    await loadMessages(id);
  }

  return (
    <div className="card-premium p-6 md:p-8">
      {loading ? (
        <div className="flex items-center gap-3 text-sm text-muted-foreground py-8">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your conversation…
        </div>
      ) : (
        <>
          {messages.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 mx-auto rounded-xl border border-primary/20 bg-primary/10 grid place-items-center text-primary mb-4">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-base font-light">No messages yet</h3>
              <p className="text-sm text-muted-foreground font-light mt-2 max-w-sm mx-auto">
                Write below — your message goes straight to the studio, and replies appear right here.
              </p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.is_from_owner ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.is_from_owner
                        ? "border border-border/70 bg-background/40 text-foreground"
                        : "text-primary-foreground"
                    }`}
                    style={
                      m.is_from_owner
                        ? undefined
                        : { background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }
                    }
                  >
                    <span className="block text-[9px] uppercase tracking-[0.28em] opacity-70 mb-1.5">
                      {m.is_from_owner ? "KMS Creative" : "You"} · {shortTime(m.created_at)}
                    </span>
                    {m.body}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}

          <div className="mt-6 space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={4000}
              placeholder="Write a message to KMS Creative…"
              className="w-full min-h-[110px] resize-y rounded-2xl bg-background/40 border border-border/70 px-5 py-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background/70 focus:ring-4 focus:ring-primary/10"
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
            <button
              onClick={send}
              disabled={sending || !draft.trim()}
              className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending" : "Send message"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function shortTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
