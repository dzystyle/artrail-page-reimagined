import { createFileRoute } from "@tanstack/react-router";
import { assetPresetPrompt, getAssetPreset, getPixelStyle } from "@/lib/asset-presets";

export const Route = createFileRoute("/api/public/asset-template-image")({
  server: { handlers: { POST: async ({ request }) => {
    if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ message: "请求来源无效。" }, { status: 403 });
    let form: FormData;
    try { form = await request.formData(); } catch { return Response.json({ message: "请上传参考图片。" }, { status: 400 }); }
    const image = form.get("image");
    const template = String(form.get("template") ?? "");
    const density = String(form.get("density") ?? "");
    const outputValue = form.get("output");
    const output = Number(outputValue);
    const description = String(form.get("description") ?? "").trim();
    if (!(image instanceof File) || !["image/png", "image/jpeg", "image/webp"].includes(image.type) || image.size === 0 || image.size > 20 * 1024 * 1024) return Response.json({ message: "请选择不超过 20 MB 的 PNG、JPG 或 WebP 图片。" }, { status: 400 });
    if (!getAssetPreset(template) || !getPixelStyle(density) || outputValue === null || !Number.isInteger(output) || output < 0 || output > 3 || description.length > 2000) return Response.json({ message: "资产模板参数无效。" }, { status: 400 });
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const { data: access, error } = await db.from("canvas_image_access").select("blocked_status, message").eq("id", "image").maybeSingle();
    if (error) return Response.json({ message: "暂时无法检查图片生成服务状态。" }, { status: 503 });
    if (access?.blocked_status) return Response.json({ message: access.message }, { status: access.blocked_status });
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return Response.json({ message: "图片生成服务未配置。" }, { status: 401 });
    const upload = new FormData();
    upload.set("image", image);
    upload.set("prompt", assetPresetPrompt(template, density, output, description));
    upload.set("stream", form.get("stream") === "false" ? "false" : "true");
    const { editImage } = await import("@/lib/image-gateway.server");
    const upstream = await editImage({ baseURL: "https://ai.gateway.lovable.dev", apiKey, model: "openai/gpt-image-2.5-sunburst", format: "openai" }, upload);
    if (!upstream.ok) {
      const payload = await upstream.json().catch(() => ({})) as { message?: string; error?: { message?: string } };
      const message = payload.message ?? payload.error?.message ?? `图片生成失败（${upstream.status}）。`;
      if (upstream.status === 402 || upstream.status === 403) await db.from("canvas_image_access").upsert({ id: "image", blocked_status: upstream.status, message });
      return Response.json({ message }, { status: upstream.status });
    }
    const headers = new Headers({ "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream", "Cache-Control": "no-store" });
    upstream.headers.forEach((value, name) => { if (name.toLowerCase().startsWith("x-lovable-aig-")) headers.set(name, value); });
    return new Response(upstream.body, { status: upstream.status, headers });
  } } },
});