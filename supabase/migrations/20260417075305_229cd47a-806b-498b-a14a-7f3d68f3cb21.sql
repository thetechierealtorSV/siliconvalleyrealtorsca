-- Lead type enum
CREATE TYPE public.lead_type AS ENUM (
  'buyer_agreement','pre_approval','seller_listing','valuation',
  'contact','chatbot','loan_referral','concierge','specialized_service'
);

CREATE TYPE public.lead_status AS ENUM ('new','contacted','qualified','closed');
CREATE TYPE public.lead_priority AS ENUM ('hot','warm','cold');

-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type public.lead_type NOT NULL,
  specialty TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  source_page TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status public.lead_status NOT NULL DEFAULT 'new',
  priority public.lead_priority NOT NULL DEFAULT 'warm',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_type ON public.leads(lead_type);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created ON public.leads(created_at DESC);

-- Admins table for role-based access (no roles on profile)
CREATE TABLE public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = _user_id)
$$;

CREATE POLICY "Admins can view admins" ON public.admins FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Auto-priority trigger
CREATE OR REPLACE FUNCTION public.set_lead_priority()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.priority = 'warm' THEN
    IF NEW.lead_type IN ('pre_approval','seller_listing','buyer_agreement') THEN
      NEW.priority := 'hot';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_lead_priority
BEFORE INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.set_lead_priority();

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + auth) can submit a lead
CREATE POLICY "Anyone can submit leads" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- Only admins can update
CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

-- Only admins can delete
CREATE POLICY "Admins can delete leads" ON public.leads
  FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));