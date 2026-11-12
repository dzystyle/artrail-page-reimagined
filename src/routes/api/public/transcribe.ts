import { createFileRoute } from "@tanstack/react-router";

const MAX_AUDIO_BYTES = 24 * 1024 * 1024;

export const Route = createFileRoute("/api/public/transcribe")({
  server: { handlers: { POST: async ({ request }) => {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) return Response.json({ message: "请求来源无效。" }, { status: 403 });
    const declared = Number(request.headers.get("content-length") ?? 0);
    if (declared > MAX_AUDIO_BYTES + 1024 * 1024) return Response.json({ message: "录音文件太大，请缩短录音后重试。" }, { status: 400 });
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return Response.json({ message: "语音服务未配置。" }, { status: 401 });
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size) return Response.json({ message: "没有收到录音，请重新录制。" }, { status: 400 });
    if (file.size > MAX_AUDIO_BYTES) return Response.json({ message: "录音文件太大，请缩短录音后重试。" }, { status: 400 });
    if (!file.type.startsWith("audio/")) return Response.json({ message: "录音格式不支持。" }, { status: 400 });
    const upstreamForm = new FormData();
    upstreamForm.append("model", "openai/gpt-transcribe");
    upstreamForm.append("file", file, file.name || "recording.wav");
    upstreamForm.append("response_format", "json");
    upstreamForm.append("stream", "true");
    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: upstreamForm,
      signal: request.signal,
    });
    if (!upstream.ok) {
      const payload = await upstream.json().catch(() => ({})) as { message?: string; error?: { message?: string } };
      const message = payload.message ?? payload.error?.message ?? `语音转文字失败（${upstream.status}）。`;
      return Response.json({ message }, { status: upstream.status });
    }
    return new Response(upstream.body, { status: upstream.status, headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream", "Cache-Control": "no-store" } });
  } } },
});
