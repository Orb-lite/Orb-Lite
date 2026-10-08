-- 1. Permitir a clientes registrar pedidos desde la tienda pública
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir insertar solicitudes publicas" ON public.solicitudes;
CREATE POLICY "Permitir insertar solicitudes publicas"
ON public.solicitudes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Permitir a visitantes solicitar demos desde la landing page
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir insertar demo_requests publicas" ON public.demo_requests;
CREATE POLICY "Permitir insertar demo_requests publicas"
ON public.demo_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Corregir error 42703 en shared_links agregando la columna updated_at esperada por el trigger
ALTER TABLE public.shared_links
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- 4. Permitir lectura de hardware_command_definitions para consulta de comandos
ALTER TABLE public.hardware_command_definitions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura comandos hardware" ON public.hardware_command_definitions;
CREATE POLICY "Permitir lectura comandos hardware"
ON public.hardware_command_definitions
FOR SELECT
TO anon, authenticated
USING (true);
