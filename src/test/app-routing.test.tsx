import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("keeps the asset entry and project filter on the same project page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const assets = router.matchRoutes("/projects/new-hope", { view: "assets", q: "戴安娜" }).at(-1);
    expect(assets?.routeId).toBe("/projects/$projectId");
    expect(assets?.search).toEqual({ view: "assets", q: "戴安娜" });
    const filtered = router.matchRoutes("/projects/f3fx", { view: "assets", q: "戴安娜" }).at(-1);
    expect(filtered?.params).toMatchObject({ projectId: "f3fx" });
    expect(filtered?.search).toMatchObject({ view: "assets" });
  });
  it("does not show asset mode for an ordinary project entry", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/projects/artrail", { q: "" }).at(-1)?.search).toMatchObject({ view: "" });
  });
  it("opens the game workspace at /game", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/game").at(-1)?.routeId).toBe("/game");
  });
  it("opens the build page at /build", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/build").at(-1)?.routeId).toBe("/build");
  });
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it("opens a featured work at /works/$workId", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/works/jianbao-character-sheet").at(-1)?.routeId).toBe("/works/$workId");
  });
});
