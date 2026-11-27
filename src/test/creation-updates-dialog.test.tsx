import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CreationUpdatesDialog } from "@/components/creation-updates-dialog";

vi.mock("@tanstack/react-router", () => ({ Link: ({ children }: { children: React.ReactNode }) => <span>{children}</span> }));
afterEach(cleanup);

describe("creation updates automatic display", () => {
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