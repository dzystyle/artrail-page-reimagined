import { describe, expect, it } from "vitest";
import { gameGenerationModel, matchingCreationModels } from "@/lib/creation-models";

describe("Creation model catalogue", () => {
  it("places Laya IdeaAPI before language models", () => {
    expect(matchingCreationModels("")[0]).toBe("Laya IdeaAPI");
  });

  it("finds Laya by name and game-generation purpose", () => {
    expect(matchingCreationModels("  LAYA ")).toEqual(["Laya IdeaAPI"]);
    expect(matchingCreationModels("游戏")).toEqual(["Laya IdeaAPI"]);
  });

  it("does not represent Laya as a connected service", () => {
    expect(gameGenerationModel.connected).toBe(false);
  });
});