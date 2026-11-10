import type { LevelConfig } from "@/lib/game-pipeline";

export function validLevels(levels: LevelConfig[]) {
  return levels.every(level => level.name.trim() && level.objective.trim() && (!level.timeLimit || (/^\d+$/.test(level.timeLimit) && Number(level.timeLimit) > 0)));
}

export function levelsMarkdown(levels: LevelConfig[]) {
  if (!levels.length) return "";
  const cell = (value: string) => value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
  return `\n\n## 关卡配置表\n\n| 关卡 | 名称 | 通关目标 | 难度 | 时限（秒） | 奖励 |\n| --- | --- | --- | --- | --- | --- |\n${levels.map((level, index) => `| ${index + 1} | ${cell(level.name)} | ${cell(level.objective)} | ${level.difficulty} | ${level.timeLimit || "不限"} | ${cell(level.reward) || "—"} |`).join("\n")}`;
}