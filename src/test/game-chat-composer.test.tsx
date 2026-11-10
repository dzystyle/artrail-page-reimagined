import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GameChatComposer } from "@/components/game-chat-composer";

describe("Workspace Chat composer", () => {
  afterEach(cleanup);
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