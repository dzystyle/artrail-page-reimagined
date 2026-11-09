import { Suspense } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

const { list } = vi.hoisted(() => ({ list: vi.fn() }));
vi.mock("@/lib/games.functions", () => ({ listGames: list }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, search, children, ...props }: { to: string; search: Record<string, string>; children: React.ReactNode }) => <a href={`${to}?${new URLSearchParams(search)}`} {...props}>{children}</a>,
}));
import { SidebarTasks } from "@/components/sidebar-tasks";
import { gameListKey } from "@/lib/game-list";

afterEach(() => { cleanup(); vi.clearAllMocks(); });

function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(<QueryClientProvider client={client}><Suspense><SidebarTasks /></Suspense></QueryClientProvider>);
  return client;
}

describe("Persisted game tasks", () => {
  it("opens the saved game by id, including unfinished games", async () => {
    list.mockResolvedValue([{ id: "saved-game-id", title: "森林蘑菇游戏", status: "assets", updated_at: "2026-11-09" }]);
    const client = mount();
    const link = await screen.findByRole("link", { name: "森林蘑菇游戏" });
    const url = new URL(link.getAttribute("href") ?? "", "http://localhost");
    expect(url.pathname).toBe("/game");
    expect(url.searchParams.get("id")).toBe("saved-game-id");
    client.clear();
  });

  it("reads a newly saved game after the shared list is invalidated", async () => {
    list.mockResolvedValue([]);
    const client = mount();
    await waitFor(() => expect(list).toHaveBeenCalledTimes(1));
    list.mockResolvedValue([{ id: "new-game-id", title: "新建太空游戏", status: "ready", updated_at: "2026-11-09" }]);
    await client.invalidateQueries({ queryKey: gameListKey });
    const link = await screen.findByRole("link", { name: "新建太空游戏" });
    expect(new URL(link.getAttribute("href") ?? "", "http://localhost").searchParams.get("id")).toBe("new-game-id");
    client.clear();
  });
});