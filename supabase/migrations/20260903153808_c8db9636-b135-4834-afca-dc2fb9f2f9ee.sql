ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS constancia_path text,
  ADD COLUMN IF NOT EXISTS constancia_file_name text,
  ADD COLUMN IF NOT EXISTS constancia_url text,
  ADD COLUMN IF NOT EXISTS constancia_uploaded_at timestamp with time zone;