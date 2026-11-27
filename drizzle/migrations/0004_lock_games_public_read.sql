DROP POLICY IF EXISTS "public read games" ON public.games;
DROP POLICY IF EXISTS "public read assets" ON public.game_assets;
REVOKE SELECT ON public.games FROM anon, authenticated;
REVOKE SELECT ON public.game_assets FROM anon, authenticated;