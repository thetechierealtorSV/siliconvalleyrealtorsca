
ALTER TABLE public.site_feedback
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS page_url text,
  ADD COLUMN IF NOT EXISTS user_agent text;

DROP POLICY IF EXISTS "Public can upload feedback screenshots" ON storage.objects;
CREATE POLICY "Public can upload feedback screenshots"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'feedback-attachments');

DROP POLICY IF EXISTS "Admins can read feedback screenshots" ON storage.objects;
CREATE POLICY "Admins can read feedback screenshots"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'feedback-attachments' AND private.is_admin(auth.uid()));
