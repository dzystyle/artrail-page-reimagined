import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/api/public/canvas-image")({
  server: { handlers: { POST: async ({ request }) => {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) return Response.json({ message: "请求来源无效。" }, { status: 403 });
    const parsed = z.object({ gameId: z.string().uuid(), prompt: z.string().trim().min(1).max(4000), stream: z.boolean().default(true) }).safeParse(await request.json());
    if (!parsed.success) return Response.json({ message: "请输入图片描述。" }, { status: 400 });
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const { data: game } = await db.from("games").select("id").eq("id", parsed.data.gameId).maybeSingle();
    if (!game) return Response.json({ message: "找不到这个游戏。" }, { status: 404 });
    const { data: access } = await db.from("canvas_image_access").select("blocked_status, message").eq("id", "image").maybeSingle();
    if (access?.blocked_status) return Response.json({ message: access.message }, { status: access.blocked_status });
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return Response.json({ message: "图片生成服务未配置。" }, { status: 401 });
    const { generateImage } = await import("@/lib/image-gateway.server");
    const upstream = await generateImage({ baseURL: "https://ai.gateway.lovable.dev", apiKey, model: "openai/gpt-image-2.5-sunburst", format: "openai" }, parsed.data.prompt, parsed.data.stream);
    if (!upstream.ok) {
      const payload = await upstream.json().catch(() => ({})) as { message?: string; error?: { message?: string } };
      const message = payload.message ?? payload.error?.message ?? `图片生成失败（${upstream.status}）。`;
      if (upstream.status === 402 || upstream.status === 403) await db.from("canvas_image_access").upsert({ id: "image", blocked_status: upstream.status, message });
      return Response.json({ message }, { status: upstream.status });
    }
    return new Response(upstream.body, { status: upstream.status, headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json", "Cache-Control": "no-store" } });
  } } },
});