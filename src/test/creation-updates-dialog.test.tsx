import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CreationUpdatesDialog } from "@/components/creation-updates-dialog";

vi.mock("@tanstack/react-router", () => ({ Link: ({ children, to, search, ...props }: { children: React.ReactNode; to: string; search: { mode: string } }) => <a href={`${to}?mode=${search.mode}`} {...props}>{children}</a> }));
afterEach(cleanup);

describe("creation updates automatic display", () => {
  it("links game creation directly to the build page", async () => {
    render(<CreationUpdatesDialog autoOpen />);
    expect(await screen.findByRole("link", { name: "开始构建游戏" })).toHaveAttribute("href", "/build?mode=build");
  });
  it("links interactive story creation directly to the story page", async () => {
    render(<CreationUpdatesDialog autoOpen />);
    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("tab", { name: "互动影游" }));
    expect(screen.getByRole("link", { name: "开始创作影游" })).toHaveAttribute("href", "/build?mode=story");
  });
  it("opens on every homepage mount, even after closing the previous visit", async () => {
    const first = render(<CreationUpdatesDialog autoOpen />);
    expect(await screen.findByRole("dialog")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "关闭创作更新" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    first.unmount();
    render(<CreationUpdatesDialog autoOpen />);
    expect(await screen.findByRole("dialog")).toBeVisible();
  });
  it("keeps other page entries closed until the bell is clicked", () => {
    render(<CreationUpdatesDialog />);
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "查看创作更新" }));
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});