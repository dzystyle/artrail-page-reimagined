import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GameChatComposer } from "@/components/game-chat-composer";

vi.mock("@tanstack/react-router", () => ({ Link: ({ children, to, params, search, ...props }: any) => <a href={`${to.replace("$projectId", params.projectId)}?view=${search.view}`} {...props}>{children}</a> }));

describe("Workspace Chat composer", () => {
  afterEach(cleanup);
  it("includes the selected Skill in the revision request", () => {
    const onSubmit = vi.fn();
    render(<GameChatComposer ready project="ArTrail" onProjectChange={vi.fn()} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "选择 Skill" }));
    fireEvent.click(screen.getByRole("button", { name: "【G001】平台跳跃模板" }));
    fireEvent.change(screen.getByRole("textbox", { name: "游戏修改需求" }), { target: { value: "增加二段跳" } });
    fireEvent.click(screen.getByRole("button", { name: "发送修改需求" }));
    expect(onSubmit).toHaveBeenCalledWith("使用 【G001】平台跳跃模板：增加二段跳");
  });
  it("removes a selected Skill without losing the draft", () => {
    const onSubmit = vi.fn();
    render(<GameChatComposer ready project="ArTrail" onProjectChange={vi.fn()} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByRole("textbox", { name: "游戏修改需求" }), { target: { value: "增加二段跳" } });
    fireEvent.click(screen.getByRole("button", { name: "选择 Skill" }));
    fireEvent.click(screen.getByRole("button", { name: "【G001】平台跳跃模板" }));
    fireEvent.click(screen.getByRole("button", { name: "移除 【G001】平台跳跃模板" }));
    fireEvent.click(screen.getByRole("button", { name: "发送修改需求" }));
    expect(onSubmit).toHaveBeenCalledWith("增加二段跳");
  });
  it("selects a project from filtered catalogue results", () => {
    const onProjectChange = vi.fn();
    render(<GameChatComposer ready project="ArTrail" onProjectChange={onProjectChange} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "选择项目" }));
    fireEvent.change(screen.getByRole("textbox", { name: "搜索项目" }), { target: { value: "F3" } });
    fireEvent.click(screen.getByRole("button", { name: "F3/FX" }));
    expect(onProjectChange).toHaveBeenCalledWith("F3/FX");
  });
  it("opens management with links to the selected project's existing views", () => {
    render(<GameChatComposer ready project="ArTrail" onProjectChange={vi.fn()} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "选择项目" }));
    fireEvent.click(screen.getByRole("button", { name: "项目管理" }));
    expect(screen.getByRole("link", { name: "查看 ArTrail 画布" })).toHaveAttribute("href", "/projects/artrail?view=");
    expect(screen.getByRole("link", { name: "查看 ArTrail 资产" })).toHaveAttribute("href", "/projects/artrail?view=assets");
  });
  it("does not submit while the game is unavailable", () => {
    const onSubmit = vi.fn();
    render(<GameChatComposer ready={false} project="ArTrail" onProjectChange={vi.fn()} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByRole("textbox", { name: "游戏修改需求" }), { target: { value: "增加二段跳" } });
    fireEvent.submit(screen.getByRole("form", { name: "Chat 创作输入框" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});