
CREATE TABLE public.site_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  liked text[],
  liked_notes text,
  improve_notes text,
  rating int CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  contact_opt_in boolean NOT NULL DEFAULT false,
  name text,
  email text
);

GRANT INSERT ON public.site_feedback TO anon;
GRANT INSERT ON public.site_feedback TO authenticated;
GRANT ALL ON public.site_feedback TO service_role;

ALTER TABLE public.site_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON public.site_feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read feedback"
  ON public.site_feedback
  FOR SELECT
  TO authenticated
  USING (private.is_admin(auth.uid()));
