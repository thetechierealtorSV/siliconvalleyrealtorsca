
-- 1. Private schema for helper functions
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated;

-- 2. Move is_admin into private
CREATE OR REPLACE FUNCTION private.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = _user_id) $$;

REVOKE ALL ON FUNCTION private.is_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin(uuid) TO anon, authenticated, service_role;

-- 3. Recreate every policy that referenced public.is_admin
DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;
CREATE POLICY "Admins can view admins" ON public.admins FOR SELECT USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage agent profiles" ON public.agent_profiles;
CREATE POLICY "Admins manage agent profiles" ON public.agent_profiles FOR ALL USING (private.is_admin(auth.uid())) WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins view notifications" ON public.lead_notifications;
CREATE POLICY "Admins view notifications" ON public.lead_notifications FOR SELECT USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE USING (private.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE USING (private.is_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins manage off-market listings" ON public.offmarket_listings;
CREATE POLICY "Admins manage off-market listings" ON public.offmarket_listings FOR ALL USING (private.is_admin(auth.uid())) WITH CHECK (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins view unlock records" ON public.offmarket_unlocks;
CREATE POLICY "Admins view unlock records" ON public.offmarket_unlocks FOR SELECT USING (private.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins view saved searches" ON public.saved_searches;
CREATE POLICY "Admins view saved searches" ON public.saved_searches FOR SELECT USING (private.is_admin(auth.uid()));

-- 4. Drop public is_admin now that no policy references it
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- 5. Drop the get_offmarket_details RPC (moved to edge function)
DROP FUNCTION IF EXISTS public.get_offmarket_details(uuid, text);

-- 6. Hide off-market listing confidential fields from public reads
DROP POLICY IF EXISTS "Public can view active off-market teasers (non-sensitive)" ON public.offmarket_listings;
REVOKE SELECT ON public.offmarket_listings FROM anon;

CREATE OR REPLACE VIEW public.offmarket_listings_public AS
SELECT
  id, neighborhood, price_band, beds, baths, sqft,
  teaser_summary, hero_image_url, status, display_order,
  created_at, updated_at
FROM public.offmarket_listings
WHERE status = 'active';

GRANT SELECT ON public.offmarket_listings_public TO anon, authenticated;
