import { describe, expect, it } from "vitest";
import { parseCreationMode, worksForMode } from "@/lib/creation-mode";
const works = [{ name: "电路工匠", type: "网页游戏" }, { name: "末班车", type: "互动故事" }];
describe("Creation entry content", () => {
  it("excludes stories from build", () => {
    expect(worksForMode(works, "build")).toEqual([{ name: "电路工匠", type: "网页游戏" }]);
  });
  it("shows only stories in story mode", () => {
    expect(worksForMode(works, "story")).toEqual([{ name: "末班车", type: "互动故事" }]);
  });
  it("defaults to build", () => { expect(parseCreationMode(undefined)).toBe("build"); });
});