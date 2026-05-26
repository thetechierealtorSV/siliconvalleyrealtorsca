DROP POLICY IF EXISTS "Agent profiles are public" ON public.agent_profiles;

CREATE OR REPLACE VIEW public.agent_profiles_public
WITH (security_invoker = true)
AS
SELECT id, full_name, role, bio, photo_url, display_order, created_at
FROM public.agent_profiles;

CREATE POLICY "Public can view non-sensitive agent fields"
ON public.agent_profiles
FOR SELECT
TO anon, authenticated
USING (false);

GRANT SELECT ON public.agent_profiles_public TO anon, authenticated;