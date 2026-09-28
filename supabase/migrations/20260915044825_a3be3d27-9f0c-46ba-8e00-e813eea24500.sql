CREATE TABLE public.demo_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_number integer,
  full_name text NOT NULL,
  company text,
  platform text NOT NULL DEFAULT 'wialon_lite',
  username text NOT NULL UNIQUE,
  password text NOT NULL DEFAULT 'Abc2026+',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX demo_users_customer_number_key ON public.demo_users (customer_number) WHERE customer_number IS NOT NULL;

GRANT ALL ON public.demo_users TO service_role;

ALTER TABLE public.demo_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo el sistema gestiona usuarios demo" ON public.demo_users FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE TRIGGER update_demo_users_updated_at BEFORE UPDATE ON public.demo_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();