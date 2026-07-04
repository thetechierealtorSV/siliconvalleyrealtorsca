ALTER VIEW public.offmarket_listings_public SET (security_invoker = true);
GRANT SELECT ON public.offmarket_listings TO authenticated;