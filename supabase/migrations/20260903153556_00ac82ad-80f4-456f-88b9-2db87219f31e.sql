-- Constancias fiscales: acceso exclusivo del backend (service role).
-- Se declaran políticas explícitas que niegan cualquier acceso desde
-- clientes anónimos o autenticados sobre ese bucket privado.
CREATE POLICY "constancias_no_public_select"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id <> 'constancias-fiscales' AND false);

CREATE POLICY "constancias_no_public_insert"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id <> 'constancias-fiscales' AND false);

CREATE POLICY "constancias_no_public_update"
ON storage.objects FOR UPDATE TO anon, authenticated
USING (bucket_id <> 'constancias-fiscales' AND false)
WITH CHECK (bucket_id <> 'constancias-fiscales' AND false);

CREATE POLICY "constancias_no_public_delete"
ON storage.objects FOR DELETE TO anon, authenticated
USING (bucket_id <> 'constancias-fiscales' AND false);