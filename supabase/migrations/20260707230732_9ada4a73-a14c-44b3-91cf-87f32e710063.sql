
-- Hide sensitive off-market fields from public/authenticated via column-level revoke.
-- Only service_role (used by get-offmarket-details edge function after unlock) can read hidden_details.
REVOKE SELECT (hidden_details) ON public.offmarket_listings FROM anon;
REVOKE SELECT (hidden_details) ON public.offmarket_listings FROM authenticated;

-- Replace the broad public SELECT policy with one that grants only teaser columns.
DROP POLICY IF EXISTS "Public can view active off-market teasers" ON public.offmarket_listings;

-- Grant explicit column-level SELECT on teaser fields only.
GRANT SELECT (id, neighborhood, price_band, beds, baths, sqft, teaser_summary, hero_image_url, status, display_order, created_at, updated_at)
  ON public.offmarket_listings TO anon, authenticated;

CREATE POLICY "Public can view active off-market teasers"
  ON public.offmarket_listings
  FOR SELECT
  USING (status = 'active');
