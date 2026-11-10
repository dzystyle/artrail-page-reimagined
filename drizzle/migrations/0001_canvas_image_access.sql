CREATE TABLE public.canvas_image_access (id text PRIMARY KEY, blocked_status integer, message text, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.canvas_image_access TO service_role;
ALTER TABLE public.canvas_image_access ENABLE ROW LEVEL SECURITY;