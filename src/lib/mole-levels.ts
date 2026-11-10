import type { GameDesign, LevelConfig } from "@/lib/game-pipeline";

export const moleGameId = "3f0810b2-ec5f-4150-9eab-186443719df1";

const stages = [
  ["初识菜园", "命中 10 只地鼠，熟悉九宫格点击操作", "简单", "菜园新手徽章"],
  ["稳准练习", "命中 15 只地鼠，完成一次连续命中 5 次", "简单", "精准入门徽章"],
  ["连击起步", "获得 200 分，完成两次连续命中 5 次", "简单", "连击新星徽章"],
  ["双鼠出击", "获得 260 分；在第二档难度下命中 10 只地鼠", "普通", "双线守卫徽章"],
  ["菜园巡逻", "获得 320 分，累计命中 25 只地鼠", "普通", "菜园巡逻员徽章"],
  ["连击达人", "获得 380 分，完成四次连续命中 5 次", "普通", "连击达人徽章"],
  ["极速反应", "获得 440 分；在第三档难度下命中 10 只地鼠", "困难", "极速反应徽章"],
  ["三线防守", "获得 500 分；在第三档难度下完成两次连续命中 5 次", "困难", "三线防守徽章"],
  ["无失误挑战", "获得 560 分；最后 20 秒不敲空且不漏掉地鼠", "困难", "精准大师徽章"],
  ["菜园守护者", "获得 650 分，完成八次连续命中 5 次", "困难", "菜园守护者称号"],
] as const;

export const moleLevels: LevelConfig[] = stages.map(([name, objective, difficulty, reward], index) => ({
  id: `mole-level-${index + 1}`, name, objective, difficulty, timeLimit: "60", reward,
}));

// This requested configuration belongs only to this game; saved edits always win.
export function withMoleLevels(id: string | undefined, design: GameDesign | undefined): GameDesign | undefined {
  if (!design || id !== moleGameId || design.levels !== undefined) return design;
  return { ...design, levels: moleLevels.map(level => ({ ...level })) };
}