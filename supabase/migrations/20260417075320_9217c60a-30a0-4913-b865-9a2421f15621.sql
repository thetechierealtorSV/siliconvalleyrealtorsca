DROP POLICY "Anyone can submit leads" ON public.leads;

CREATE POLICY "Anyone can submit leads (constrained)" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND priority IN ('warm','hot')
    AND length(coalesce(name,'')) <= 200
    AND length(coalesce(email,'')) <= 200
    AND length(coalesce(phone,'')) <= 50
    AND length(coalesce(specialty,'')) <= 100
    AND length(coalesce(source_page,'')) <= 200
    AND octet_length(payload::text) <= 8000
  );