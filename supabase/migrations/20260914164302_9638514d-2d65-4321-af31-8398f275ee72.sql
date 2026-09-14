CREATE TABLE public.renovaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_number integer,
  customer_name text,
  customer_email text,
  customer_phone text,
  variant_id text NOT NULL,
  variant_name text NOT NULL,
  platform text,
  renewal_kind text NOT NULL DEFAULT 'platform',
  renewal_period text NOT NULL DEFAULT 'annual',
  unit_name text,
  imei text,
  iccid text,
  sim_phone text,
  amount numeric NOT NULL DEFAULT 0,
  renewal_date date NOT NULL,
  last_paid_at timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'activa',
  last_order_id text,
  notices jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX renovaciones_renewal_date_idx ON public.renovaciones (renewal_date);
CREATE INDEX renovaciones_customer_idx ON public.renovaciones (customer_number);

GRANT ALL ON public.renovaciones TO service_role;

ALTER TABLE public.renovaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo el sistema gestiona renovaciones" ON public.renovaciones FOR ALL TO authenticated USING (false) WITH CHECK (false);

CREATE TRIGGER update_renovaciones_updated_at BEFORE UPDATE ON public.renovaciones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();