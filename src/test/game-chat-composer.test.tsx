import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GameChatComposer } from "@/components/game-chat-composer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Workspace Chat composer", () => {
  afterEach(cleanup);
  it.each([
    ["图片上传", "image/*"],
    ["视频上传", "video/*"],
    ["音频上传", "audio/*"],
    ["文档上传", ".pdf,.doc,.docx,.txt,.md,.csv,.json"],
  ])("filters %s attachments using the homepage file types", (name, accept) => {
    render(<GameChatComposer ready onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "添加附件" }));
    fireEvent.click(screen.getByRole("button", { name }));
    expect(screen.getByLabelText("添加附件", { selector: "input" })).toHaveAttribute("accept", accept);
  });
  it("removes a local attachment without losing the revision draft", () => {
    const submit = vi.fn();
    render(<GameChatComposer ready onSubmit={submit} />);
    fireEvent.change(screen.getByRole("textbox", { name: "游戏修改需求" }), { target: { value: "增加二段跳" } });
    fireEvent.change(screen.getByLabelText("添加附件", { selector: "input" }), { target: { files: [new File(["reference"], "reference.png", { type: "image/png" })] } });
    fireEvent.click(screen.getByRole("button", { name: "移除 reference.png" }));
    fireEvent.click(screen.getByRole("button", { name: "发送修改需求" }));
    expect(submit).toHaveBeenCalledWith("增加二段跳");
  });
  it("selects an independent library attachment without changing the revision text", () => {
    const client = new QueryClient();
    client.setQueryData(["asset-library"], [{ id: "test-asset", name: "蘑菇", url: "/mushroom.png", kind: "道具", gameId: "test-game", project: "森林游戏", createdAt: new Date().toISOString(), source: "cloud" }]);
    const submit = vi.fn();
    render(<QueryClientProvider client={client}><GameChatComposer ready onSubmit={submit} /></QueryClientProvider>);
    fireEvent.click(screen.getByRole("button", { name: "添加附件" }));
    fireEvent.click(screen.getByRole("button", { name: "资产库" }));
    fireEvent.click(screen.getByRole("button", { name: /蘑菇/ }));
    fireEvent.click(screen.getByRole("button", { name: "添加到输入框 (1)" }));
    fireEvent.click(screen.getByRole("button", { name: "移除 蘑菇" }));
    fireEvent.change(screen.getByRole("textbox", { name: "游戏修改需求" }), { target: { value: "增加二段跳" } });
    fireEvent.click(screen.getByRole("button", { name: "发送修改需求" }));
    expect(submit).toHaveBeenCalledWith("增加二段跳");
  });
  it("includes the selected Skill in the revision request", () => {
    const onSubmit = vi.fn();
    render(<GameChatComposer ready onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "选择 Skill" }));
    fireEvent.click(screen.getByRole("button", { name: "【G001】平台跳跃模板" }));
    fireEvent.change(screen.getByRole("textbox", { name: "游戏修改需求" }), { target: { value: "增加二段跳" } });
    fireEvent.click(screen.getByRole("button", { name: "发送修改需求" }));
    expect(onSubmit).toHaveBeenCalledWith("使用 【G001】平台跳跃模板：增加二段跳");
  });
  it("removes a selected Skill without losing the draft", () => {
    const onSubmit = vi.fn();
    render(<GameChatComposer ready onSubmit={onSubmit} />);
    fireEvent.change(screen.getByRole("textbox", { name: "游戏修改需求" }), { target: { value: "增加二段跳" } });
    fireEvent.click(screen.getByRole("button", { name: "选择 Skill" }));
    fireEvent.click(screen.getByRole("button", { name: "【G001】平台跳跃模板" }));
    fireEvent.click(screen.getByRole("button", { name: "移除 【G001】平台跳跃模板" }));
    fireEvent.click(screen.getByRole("button", { name: "发送修改需求" }));
    expect(onSubmit).toHaveBeenCalledWith("增加二段跳");
  });
  it("does not submit while the game is unavailable", () => {
    const onSubmit = vi.fn();
    render(<GameChatComposer ready={false} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByRole("textbox", { name: "游戏修改需求" }), { target: { value: "增加二段跳" } });
    fireEvent.submit(screen.getByRole("form", { name: "Chat 创作输入框" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});