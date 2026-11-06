import { describe, expect, it } from "vitest";
import { defaultWorkspaceTab, parseWorkspaceTab, isGameCreation, hasWon, gameTarget } from "@/lib/game-workspace";
describe("Game workspace rules", () => {
  it("starts in Canvas", () => { expect(defaultWorkspaceTab).toBe("canvas"); expect(parseWorkspaceTab(undefined)).toBe("canvas"); });
  it("keeps the Game playtest view on direct links", () => { expect(parseWorkspaceTab("game")).toBe("game"); });
  it("identifies game creation without including interactive story", () => { expect(isGameCreation("Web Game")).toBe(true); expect(isGameCreation("Interactive Story")).toBe(false); });
  it("completes the sample only after all five stars", () => { expect(gameTarget).toBe(5); expect(hasWon(4)).toBe(false); expect(hasWon(5)).toBe(true); });
});