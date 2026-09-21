import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Send, X } from "lucide-react";
import { telegramChoices, telegramLink } from "@/lib/telegram";
import { useSiteSettings } from "@/hooks/use-site-settings";

/**
 * Telegram action that first asks what the visitor wants, then opens Telegram
 * with a ready-to-send message naming that exact service.
 */
export function TelegramInquiry({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}) {
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} style={style}>
        {children ?? (
          <>
            <Send className="h-4 w-4" />
            Message on Telegram
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-background/70 backdrop-blur-xl p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass glass-specular w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 md:p-8"
            style={{ borderRadius: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="eyebrow">Telegram</span>
                <h3 className="text-2xl font-light tracking-tight mt-3">
                  What can I <span className="font-serif italic text-primary">create for you?</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Pick one — Telegram opens with your message already written. All you do is press send.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid place-items-center h-9 w-9 rounded-full text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {telegramChoices.map((c) => (
                <a
                  key={c.slug}
                  href={telegramLink(
                    settings.telegram_url,
                    c.slug === "general" ? undefined : c.title,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-background/30 px-5 py-4 transition-all hover:border-primary/40 hover:bg-background/60"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium truncate">{c.title}</span>
                    <span className="block text-[11px] text-muted-foreground mt-0.5 truncate">
                      {c.short}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
