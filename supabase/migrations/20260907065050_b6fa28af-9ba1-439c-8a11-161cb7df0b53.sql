CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  brand_name TEXT NOT NULL DEFAULT 'KMS Creative',
  logo_url TEXT,
  phone TEXT NOT NULL DEFAULT '+251978792495',
  email TEXT NOT NULL DEFAULT 'kalabcreative26@gmail.com',
  telegram_url TEXT NOT NULL DEFAULT 'https://t.me/kalabms',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
INSERT INTO public.site_settings (id) VALUES ('default');

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read messages" ON public.contact_messages FOR SELECT TO authenticated USING (true);