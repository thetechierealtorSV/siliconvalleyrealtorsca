
-- Fix admins policy: restrict to authenticated role
DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;
CREATE POLICY "Admins can view admins" ON public.admins
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- Fix agent_profiles: drop broken policy, allow public to read non-sensitive columns only via column-level grants
DROP POLICY IF EXISTS "Public can view non-sensitive agent fields" ON public.agent_profiles;

REVOKE SELECT ON public.agent_profiles FROM anon, authenticated;
GRANT SELECT (id, full_name, role, bio, photo_url, display_order, created_at) ON public.agent_profiles TO anon, authenticated;
-- Admins continue to have full access via the existing "Admins manage agent profiles" ALL policy (service_role bypasses RLS)
GRANT SELECT (email, phone) ON public.agent_profiles TO service_role;

CREATE POLICY "Public can view agent profiles (non-sensitive columns)" ON public.agent_profiles
  FOR SELECT TO anon, authenticated
  USING (true);
