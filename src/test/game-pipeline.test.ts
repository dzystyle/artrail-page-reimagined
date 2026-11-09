import { describe, expect, it } from "vitest";
import { nextStep } from "@/lib/game-pipeline";

describe("game generation pipeline", () => {
  it("starts with the design document", () => expect(nextStep("designing", 0, 0)).toEqual({ step: "design" }));
  it("generates the next missing asset", () => expect(nextStep("assets", 2, 4)).toEqual({ step: "asset", index: 2 }));
  it("moves to code once all assets exist", () => expect(nextStep("assets", 4, 4)).toEqual({ step: "code" }));
  it("does nothing when ready or failed", () => { expect(nextStep("ready", 4, 4)).toBeNull(); expect(nextStep("error", 1, 4)).toBeNull(); });
});
