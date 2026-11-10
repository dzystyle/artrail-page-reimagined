import { describe, expect, it } from "vitest";
import { isMediaCreation } from "@/lib/creation-types";
import { isGameCreation } from "@/lib/game-workspace";

describe("Creation type routing helpers", () => {
  it("treats the three media types as media, not games", () => {
    expect(["图片生成", "视频生成", "音频生成"].map(isMediaCreation)).toEqual([true, true, true]);
    expect(["图片生成", "视频生成", "音频生成"].map(isGameCreation)).toEqual([false, false, false]);
  });

  it("does not treat existing homepage types as media", () => {
    expect(isMediaCreation("Asset Canvas")).toBe(false);
    expect(isMediaCreation("Interactive Story")).toBe(false);
    expect(isMediaCreation("Web Game")).toBe(false);
  });
});
