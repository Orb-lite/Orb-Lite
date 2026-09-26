CREATE TABLE public.user_routes (
  id TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  user_name TEXT,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#f59e0b',
  points JSONB NOT NULL DEFAULT '[]'::jsonb,
  route_stops JSONB,
  origin TEXT,
  addresses JSONB,
  distance_meters DOUBLE PRECISION,
  duration_seconds DOUBLE PRECISION,
  share_token TEXT UNIQUE,
  stops JSONB,
  report_email TEXT,
  report_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX user_routes_user_id_idx ON public.user_routes (user_id);
CREATE INDEX user_routes_share_token_idx ON public.user_routes (share_token);
GRANT ALL ON public.user_routes TO service_role;
ALTER TABLE public.user_routes ENABLE ROW LEVEL SECURITY;