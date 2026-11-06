import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

beforeEach(() => { localStorage.clear(); document.documentElement.className = "dark"; });
afterEach(cleanup);
describe("workspace theme", () => {
  it("switches from dark to light and back", () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    fireEvent.click(screen.getByRole("button", { name: "切换到亮色模式" }));
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "切换到暗色模式" }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
  it("restores the chosen light theme on remount", () => {
    const first = render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    fireEvent.click(screen.getByRole("button", { name: "切换到亮色模式" }));
    first.unmount();
    document.documentElement.className = "dark";
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(localStorage.getItem("artrail-theme")).toBe("light");
  });
});