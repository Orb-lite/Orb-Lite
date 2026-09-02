CREATE TABLE public.crm_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX crm_access_codes_email_idx ON public.crm_access_codes (email, created_at DESC);
GRANT ALL ON public.crm_access_codes TO service_role;
ALTER TABLE public.crm_access_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Solo el sistema gestiona codigos" ON public.crm_access_codes FOR ALL TO authenticated USING (false) WITH CHECK (false);