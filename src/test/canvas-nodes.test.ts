import { describe, expect, it } from "vitest";
import { mergeCanvasAssets, storedCanvasNodes, type CanvasNode } from "@/lib/canvas-nodes";

describe("canvas data", () => {
  it("does not restore deleted elements when game assets refresh", () => {
    const assets = [{ id: "deleted", name: "角色", kind: "角色", url: "/character" }, { id: "keep", name: "背景", kind: "场景", url: "/background" }];
    expect(mergeCanvasAssets([], assets, false, ["deleted"]).map(node => node.id)).toEqual(["keep"]);
    expect(assets.map(asset => asset.id)).toEqual(["deleted", "keep"]);
  });
  it("preserves freely moved asset positions during asset refresh", () => {
    const moved: CanvasNode = { id: "a", type: "image", position: { x: -125, y: 730 }, data: { name: "asset", kind: "角色", url: "/image" } };
    expect(mergeCanvasAssets([moved], [{ id: "a", name: "asset", kind: "角色", url: "/image" }], false)).toEqual([moved]);
  });
  it("stores document content and coordinates without event handlers", () => {
    const node: CanvasNode = { id: "doc", type: "document", position: { x: 280, y: -80 }, data: { name: "玩法", kind: "文档", content: "# 核心玩法", onEdit: () => {} } };
    expect(storedCanvasNodes([node])[0]).toEqual({ id: "doc", type: "document", selected: false, position: { x: 280, y: -80 }, data: { name: "玩法", kind: "文档", content: "# 核心玩法" } });
  });
});