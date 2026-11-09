import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { GameDesign } from "./game-pipeline";

const idInput = z.object({ id: z.string().uuid() });

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function fail(id: string, e: unknown) {
  const { friendlyError } = await import("./games.server");
  console.error("game generation", e);
  const msg = friendlyError(e);
  await (await admin()).from("games").update({ status: "error", error: msg, updated_at: new Date().toISOString() }).eq("id", id);
  return { error: msg };
}

export const createGame = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ prompt: z.string().trim().min(1).max(4000) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: row, error } = await db.from("games").insert({ prompt: data.prompt, title: data.prompt.slice(0, 24) }).select("id").single();
    if (error) throw new Error("创建游戏失败");
    await db.from("game_messages").insert({ game_id: row.id, role: "user", content: data.prompt });
    return { id: row.id };
  });

export const getGame = createServerFn({ method: "GET" })
  .inputValidator((d) => idInput.parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const [{ data: game }, { data: assets }, { data: messages }] = await Promise.all([
      db.from("games").select("*").eq("id", data.id).maybeSingle(),
      db.from("game_assets").select("id, kind, name, url").eq("game_id", data.id).order("created_at"),
      db.from("game_messages").select("id, role, content").eq("game_id", data.id).order("created_at"),
    ]);
    if (!game) return null;
    return { game: { ...game, design: game.design as GameDesign | null }, assets: assets ?? [], messages: messages ?? [] };
  });

export const listGames = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("任务加载失败，请稍后重试");
  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await db.from("games").select("id, title, status, updated_at").order("updated_at", { ascending: false }).limit(50);
  if (error) throw new Error("任务加载失败，请稍后重试");
  return data ?? [];
});

const designSchema = z.object({
  title: z.string(),
  summary: z.string(),
  sections: z.array(z.object({ heading: z.string(), body: z.string() })),
  assets: z.array(z.object({ kind: z.string(), name: z.string(), prompt: z.string() })),
});

export const generateDesign = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: game } = await db.from("games").select("prompt, status").eq("id", data.id).single();
    if (!game || game.status !== "designing") return { ok: true };
    try {
      const { aiObject } = await import("./games.server");
      const design = await aiObject(
        "你是资深游戏策划。根据用户需求为一个可在浏览器中运行的小型 HTML5 Canvas 游戏写简洁的中文设计文档。sections 依次为：游戏概述、主题与目标、核心玩法、操作方式、美术与资产、验收标准，每节 2-4 句。assets 列出 4 张需要 AI 生成的图片（kind 取 概念/角色/场景/道具/界面 之一，name 为英文小写文件名如 player.png，prompt 为英文图像描述：游戏精灵/背景用纯色或简单背景，风格统一）。必须包含 1 张场景背景和 1 张玩家角色。",
        game.prompt, designSchema);
      await db.from("games").update({ design, title: design.title, status: "assets", updated_at: new Date().toISOString() }).eq("id", data.id);
      return { ok: true };
    } catch (e) { return fail(data.id, e); }
  });

export const generateAsset = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid(), index: z.number().int().min(0).max(10) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: game } = await db.from("games").select("design, status").eq("id", data.id).single();
    const design = game?.design as GameDesign | null;
    const { count } = await db.from("game_assets").select("id", { count: "exact", head: true }).eq("game_id", data.id);
    const plan = design?.assets[data.index];
    if (!game || game.status !== "assets" || !plan || count !== data.index) return { ok: true };
    try {
      const { aiImage } = await import("./games.server");
      const bytes = await aiImage(`${plan.prompt}. Video game asset, clean, consistent stylized art.`);
      const path = `${data.id}/${data.index}-${plan.name.replace(/[^a-z0-9.-]/gi, "")}`;
      const up = await db.storage.from("game-assets").upload(path, bytes, { contentType: "image/png", upsert: true });
      if (up.error) throw up.error;
      const { data: signed } = await db.storage.from("game-assets").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      if (!signed) throw new Error("签名失败");
      await db.from("game_assets").insert({ game_id: data.id, kind: plan.kind, name: plan.name, url: signed.signedUrl });
      if (data.index + 1 >= design!.assets.length) await db.from("games").update({ status: "coding", updated_at: new Date().toISOString() }).eq("id", data.id);
      return { ok: true };
    } catch (e) { return fail(data.id, e); }
  });

const codeRules = "输出一个完整、自包含、可直接运行的 HTML 文件（只输出代码，放在 ```html 代码块里）。使用原生 JavaScript + Canvas，不得引用任何外部脚本或字体。画布自适应窗口并居中，支持键盘和触屏/鼠标操作；包含开始提示、计分、失败/胜利与重新开始。图片用 new Image() 加载提供的 URL（设置 crossOrigin 不需要），加载失败时用彩色图形兜底。界面文字用中文。";

export const generateCode = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: game } = await db.from("games").select("prompt, design, status").eq("id", data.id).single();
    if (!game || game.status !== "coding") return { ok: true };
    const { data: assets } = await db.from("game_assets").select("kind, name, url").eq("game_id", data.id);
    try {
      const { aiText, extractHtml } = await import("./games.server");
      const text = await aiText(`你是资深 HTML5 游戏开发者。${codeRules}`,
        `用户需求：${game.prompt}\n\n设计文档：${JSON.stringify(game.design)}\n\n可用图片资产：\n${(assets ?? []).map(a => `- ${a.kind} ${a.name}: ${a.url}`).join("\n")}`);
      const code = extractHtml(text);
      await db.from("games").update({ code, status: "ready", error: null, updated_at: new Date().toISOString() }).eq("id", data.id);
      await db.from("game_messages").insert({ game_id: data.id, role: "assistant", content: "游戏已生成，打开 Game 即可试玩。告诉我你想修改什么。" });
      return { ok: true };
    } catch (e) { return fail(data.id, e); }
  });

export const reviseGame = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ id: z.string().uuid(), message: z.string().trim().min(1).max(2000) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: game } = await db.from("games").select("prompt, code, status").eq("id", data.id).single();
    if (!game?.code || game.status !== "ready") return { error: "游戏尚未生成完成，暂时无法修改。" };
    await db.from("game_messages").insert({ game_id: data.id, role: "user", content: data.message });
    await db.from("games").update({ status: "revising" }).eq("id", data.id);
    try {
      const { aiText, extractHtml } = await import("./games.server");
      const text = await aiText(`你是资深 HTML5 游戏开发者。根据修改要求更新现有游戏，保留未提及的部分与图片 URL。${codeRules}`,
        `原始需求：${game.prompt}\n\n修改要求：${data.message}\n\n当前代码：\n${game.code}`);
      await db.from("games").update({ code: extractHtml(text), status: "ready", error: null, updated_at: new Date().toISOString() }).eq("id", data.id);
      await db.from("game_messages").insert({ game_id: data.id, role: "assistant", content: "已按要求更新游戏，Game 中可直接试玩新版本。" });
      return { ok: true };
    } catch (e) {
      const { friendlyError } = await import("./games.server");
      console.error(e);
      const msg = friendlyError(e);
      await db.from("games").update({ status: "ready", error: msg }).eq("id", data.id);
      await db.from("game_messages").insert({ game_id: data.id, role: "assistant", content: `修改失败：${msg}` });
      return { error: msg };
    }
  });

export const retryGame = createServerFn({ method: "POST" })
  .inputValidator((d) => idInput.parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: game } = await db.from("games").select("design, code").eq("id", data.id).single();
    if (!game) return { ok: false };
    const { count } = await db.from("game_assets").select("id", { count: "exact", head: true }).eq("game_id", data.id);
    const planned = (game.design as GameDesign | null)?.assets.length ?? 0;
    const status = game.code ? "ready" : !game.design ? "designing" : (count ?? 0) < planned ? "assets" : "coding";
    await db.from("games").update({ status, error: null }).eq("id", data.id);
    return { ok: true };
  });
