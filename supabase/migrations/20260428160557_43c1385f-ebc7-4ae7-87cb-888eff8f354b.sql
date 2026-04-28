-- Restrict notification inserts to service role (edge function)
DROP POLICY IF EXISTS "Service role inserts notifications" ON public.lead_notifications;
CREATE POLICY "Service role inserts notifications" ON public.lead_notifications
  FOR INSERT TO service_role WITH CHECK (true);

-- Hide is_admin from anon/authenticated direct execution; called only from policies (which run as definer)
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon, authenticated;
