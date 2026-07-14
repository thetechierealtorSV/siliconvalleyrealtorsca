
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.site_feedback;
CREATE POLICY "Anyone can submit feedback" ON public.site_feedback
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (rating IS NULL OR (rating BETWEEN 1 AND 5))
    AND (liked_notes IS NULL OR char_length(liked_notes) <= 4000)
    AND (improve_notes IS NULL OR char_length(improve_notes) <= 4000)
    AND (name IS NULL OR char_length(name) <= 200)
    AND (email IS NULL OR (char_length(email) <= 320 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
    AND (page_url IS NULL OR char_length(page_url) <= 2048)
    AND (user_agent IS NULL OR char_length(user_agent) <= 1024)
    AND (attachment_url IS NULL OR char_length(attachment_url) <= 2048)
  );

DROP POLICY IF EXISTS "Service role inserts notifications" ON public.lead_notifications;
CREATE POLICY "Service role inserts notifications" ON public.lead_notifications
  FOR INSERT TO service_role
  WITH CHECK (
    char_length(channel) <= 100
    AND char_length(status) <= 100
    AND (detail IS NULL OR char_length(detail) <= 4000)
  );
