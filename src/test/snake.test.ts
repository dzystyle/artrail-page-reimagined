import { describe, expect, it } from "vitest";
import { formatScore, step, turn } from "@/lib/snake";

describe("snake", () => {
  it("moves and keeps length", () => {
    expect(step([{ x: 2, y: 2 }, { x: 1, y: 2 }], "right", 10, 10, false)).toEqual([{ x: 3, y: 2 }, { x: 2, y: 2 }]);
  });
  it("grows when eating", () => {
    expect(step([{ x: 2, y: 2 }], "down", 10, 10, true)).toHaveLength(2);
  });
  it("dies on wall", () => {
    expect(step([{ x: 9, y: 0 }], "right", 10, 10, false)).toBeNull();
  });
  it("cannot reverse", () => {
    expect(turn("right", "left")).toBe("right");
  });
  it("formats score like 0070", () => {
    expect(formatScore(70)).toBe("0070");
  });
});
