-- Track admin email for routing notifications and add agent profile for the team page
CREATE TABLE IF NOT EXISTS public.agent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  bio TEXT,
  photo_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agent profiles are public" ON public.agent_profiles
  FOR SELECT USING (true);

CREATE POLICY "Admins manage agent profiles" ON public.agent_profiles
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Seed the team
INSERT INTO public.agent_profiles (full_name, role, email, phone, bio, display_order) VALUES
  ('Chris Nikolaenko', 'Founding Broker', 'Chris.nikolaenko@cbrealty.com', '650-640-9777',
   'Silicon Valley luxury specialist with deep relationships across Palo Alto, Atherton, and the Peninsula. Concierge-level service from first showing through close.', 1),
  ('Anna Park', 'Client Experience Director', NULL, NULL,
   'Ensures every buyer and seller journey is seamless — from off-market introductions to white-glove relocation support.', 2)
ON CONFLICT DO NOTHING;

-- Notification log so we can verify lead routing fired
CREATE TABLE IF NOT EXISTS public.lead_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view notifications" ON public.lead_notifications
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Service role inserts notifications" ON public.lead_notifications
  FOR INSERT WITH CHECK (true);
