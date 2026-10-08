-- 1. Tabla de usuarios de la plataforma satelital (cuentas padre y subcuentas)
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
  is_parent BOOLEAN NOT NULL DEFAULT false,
  parent_user_id BIGINT,
  shared_permissions JSONB NOT NULL DEFAULT '{"routes": true, "geofences": true, "tracking_links": true}'::jsonb,
  custom_settings JSONB DEFAULT '{}'::jsonb,
  last_login_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Índices para búsquedas optimizadas
CREATE INDEX IF NOT EXISTS platform_users_wialon_id_idx ON public.platform_users (wialon_user_id);
CREATE INDEX IF NOT EXISTS platform_users_parent_id_idx ON public.platform_users (parent_user_id);
CREATE INDEX IF NOT EXISTS platform_users_customer_number_idx ON public.platform_users (customer_number);

-- 3. Tabla para controlar la visibilidad granular de recursos compartidos (rutas, geocercas, links)
CREATE TABLE IF NOT EXISTS public.shared_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id BIGINT NOT NULL,
  subuser_id BIGINT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  resource_name TEXT,
  can_view BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (parent_user_id, subuser_id, resource_type, resource_id)
);

CREATE INDEX IF NOT EXISTS shared_resources_subuser_idx ON public.shared_resources (subuser_id, resource_type);

-- 4. Habilitar seguridad de nivel de fila (RLS) y políticas de acceso
ALTER TABLE public.platform_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir acceso a platform_users" ON public.platform_users;
CREATE POLICY "Permitir acceso a platform_users"
ON public.platform_users
FOR ALL
TO public
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso a shared_resources" ON public.shared_resources;
CREATE POLICY "Permitir acceso a shared_resources"
ON public.shared_resources
FOR ALL
TO public
USING (true)
WITH CHECK (true);
