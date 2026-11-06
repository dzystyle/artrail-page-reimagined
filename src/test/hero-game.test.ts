import { describe, expect, it } from "vitest";
import { HERO_GAMES, SHOT_POINTS, pickHeroGame } from "@/lib/hero-game";

describe("random homepage games", () => {
  it("draws from exactly the three requested games", () => {
    expect(HERO_GAMES).toEqual(["skeet", "brick", "raid"]);
  });
  it("assigns an equal third of the draw range to each game", () => {
    expect([0, 0.32, 1 / 3, 0.66, 2 / 3, 0.99].map(n => pickHeroGame(() => n))).toEqual(["skeet", "skeet", "brick", "brick", "raid", "raid"]);
  });
  it("makes a fresh draw on every entry instead of storing a fixed game", () => {
    let i = 0;
    const values = [0.1, 0.5, 0.9];
    const random = () => values[i++] ?? 0;
    expect([pickHeroGame(random), pickHeroGame(random), pickHeroGame(random)]).toEqual(["skeet", "brick", "raid"]);
  });
  it("awards ten points per cannon hit", () => {
    expect(SHOT_POINTS * 10).toBe(100);
  });
});