import { describe, expect, it } from "vitest";
import { mergeCanvasAssets, storedCanvasNodes, type CanvasNode } from "@/lib/canvas-nodes";

describe("canvas data", () => {
  it("preserves freely moved asset positions during asset refresh", () => {
    const moved: CanvasNode = { id: "a", type: "image", position: { x: -125, y: 730 }, data: { name: "asset", kind: "角色", url: "/image" } };
    expect(mergeCanvasAssets([moved], [{ id: "a", name: "asset", kind: "角色", url: "/image" }], false)).toEqual([moved]);
  });
  it("stores document content and coordinates without event handlers", () => {
    const node: CanvasNode = { id: "doc", type: "document", position: { x: 280, y: -80 }, data: { name: "玩法", kind: "文档", content: "# 核心玩法", onEdit: () => {} } };
    expect(storedCanvasNodes([node])[0]).toEqual({ id: "doc", type: "document", selected: false, position: { x: 280, y: -80 }, data: { name: "玩法", kind: "文档", content: "# 核心玩法" } });
  });
});