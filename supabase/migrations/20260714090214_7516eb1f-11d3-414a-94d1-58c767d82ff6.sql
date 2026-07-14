
DROP POLICY IF EXISTS "Public can upload feedback screenshots" ON storage.objects;

CREATE POLICY "Public can upload feedback screenshots"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'feedback-attachments'
    AND lower(storage.extension(name)) = ANY (ARRAY['png','jpg','jpeg','webp','gif'])
    AND COALESCE((metadata->>'size')::bigint, 0) <= 5242880
  );
