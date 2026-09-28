-- Las constancias fiscales solo se manejan desde el servidor (service role),
-- que no depende de estas reglas. Sin reglas, storage.objects niega por
-- defecto cualquier acceso desde visitantes o usuarios con sesión.
DROP POLICY IF EXISTS "constancias_no_public_select" ON storage.objects;
DROP POLICY IF EXISTS "constancias_no_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "constancias_no_public_update" ON storage.objects;
DROP POLICY IF EXISTS "constancias_no_public_delete" ON storage.objects;