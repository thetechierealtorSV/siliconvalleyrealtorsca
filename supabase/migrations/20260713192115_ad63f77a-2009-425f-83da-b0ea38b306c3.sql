CREATE TABLE public.lead_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  preferences TEXT[] NOT NULL DEFAULT '{}',
  name TEXT,
  email TEXT,
  phone TEXT,
  source_page TEXT
);

GRANT INSERT ON public.lead_preferences TO anon, authenticated;
GRANT ALL ON public.lead_preferences TO service_role;

ALTER TABLE public.lead_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit preferences"
  ON public.lead_preferences
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (name IS NULL OR char_length(name) <= 200)
    AND (email IS NULL OR char_length(email) <= 320)
    AND (phone IS NULL OR char_length(phone) <= 40)
    AND (source_page IS NULL OR char_length(source_page) <= 500)
    AND (array_length(preferences, 1) IS NULL OR array_length(preferences, 1) <= 20)
  );

CREATE POLICY "Admins can view preferences"
  ON public.lead_preferences
  FOR SELECT
  TO authenticated
  USING (private.is_admin(auth.uid()));

CREATE POLICY "Admins can update preferences"
  ON public.lead_preferences
  FOR UPDATE
  TO authenticated
  USING (private.is_admin(auth.uid()));

CREATE POLICY "Admins can delete preferences"
  ON public.lead_preferences
  FOR DELETE
  TO authenticated
  USING (private.is_admin(auth.uid()));

CREATE INDEX idx_lead_preferences_created ON public.lead_preferences(created_at DESC);
