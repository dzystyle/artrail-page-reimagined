export const mediaModes = [
  { id: "agent", label: "Agent模式", badge: "分钟级成片" },
  { id: "video", label: "视频生成", badge: "沉浸式短片" },
  { id: "image", label: "图片生成", badge: "" },
  { id: "audio", label: "音频生成", badge: "NEW" },
] as const;
export type MediaMode = typeof mediaModes[number]["id"];
export const mediaModels: Record<MediaMode, string[]> = {
  agent: ["ArTrail 2.0 Lite", "ArTrail 2.0"],
  video: ["Seedance 2.5 Draft", "Seedance 2.5", "Seedance 2.0 Fast VIP", "Seedance 2.0 VIP", "Seedance 2.0 Mini 体验版"],
  image: ["Seedream 5.0", "Seedream 4.5"],
  audio: ["音效", "语音", "音乐"],
};
export const referenceMediaRate = { current: 60, previous: 90 };
export type MediaSkill = { name: string; image: string; category: string };