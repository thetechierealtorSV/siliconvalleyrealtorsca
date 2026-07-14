
-- Harden admins table: explicit deny of client-side writes + audit log.
-- RLS already blocks these by default (no policies), but explicit DENY policies
-- make the intent auditable and survive future policy additions.

REVOKE INSERT, UPDATE, DELETE ON public.admins FROM anon, authenticated;
GRANT SELECT ON public.admins TO authenticated;  -- gated by existing "Admins can view admins" policy
GRANT ALL ON public.admins TO service_role;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admins' AND policyname='Deny client insert to admins') THEN
    EXECUTE 'CREATE POLICY "Deny client insert to admins" ON public.admins FOR INSERT TO anon, authenticated WITH CHECK (false)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admins' AND policyname='Deny client update to admins') THEN
    EXECUTE 'CREATE POLICY "Deny client update to admins" ON public.admins FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admins' AND policyname='Deny client delete to admins') THEN
    EXECUTE 'CREATE POLICY "Deny client delete to admins" ON public.admins FOR DELETE TO anon, authenticated USING (false)';
  END IF;
END $$;

-- Admin access audit log: append-only, admin-readable, written by trigger on admins changes.
CREATE TABLE IF NOT EXISTS public.admin_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor uuid,
  action text NOT NULL,
  target_email text,
  detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_access_log TO authenticated;
GRANT ALL  ON public.admin_access_log TO service_role;

ALTER TABLE public.admin_access_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_access_log' AND policyname='Admins read admin access log') THEN
    EXECUTE 'CREATE POLICY "Admins read admin access log" ON public.admin_access_log FOR SELECT TO authenticated USING (private.is_admin(auth.uid()))';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_access_log' AND policyname='No client writes to admin access log') THEN
    EXECUTE 'CREATE POLICY "No client writes to admin access log" ON public.admin_access_log FOR INSERT TO anon, authenticated WITH CHECK (false)';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.log_admin_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_access_log(actor, action, target_email, detail)
  VALUES (
    auth.uid(),
    TG_OP,
    COALESCE(NEW.email, OLD.email),
    to_jsonb(COALESCE(NEW, OLD))
  );
  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS trg_log_admin_change ON public.admins;
CREATE TRIGGER trg_log_admin_change
AFTER INSERT OR UPDATE OR DELETE ON public.admins
FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
