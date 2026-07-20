import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { PageShell } from "@/components/SiteShell";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Client Login — KMs Creative" },
      { name: "description", content: "Sign in or create an account to access your KMs Creative dashboard." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

  // Detect an image type from magic bytes. Returns null for anything that
  // isn't a plain raster image (blocks HTML, SVG, scripts, etc).
  async function detectImageType(
    file: File,
  ): Promise<{ mime: "image/jpeg" | "image/png" | "image/webp" | "image/gif"; ext: "jpg" | "png" | "webp" | "gif" } | null> {
    const buf = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    if (buf.length < 4) return null;
    // JPEG: FF D8 FF
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return { mime: "image/png", ext: "png" };
    // GIF: "GIF87a" / "GIF89a"
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return { mime: "image/gif", ext: "gif" };
    // WEBP: "RIFF"...."WEBP"
    if (
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
    ) return { mime: "image/webp", ext: "webp" };
    return null;
  }

  async function onPick(f: File | null) {
    if (!f) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    if (f.size > MAX_AVATAR_BYTES) {
      toast.error("Image is too large. Maximum size is 5 MB.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    const detected = await detectImageType(f);
    if (!detected) {
      toast.error("Unsupported file. Please upload a JPG, PNG, WEBP, or GIF image.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  }

  async function uploadAvatar(userId: string) {
    if (!avatarFile) return null;
    // Re-validate at upload time — never trust the client-supplied file.type.
    const detected = await detectImageType(avatarFile);
    if (!detected) {
      throw new Error("Invalid image file.");
    }
    if (avatarFile.size > MAX_AVATAR_BYTES) {
      throw new Error("Image is too large.");
    }
    const path = `${userId}/avatar.${detected.ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, {
      upsert: true,
      // Force a safe, validated image content-type so a mislabeled file can
      // never be served as text/html or image/svg+xml.
      contentType: detected.mime,
    });
    if (error) throw error;
    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    return signed?.signedUrl ?? null;
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!avatarFile) {
          toast.error("Please upload a profile picture.");
          setLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        const user = data.user;
        if (user) {
          try {
            const avatarUrl = await uploadAvatar(user.id);
            if (avatarUrl) {
              await supabase
                .from("profiles")
                .update({ avatar_url: avatarUrl, display_name: displayName })
                .eq("id", user.id);
            }
          } catch (err) {
            console.error("avatar upload failed", err);
          }
        }
        toast.success("Account created!");
        if (data.session) navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/dashboard`,
      });
      if (result.error) {
        toast.error(result.error.message || "Google sign-in failed");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="max-w-md mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>

        <div className="rounded-2xl border border-border bg-card/40 p-8 backdrop-blur-xl" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <h1 className="text-3xl font-light tracking-tight mb-2">
            {mode === "signin" ? "Client Login" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {mode === "signin" ? "Welcome back to KMs Creative." : "Join KMs Creative to manage your projects."}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-full border border-border bg-background/60 hover:bg-card py-3 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.62 0 3.07.56 4.22 1.65l3.15-3.15C17.45 1.78 14.97.8 12 .8 7.33.8 3.32 3.47 1.39 7.36l3.67 2.85C5.95 7.32 8.74 5.04 12 5.04z"/><path fill="#34A853" d="M23.2 12.27c0-.85-.08-1.66-.22-2.43H12v4.6h6.28c-.27 1.42-1.07 2.62-2.27 3.43l3.51 2.72c2.05-1.89 3.68-4.67 3.68-8.32z"/><path fill="#FBBC05" d="M5.06 14.3a7.2 7.2 0 0 1 0-4.6L1.39 6.85a12.04 12.04 0 0 0 0 10.3l3.67-2.85z"/><path fill="#4285F4" d="M12 23.2c3.24 0 5.96-1.07 7.94-2.91l-3.51-2.72c-.97.66-2.23 1.05-4.43 1.05-3.26 0-6.05-2.28-7.04-5.32L1.39 16.15C3.32 20.04 7.33 23.2 12 23.2z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Display name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-lg bg-background/60 border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Profile picture</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-20 h-20 rounded-full border border-dashed border-border bg-background/40 flex items-center justify-center overflow-hidden hover:border-primary/60 transition-colors"
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="text-xs text-muted-foreground">
                      {avatarFile ? avatarFile.name : "Required. JPG or PNG."}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => onPick(e.target.files?.[0] ?? null)}
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-background/60 border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-background/60 border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-primary-foreground text-sm font-semibold uppercase tracking-[0.15em] disabled:opacity-60"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
