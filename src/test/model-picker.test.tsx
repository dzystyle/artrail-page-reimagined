import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Index } from "@/routes/index";

// The header model picker: which models are offered, which one is active, and what
// choosing "Artrail Flex" opens. Names must stay on the Artrail brand.
describe("Header model picker", () => {
  afterEach(cleanup);

  it("shows Artrail 2.0 Lite as the selected model and never the old brand", () => {
    render(<Index />);

    expect(screen.getByRole("button", { name: /Artrail 2\.0 Lite/ })).toBeInTheDocument();
    expect(screen.queryByText(/manus/i)).toBeNull();
  });

  it("offers the four models with Pro/Beta tags and marks the selected one", async () => {
    render(<Index />);
    fireEvent.click(screen.getByRole("button", { name: /Artrail 2\.0 Lite/ }));

    expect(await screen.findByText("为复杂任务设计的高性能代理。")).toBeInTheDocument();
    expect(screen.getByText("Artrail 2.0 Max", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("Artrail 2.0", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("Artrail 2.0 Lite", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("Artrail Flex", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("多功能代理，能够执行大部分任务。")).toBeInTheDocument();
    expect(screen.getByText("一个适合日常任务的轻量级代理。")).toBeInTheDocument();
    expect(screen.getByText("使用你自己的模型 API 密钥来驱动 Artrail。")).toBeInTheDocument();
    expect(screen.getAllByText("Pro")).toHaveLength(2);
  });

  it("opens the Flex dialog with provider and API key fields, connect disabled until filled", async () => {
    render(<Index />);
    fireEvent.click(screen.getByRole("button", { name: /Artrail 2\.0 Lite/ }));
    fireEvent.click(await screen.findByText("Artrail Flex", { exact: true }));

    expect(await screen.findByText("提供商")).toBeInTheDocument();
    expect(screen.getByText("API 密钥")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("输入您的 API 密钥")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "连接" })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("输入您的 API 密钥"), { target: { value: "sk-test" } });
    expect(screen.getByRole("button", { name: "连接" })).toBeDisabled();
  });
});
