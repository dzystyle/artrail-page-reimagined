export type GameStatus = "designing" | "assets" | "coding" | "revising" | "ready" | "error";
export type AssetPlan = { kind: string; name: string; prompt: string };
export type LevelConfig = { id: string; name: string; objective: string; difficulty: "简单" | "普通" | "困难"; timeLimit: string; reward: string };
export type GameDesign = { title: string; summary: string; sections: { heading: string; body: string }[]; assets: AssetPlan[]; levels?: LevelConfig[] };

/** Which step the browser should trigger next for a game, or null when nothing is pending. */
export function nextStep(status: string, assetCount: number, plannedAssets: number): { step: "design" } | { step: "asset"; index: number } | { step: "code" } | null {
  if (status === "designing") return { step: "design" };
  if (status === "assets") return assetCount < plannedAssets ? { step: "asset", index: assetCount } : { step: "code" };
  if (status === "coding") return { step: "code" };
  return null;
}

export const statusLabel: Record<string, string> = {
  designing: "正在撰写设计文档…", assets: "正在生成美术资产…", coding: "正在编写游戏代码…", revising: "正在按你的要求修改…", ready: "游戏已生成，可以试玩", error: "生成出错",
};
