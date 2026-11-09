CREATE TABLE public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '未命名游戏',
  prompt text NOT NULL,
  design jsonb,
  code text,
  status text NOT NULL DEFAULT 'designing',
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.game_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  kind text NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.game_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.games, public.game_assets, public.game_messages TO anon, authenticated;
GRANT ALL ON public.games, public.game_assets, public.game_messages TO service_role;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read games" ON public.games FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read assets" ON public.game_assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read messages" ON public.game_messages FOR SELECT TO anon, authenticated USING (true);