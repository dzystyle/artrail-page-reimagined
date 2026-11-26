DROP POLICY IF EXISTS "public read messages" ON public.game_messages;
REVOKE SELECT ON public.game_messages FROM anon, authenticated;