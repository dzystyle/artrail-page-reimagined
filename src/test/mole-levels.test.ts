import { describe, expect, it } from "vitest";
import { moleGameId, moleLevels, withMoleLevels } from "@/lib/mole-levels";
import type { GameDesign } from "@/lib/game-pipeline";

const design: GameDesign = { title: "地鼠出没", summary: "打地鼠", sections: [], assets: [] };
describe("requested mole game configuration", () => {
  it("provides exactly ten levels for the requested game", () => {
    expect(withMoleLevels(moleGameId, design)?.levels).toHaveLength(10);
    expect(moleLevels[0]?.name).toBe("初识菜园");
    expect(moleLevels[9]?.name).toBe("菜园守护者");
  });
  it("preserves saved edits including an intentionally empty table", () => {
    const saved = { ...design, levels: [] };
    expect(withMoleLevels(moleGameId, saved)).toBe(saved);
    expect(withMoleLevels("another-game", design)).toBe(design);
  });
});