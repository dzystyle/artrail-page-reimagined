import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import type { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const TEXT_MODEL = "openai/gpt-6-astra";
const IMAGE_MODEL = "openai/gpt-image-2.5-sunburst";

export class GatewayError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

function key() {
  const k = process.env["LOVABLE_API_KEY"];
  if (!k) throw new GatewayError(401, "AI 服务未配置。");
  return k;
}

export function friendlyError(e: unknown): string {
  const status = (e as { statusCode?: number; status?: number })?.statusCode ?? (e as { status?: number })?.status;
  if (status === 402) return "AI 积分不足，请在 设置 → 套餐与积分 中充值后重试。";
  if (status === 429) return "请求过于频繁，请稍后再试。";
  if (status === 403) return "当前工作区暂无此 AI 模型的使用权限。";
  if (status === 401) return "AI 服务未配置。";
  if (e instanceof GatewayError) return e.message;
  return "生成失败，请稍后重试。";
}

function provider() {
  const k = key();
  return createOpenAI({ baseURL: GATEWAY, apiKey: k, headers: { "Lovable-API-Key": k, "X-Lovable-AIG-SDK": "vercel-ai-sdk" } });
}

const openaiOptions = { openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] } };

export async function aiText(instructions: string, prompt: string) {
  const result = streamText({ model: provider().responses(TEXT_MODEL), instructions, prompt, providerOptions: openaiOptions });
  return await result.text;
}

export async function aiObject<T>(instructions: string, prompt: string, schema: z.ZodType<T>) {
  const result = streamText({ model: provider().responses(TEXT_MODEL), instructions, prompt, output: Output.object({ schema }), providerOptions: openaiOptions });
  return (await result.output) as T;
}

export async function aiImage(prompt: string): Promise<Uint8Array> {
  const res = await fetch(`${GATEWAY}/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: IMAGE_MODEL, prompt, quality: "low", size: "1024x1024" }),
  });
  if (!res.ok) { console.error("image gen", res.status, await res.text()); throw new GatewayError(res.status, "图片生成失败。"); }
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new GatewayError(500, "图片生成未返回结果。");
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

export function extractHtml(text: string) {
  const fenced = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
  const body = (fenced?.[1] ?? text).trim();
  const start = body.search(/<!doctype html|<html/i);
  return start >= 0 ? body.slice(start) : body;
}
