import { describe, expect, it } from "vitest";
import { SHOT_POINTS, shouldStartBreakout } from "@/lib/hero-game";

describe("homepage game progression", () => {
  it("does not advance below the requested 100 points", () => {
    expect(shouldStartBreakout(90)).toBe(false);
    expect(shouldStartBreakout(99)).toBe(false);
  });
  it("automatically advances at exactly 100 points", () => {
    expect(shouldStartBreakout(100)).toBe(true);
  });
  it("awards ten points per cannon hit", () => {
    expect(SHOT_POINTS * 10).toBe(100);
  });
});