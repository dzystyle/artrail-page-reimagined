import { describe, expect, it } from "vitest";
import { addCanvasReference } from "./canvas-references";
describe("canvas references", () => {
  it("retains the clicked element data", () => {
    const reference = { id: "hero", name: "主角", kind: "角色", url: "data:image/png;base64,YQ==" };
    expect(addCanvasReference([], reference)).toEqual([reference]);
  });
  it("deduplicates repeated clicks and updates the reference", () => {
    expect(addCanvasReference([{ id: "hero", name: "旧主角", kind: "角色" }], { id: "hero", name: "新主角", kind: "角色" })).toEqual([{ id: "hero", name: "新主角", kind: "角色" }]);
  });
  it("supports multiple independent elements", () => {
    expect(addCanvasReference([{ id: "hero", name: "主角", kind: "角色" }], { id: "doc", name: "玩法", kind: "文档", content: "跳跃" })).toHaveLength(2);
  });
});
