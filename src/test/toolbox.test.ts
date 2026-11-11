import { describe, expect, it } from "vitest";
import { filterToolboxTools, toolboxTools } from "@/lib/toolbox";

describe("toolbox discovery", () => {
  it("shows automatic editing as upcoming", () => {
    expect(toolboxTools.find(tool => tool.id === "auto-edit")?.upcoming).toBe(true);
  });
  it("shows game text localization as upcoming", () => {
    expect(toolboxTools.find(tool => tool.id === "localization")?.upcoming).toBe(true);
  });
  it("combines category and keyword filtering", () => {
    expect(filterToolboxTools("视频与买量", "剪辑").map(tool => tool.id)).toEqual(["auto-edit"]);
    expect(filterToolboxTools("美术资产", "剪辑")).toEqual([]);
    expect(filterToolboxTools("全部工具", " 术语 ").map(tool => tool.id)).toEqual(["localization"]);
  });
});