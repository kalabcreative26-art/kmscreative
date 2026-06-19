
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_name text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS due_date date;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_email text;

UPDATE public.projects SET project_name = COALESCE(project_name, title, 'Untitled');
ALTER TABLE public.projects ALTER COLUMN project_name SET NOT NULL;

UPDATE public.projects p
SET client_email = u.email
FROM auth.users u
WHERE p.user_id = u.id AND p.client_email IS NULL;

ALTER TABLE public.projects ALTER COLUMN client_email SET NOT NULL;

ALTER TABLE public.projects ALTER COLUMN status DROP DEFAULT;
UPDATE public.projects SET status = CASE
  WHEN status IN ('To Do','In Progress','Completed') THEN status
  WHEN status = 'completed' THEN 'Completed'
  WHEN status = 'in_progress' THEN 'In Progress'
  ELSE 'To Do'
END;
ALTER TABLE public.projects ALTER COLUMN status SET DEFAULT 'To Do';

ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_status_check
  CHECK (status IN ('To Do','In Progress','Completed'));

CREATE INDEX IF NOT EXISTS projects_client_email_idx ON public.projects (client_email);

DROP POLICY IF EXISTS "Clients read own projects" ON public.projects;
CREATE POLICY "Clients read own projects by email" ON public.projects
  FOR SELECT TO authenticated
  USING (lower(client_email) = lower((auth.jwt() ->> 'email')));

CREATE POLICY "Clients insert own projects by email" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (lower(client_email) = lower((auth.jwt() ->> 'email')));

CREATE POLICY "Clients update own projects by email" ON public.projects
  FOR UPDATE TO authenticated
  USING (lower(client_email) = lower((auth.jwt() ->> 'email')))
  WITH CHECK (lower(client_email) = lower((auth.jwt() ->> 'email')));

CREATE POLICY "Clients delete own projects by email" ON public.projects
  FOR DELETE TO authenticated
  USING (lower(client_email) = lower((auth.jwt() ->> 'email')));
