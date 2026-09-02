CREATE TABLE public.solicitudes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  customer_number INTEGER,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  shipping_label TEXT,
  wants_invoice BOOLEAN NOT NULL DEFAULT false,
  billing JSONB,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'vendido', 'no_vendido')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.solicitudes TO service_role;

ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_solicitudes_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_solicitudes_updated_at BEFORE UPDATE ON public.solicitudes FOR EACH ROW EXECUTE FUNCTION public.update_solicitudes_updated_at();

CREATE INDEX idx_solicitudes_status ON public.solicitudes (status);
CREATE INDEX idx_solicitudes_customer_number ON public.solicitudes (customer_number);