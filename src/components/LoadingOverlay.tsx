import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import kmsLogo from "@/assets/kms-logo.jpg.asset.json";

/**
 * Logo motion loader. Only appears when a navigation is genuinely slow
 * (slower than DELAY_MS), so fast visits are never held back.
 */
const DELAY_MS = 450;

export function LoadingOverlay() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" || s.isLoading });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [isLoading]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-background/80 backdrop-blur-2xl">
      <div className="flex flex-col items-center gap-7">
        <div className="relative grid place-items-center h-28 w-28">
          <span
            className="absolute inset-0 rounded-full border border-primary/30"
            style={{ animation: "kms-pulse 1.8s ease-out infinite" }}
          />
          <span
            className="absolute inset-0 rounded-full border border-primary/20"
            style={{ animation: "kms-pulse 1.8s ease-out infinite", animationDelay: "0.6s" }}
          />
          <span
            className="grid place-items-center h-16 w-20 rounded-2xl bg-white"
            style={{
              boxShadow: "var(--shadow-glow)",
              animation: "kms-float 2.4s ease-in-out infinite",
            }}
          >
            <img src={kmsLogo.url} alt="KMS Creative" className="h-8 w-auto object-contain" />
          </span>
        </div>
        <div className="h-[2px] w-40 overflow-hidden rounded-full bg-border/60">
          <div
            className="h-full w-1/3 rounded-full"
            style={{ background: "var(--gradient-primary)", animation: "kms-sweep 1.3s ease-in-out infinite" }}
          />
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Loading</p>
      </div>
    </div>
  );
}
