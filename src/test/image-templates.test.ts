import { describe, expect, it } from "vitest";
import { filterImageTemplates } from "@/lib/image-templates";

describe("Image template filters", () => {
  it("returns the full catalogue for all", () => {
    expect(filterImageTemplates("全部").map(item => item.id)).toEqual(["noise", "style", "vfx", "elements", "restyle", "controls", "sprites", "wireframe", "scene", "character"]);
  });
  it("limits character results to character templates", () => {
    expect(filterImageTemplates("角色").map(item => item.id)).toEqual(["noise", "character"]);
    expect(filterImageTemplates("unknown")).toEqual([]);
  });
});