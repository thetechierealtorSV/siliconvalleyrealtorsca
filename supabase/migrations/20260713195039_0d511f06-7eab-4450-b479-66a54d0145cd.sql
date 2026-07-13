
-- Grants (missing) — RLS alone isn't enough; PostgREST needs table-level privileges
GRANT INSERT ON public.lead_preferences TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.lead_preferences TO authenticated;
GRANT ALL ON public.lead_preferences TO service_role;

GRANT INSERT ON public.lead_notifications TO anon, authenticated;
GRANT SELECT ON public.lead_notifications TO authenticated;
GRANT ALL ON public.lead_notifications TO service_role;

-- Allow public insert into lead_notifications (currently only service_role can insert)
DROP POLICY IF EXISTS "Anyone can submit notifications" ON public.lead_notifications;
CREATE POLICY "Anyone can submit notifications"
  ON public.lead_notifications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (channel IS NULL OR char_length(channel) <= 100)
    AND (status IS NULL OR char_length(status) <= 50)
    AND (detail IS NULL OR char_length(detail) <= 2000)
  );
