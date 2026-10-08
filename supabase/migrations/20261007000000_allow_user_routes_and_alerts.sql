-- Permitir lectura y escritura en user_routes para la plataforma satelital
ALTER TABLE public.user_routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura user_routes publicas" ON public.user_routes;
CREATE POLICY "Permitir lectura user_routes publicas"
ON public.user_routes
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir insertar user_routes publicas" ON public.user_routes;
CREATE POLICY "Permitir insertar user_routes publicas"
ON public.user_routes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizar user_routes publicas" ON public.user_routes;
CREATE POLICY "Permitir actualizar user_routes publicas"
ON public.user_routes
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir eliminar user_routes publicas" ON public.user_routes;
CREATE POLICY "Permitir eliminar user_routes publicas"
ON public.user_routes
FOR DELETE
TO anon, authenticated
USING (true);

-- Permitir acceso completo a shared_links
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura shared_links publicas" ON public.shared_links;
CREATE POLICY "Permitir lectura shared_links publicas"
ON public.shared_links
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir insertar shared_links publicas" ON public.shared_links;
CREATE POLICY "Permitir insertar shared_links publicas"
ON public.shared_links
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizar shared_links publicas" ON public.shared_links;
CREATE POLICY "Permitir actualizar shared_links publicas"
ON public.shared_links
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
