import type { MediaMode, MediaSkill } from "@/lib/media-composer";

export type MediaWorkspaceDraft = { text: string; mode: MediaMode; skill: MediaSkill | null; files: File[] };
let draft: MediaWorkspaceDraft | null = null;
export function setMediaWorkspaceDraft(value: MediaWorkspaceDraft) { draft = value; }
export function getMediaWorkspaceDraft(prompt: string) { return draft?.text === prompt ? draft : null; }
export function validateMediaWorkspaceSearch(search: Record<string, unknown>): { prompt: string; mode: MediaMode } {
  const mode = search["mode"] === "image" || search["mode"] === "audio" || search["mode"] === "agent" ? search["mode"] : "video";
  return { prompt: typeof search["prompt"] === "string" ? search["prompt"].slice(0, 8000) : "", mode };
}
export const mediaBriefFields = [
  { title: "游戏信息", hint: "请输入游戏名称、类型及核心卖点", placeholder: "例如：森林冒险，一款轻松有趣的探索游戏…" },
  { title: "视觉风格", hint: "你希望呈现怎样的画面与氛围？", placeholder: "例如：明亮的像素风，突出角色与玩法…" },
  { title: "规格与用途", hint: "填写画面比例、时长及发布平台", placeholder: "例如：9:16，15 秒，用于游戏投流买量…" },
  { title: "创作补充", hint: "填写文案、音乐或其他需要保留的内容", placeholder: "例如：结尾出现游戏名称，搭配轻快音乐…" },
] as const;