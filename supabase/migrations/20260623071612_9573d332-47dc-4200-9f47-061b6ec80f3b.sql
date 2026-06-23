
-- 1. agent_profiles: drop USING(true) public policy; rely on agent_profiles_public view for public reads
DROP POLICY IF EXISTS "Public can view agent profiles (non-sensitive columns)" ON public.agent_profiles;
REVOKE SELECT ON public.agent_profiles FROM anon, authenticated;
REVOKE SELECT (id, full_name, role, bio, photo_url, display_order, created_at) ON public.agent_profiles FROM anon, authenticated;

-- 2. offmarket_listings: hide hidden_details from public; require unlock to read
DROP POLICY IF EXISTS "Anyone can view active off-market teasers" ON public.offmarket_listings;
REVOKE SELECT ON public.offmarket_listings FROM anon, authenticated;
GRANT SELECT (id, neighborhood, price_band, beds, baths, sqft, teaser_summary, hero_image_url, status, display_order, created_at, updated_at) ON public.offmarket_listings TO anon, authenticated;
CREATE POLICY "Public can view active off-market teasers (non-sensitive)"
  ON public.offmarket_listings
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- 3. Secure RPC to reveal hidden_details only after a verified unlock
CREATE OR REPLACE FUNCTION public.get_offmarket_details(p_listing_id uuid, p_email text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.hidden_details
  FROM public.offmarket_listings l
  WHERE l.id = p_listing_id
    AND l.status = 'active'
    AND EXISTS (
      SELECT 1 FROM public.offmarket_unlocks u
      WHERE u.listing_id = p_listing_id
        AND lower(u.email) = lower(trim(p_email))
    )
$$;

REVOKE ALL ON FUNCTION public.get_offmarket_details(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_offmarket_details(uuid, text) TO anon, authenticated;
