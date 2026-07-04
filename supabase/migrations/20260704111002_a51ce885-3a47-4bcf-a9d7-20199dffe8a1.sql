
-- Drop the helper view; use column-level grants on the base table instead
DROP VIEW IF EXISTS public.offmarket_listings_public;

-- Restore public read of teaser rows only
CREATE POLICY "Public can view active off-market teasers"
  ON public.offmarket_listings FOR SELECT
  USING (status = 'active');

-- Column-level grant: anon may read only non-sensitive columns
GRANT SELECT (
  id, neighborhood, price_band, beds, baths, sqft,
  teaser_summary, hero_image_url, status, display_order,
  created_at, updated_at
) ON public.offmarket_listings TO anon, authenticated;
