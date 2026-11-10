import { describe, expect, it } from "vitest";
import { levelsMarkdown, validLevels } from "@/lib/game-levels";
import type { LevelConfig } from "@/lib/game-pipeline";

const level: LevelConfig = { id: "one", name: "入口", objective: "收集10个蘑菇", difficulty: "普通", timeLimit: "60", reward: "100金币" };
describe("level configuration", () => {
  it("accepts legacy documents and optional time limits", () => {
    expect(validLevels([])).toBe(true);
    expect(validLevels([{ ...level, timeLimit: "" }])).toBe(true);
    expect(levelsMarkdown([])).toBe("");
  });
  it("rejects missing required values and invalid seconds", () => {
    expect(validLevels([{ ...level, name: " " }])).toBe(false);
    expect(validLevels([{ ...level, objective: "" }])).toBe(false);
    for (const timeLimit of ["0", "-1", "1.5", "abc"]) expect(validLevels([{ ...level, timeLimit }])).toBe(false);
  });
  it("includes the saved level values in the exported document", () => {
    expect(levelsMarkdown([level])).toContain("| 1 | 入口 | 收集10个蘑菇 | 普通 | 60 | 100金币 |");
    expect(levelsMarkdown([{ ...level, name: "A|B", reward: "行1\n行2" }])).toContain("A\\|B");
    expect(levelsMarkdown([{ ...level, reward: "行1\n行2" }])).toContain("行1<br>行2");
  });
});