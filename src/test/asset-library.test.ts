import { expect, it } from "vitest";
import { filterLibraryAssets, type LibraryAsset } from "@/lib/asset-library";
const assets: LibraryAsset[] = [{ id: "a", name: "森林", kind: "场景", url: "/a", gameId: "g1", project: "冒险", createdAt: "2026-11-10T00:00:00Z", source: "cloud" }, { id: "b", name: "骑士", kind: "角色", url: "/b", gameId: "g2", project: "战斗", createdAt: "2026-10-01T00:00:00Z", source: "device" }];
const defaults = { search: "", project: "all", kind: "all", source: "all", days: "all", sort: "newest" };
it("filters real library assets by search, project and kind", () => {
  expect(filterLibraryAssets(assets, { ...defaults, search: "冒险", project: "g1", kind: "场景" }).map(asset => asset.id)).toEqual(["a"]);
  expect(filterLibraryAssets(assets, { ...defaults, search: "森林", project: "g2" })).toEqual([]);
});
it("filters source and selected date range", () => {
  expect(filterLibraryAssets(assets, { ...defaults, days: "7" }, Date.parse("2026-11-10T03:00:00Z")).map(asset => asset.id)).toEqual(["a"]);
  expect(filterLibraryAssets(assets, { ...defaults, source: "device" }).map(asset => asset.id)).toEqual(["b"]);
});