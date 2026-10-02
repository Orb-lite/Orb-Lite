-- Permitir que el sistema gestione crm_access_codes
ALTER TABLE public.crm_access_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir gestionar codigos crm" ON public.crm_access_codes;
CREATE POLICY "Permitir gestionar codigos crm"
ON public.crm_access_codes
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
