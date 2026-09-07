import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  brand_name: string;
  logo_url: string | null;
  phone: string;
  email: string;
  telegram_url: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  brand_name: "KMS Creative",
  logo_url: null,
  phone: "+251978792495",
  email: "kalabcreative26@gmail.com",
  telegram_url: "https://t.me/kalabms",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_settings")
      .select("brand_name, logo_url, phone, email, telegram_url")
      .eq("id", "default")
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { settings, loading };
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
