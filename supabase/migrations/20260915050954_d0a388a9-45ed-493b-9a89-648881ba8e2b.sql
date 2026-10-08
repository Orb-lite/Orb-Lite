CREATE TABLE public.demo_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  company text,
  platform text NOT NULL DEFAULT 'wialon_lite',
  units text,
  message text,
  status text NOT NULL DEFAULT 'pendiente',
  demo_user_id uuid,
  demo_username text,
  sent_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.demo_requests TO service_role;

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo el sistema gestiona solicitudes demo"
ON public.demo_requests FOR ALL TO authenticated
USING (false) WITH CHECK (false);

CREATE TRIGGER update_demo_requests_updated_at
BEFORE UPDATE ON public.demo_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();