-- Tabla para registrar y asociar usuarios autenticados vía Wialon con el CRM de ORB-LITE
CREATE TABLE IF NOT EXISTS public.platform_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wialon_user_id BIGINT NOT NULL UNIQUE,
  wialon_username TEXT NOT NULL,
  host TEXT NOT NULL DEFAULT 'lite',
  customer_number INTEGER,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  custom_settings JSONB DEFAULT '{}'::jsonb,
  last_login_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsqueda rápida por ID de Wialon y por número de cliente
CREATE INDEX IF NOT EXISTS platform_users_wialon_id_idx ON public.platform_users (wialon_user_id);
CREATE INDEX IF NOT EXISTS platform_users_customer_number_idx ON public.platform_users (customer_number);

-- Políticas RLS abiertas para lectura y escritura desde la aplicación
ALTER TABLE public.platform_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura y registro de usuarios de plataforma"
ON public.platform_users
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Agregar columnas en customers para vinculación directa de Wialon si no existen
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS wialon_user_id BIGINT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS wialon_username TEXT;
