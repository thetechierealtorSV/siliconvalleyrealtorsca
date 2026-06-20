-- Off-market listings (admin-managed, public teaser, gated full details)
CREATE TABLE public.offmarket_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood TEXT NOT NULL,
  price_band TEXT NOT NULL,
  beds INTEGER,
  baths NUMERIC(3,1),
  sqft INTEGER,
  teaser_summary TEXT NOT NULL,
  hidden_details TEXT,
  hero_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.offmarket_listings TO anon;
GRANT SELECT ON public.offmarket_listings TO authenticated;
GRANT ALL ON public.offmarket_listings TO service_role;

ALTER TABLE public.offmarket_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active off-market teasers"
  ON public.offmarket_listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins manage off-market listings"
  ON public.offmarket_listings FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER update_offmarket_listings_updated_at
  BEFORE UPDATE ON public.offmarket_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Unlock records (email + listing)
CREATE TABLE public.offmarket_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.offmarket_listings(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  source_page TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_offmarket_unlocks_email ON public.offmarket_unlocks(email);
CREATE INDEX idx_offmarket_unlocks_listing ON public.offmarket_unlocks(listing_id);

GRANT INSERT ON public.offmarket_unlocks TO anon;
GRANT INSERT ON public.offmarket_unlocks TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.offmarket_unlocks TO authenticated;
GRANT ALL ON public.offmarket_unlocks TO service_role;

ALTER TABLE public.offmarket_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit unlock requests"
  ON public.offmarket_unlocks FOR INSERT
  WITH CHECK (
    length(COALESCE(email, '')) BETWEEN 3 AND 200
    AND length(COALESCE(name, '')) <= 200
    AND length(COALESCE(phone, '')) <= 50
  );

CREATE POLICY "Admins view unlock records"
  ON public.offmarket_unlocks FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Saved searches (email-based, no login required)
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  label TEXT,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  frequency TEXT NOT NULL DEFAULT 'weekly',
  alert_on_price_drop BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_saved_searches_email ON public.saved_searches(email);

GRANT INSERT ON public.saved_searches TO anon;
GRANT INSERT ON public.saved_searches TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.saved_searches TO authenticated;
GRANT ALL ON public.saved_searches TO service_role;

ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create saved searches"
  ON public.saved_searches FOR INSERT
  WITH CHECK (
    length(COALESCE(email, '')) BETWEEN 3 AND 200
    AND length(COALESCE(name, '')) <= 200
    AND length(COALESCE(phone, '')) <= 50
    AND length(COALESCE(label, '')) <= 200
    AND frequency IN ('daily','weekly','price_drop_only')
    AND octet_length(filters::text) <= 4000
  );

CREATE POLICY "Admins view saved searches"
  ON public.saved_searches FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON public.saved_searches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();