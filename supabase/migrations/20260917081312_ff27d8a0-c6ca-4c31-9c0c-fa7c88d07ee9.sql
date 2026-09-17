CREATE TYPE public.app_role AS ENUM ('owner', 'client');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;

INSERT INTO public.user_roles (user_id, role)
VALUES ('ac4d055c-7a0a-4755-8337-06333b85eb55', 'owner')
ON CONFLICT (user_id, role) DO NOTHING;

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  service_slug TEXT,
  subject TEXT NOT NULL DEFAULT 'Website enquiry',
  client_unread_count INTEGER NOT NULL DEFAULT 0 CHECK (client_unread_count >= 0),
  owner_unread_count INTEGER NOT NULL DEFAULT 0 CHECK (owner_unread_count >= 0),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients and owner can view conversations" ON public.conversations FOR SELECT TO authenticated
USING (auth.uid() = client_id OR public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Clients can start own conversations" ON public.conversations FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = client_id
  AND lower(client_email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  AND NOT public.has_role(auth.uid(), 'owner')
);
CREATE POLICY "Participants can update conversation read state" ON public.conversations FOR UPDATE TO authenticated
USING (auth.uid() = client_id OR public.has_role(auth.uid(), 'owner'))
WITH CHECK (auth.uid() = client_id OR public.has_role(auth.uid(), 'owner'));
CREATE INDEX conversations_client_idx ON public.conversations (client_id, last_message_at DESC);
CREATE INDEX conversations_owner_activity_idx ON public.conversations (last_message_at DESC);

CREATE TABLE public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  is_from_owner BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.conversation_messages TO authenticated;
GRANT ALL ON public.conversation_messages TO service_role;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view conversation messages" ON public.conversation_messages FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.conversations c
  WHERE c.id = conversation_id
    AND (c.client_id = auth.uid() OR public.has_role(auth.uid(), 'owner'))
));
CREATE POLICY "Participants can send correctly attributed messages" ON public.conversation_messages FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND (
    (public.has_role(auth.uid(), 'owner') AND is_from_owner = true AND EXISTS (
      SELECT 1 FROM public.conversations c WHERE c.id = conversation_id
    ))
    OR
    (NOT public.has_role(auth.uid(), 'owner') AND is_from_owner = false AND EXISTS (
      SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.client_id = auth.uid()
    ))
  )
);
CREATE POLICY "Recipients can mark messages read" ON public.conversation_messages FOR UPDATE TO authenticated
USING (
  (is_from_owner = true AND EXISTS (
    SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.client_id = auth.uid()
  ))
  OR
  (is_from_owner = false AND public.has_role(auth.uid(), 'owner'))
)
WITH CHECK (
  (is_from_owner = true AND EXISTS (
    SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.client_id = auth.uid()
  ))
  OR
  (is_from_owner = false AND public.has_role(auth.uid(), 'owner'))
);
CREATE INDEX conversation_messages_thread_idx ON public.conversation_messages (conversation_id, created_at);

CREATE OR REPLACE FUNCTION public.touch_conversation_from_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      updated_at = NEW.created_at,
      client_unread_count = CASE WHEN NEW.is_from_owner THEN client_unread_count + 1 ELSE client_unread_count END,
      owner_unread_count = CASE WHEN NEW.is_from_owner THEN owner_unread_count ELSE owner_unread_count + 1 END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER touch_conversation_after_message
AFTER INSERT ON public.conversation_messages
FOR EACH ROW EXECUTE FUNCTION public.touch_conversation_from_message();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER set_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

REVOKE INSERT ON public.contact_messages FROM anon;
DROP POLICY IF EXISTS "Anyone can send a message" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated can read messages" ON public.contact_messages;
CREATE POLICY "Owner can read saved enquiries" ON public.contact_messages FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Signed in clients can send enquiries" ON public.contact_messages FOR INSERT TO authenticated
WITH CHECK (NOT public.has_role(auth.uid(), 'owner'));

DROP POLICY IF EXISTS "Authenticated can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated can update site settings" ON public.site_settings;
CREATE POLICY "Owner can insert site settings" ON public.site_settings FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owner can update site settings" ON public.site_settings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));

UPDATE public.site_settings
SET phone = '0978792495', telegram_url = 'https://t.me/kalabms', updated_at = now()
WHERE id = 'default';