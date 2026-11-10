import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomeComposer } from "@/components/home-composer";

describe("Homepage composer", () => {
  afterEach(cleanup);

  it("submits Laya IdeaAPI as a game creation type without changing the model", async () => {
    const onCreate = vi.fn();
    render(<HomeComposer gameOnly onCreate={onCreate} />);
    fireEvent.click(screen.getByRole("button", { name: "选择创作类型" }));
    fireEvent.click(await screen.findByRole("button", { name: "Laya IdeaAPI 创作类型" }));
    fireEvent.change(screen.getByRole("textbox", { name: "创作描述" }), { target: { value: "制作一个打地鼠游戏" } });
    fireEvent.click(screen.getByRole("button", { name: "发送创作内容" }));
    expect(onCreate).toHaveBeenCalledWith({ prompt: "制作一个打地鼠游戏", type: "Laya IdeaAPI", project: "ArTrail", model: "deepseek-v4-pro", depth: "High" });
  });

  it("submits the entered game request and selected project", () => {
    const onCreate = vi.fn();
    render(<HomeComposer initialType="Web Game" onCreate={onCreate} />);
    fireEvent.change(screen.getByRole("textbox", { name: "创作描述" }), { target: { value: "制作一个跳跃游戏" } });
    fireEvent.click(screen.getByRole("button", { name: "发送创作内容" }));
    expect(onCreate).toHaveBeenCalledWith({ prompt: "制作一个跳跃游戏", type: "Web Game", project: "ArTrail", model: "deepseek-v4-pro", depth: "High" });
  });

  it("offers media generation types on the homepage menu instead of engine types", async () => {
    render(<HomeComposer />);
    fireEvent.click(screen.getByRole("button", { name: "选择创作类型" }));
    expect(await screen.findByRole("button", { name: /图片生成/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /视频生成/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /音频生成/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Laya IdeaAPI 创作类型" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Godot/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /General Game/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /TapTap Maker game/ })).not.toBeInTheDocument();
  });

  it("submits the selected media generation type", async () => {
    const onCreate = vi.fn();
    render(<HomeComposer onCreate={onCreate} />);
    fireEvent.click(screen.getByRole("button", { name: "选择创作类型" }));
    fireEvent.click(await screen.findByRole("button", { name: /图片生成/ }));
    fireEvent.change(screen.getByRole("textbox", { name: "创作描述" }), { target: { value: "一张雨天城市的宣传图" } });
    fireEvent.click(screen.getByRole("button", { name: "发送创作内容" }));
    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ type: "图片生成", prompt: "一张雨天城市的宣传图" }));
  });

  it("keeps engine types and hides media types in the game-only menu", async () => {
    render(<HomeComposer gameOnly initialType="Web Game" />);
    fireEvent.click(screen.getByRole("button", { name: "选择创作类型" }));
    expect(await screen.findByRole("button", { name: "Laya IdeaAPI 创作类型" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Godot/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /图片生成/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /音频生成/ })).not.toBeInTheDocument();
  });

  it("limits Build requests to game types even when given a non-game default", async () => {
    const onCreate = vi.fn();
    render(<HomeComposer gameOnly initialType="Asset Canvas" onCreate={onCreate} />);
    fireEvent.click(screen.getByRole("button", { name: "选择创作类型" }));
    expect(screen.queryByRole("button", { name: /Interactive Story/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Asset Canvas/ })).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole("button", { name: /Godot/ }));
    fireEvent.change(screen.getByRole("textbox", { name: "创作描述" }), { target: { value: "制作一个跳跃游戏" } });
    fireEvent.click(screen.getByRole("button", { name: "发送创作内容" }));
    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ type: "Godot", prompt: "制作一个跳跃游戏" }));
  });

  it("changes creation type and model independently", async () => {
    render(<HomeComposer />);
    fireEvent.click(screen.getByRole("button", { name: "选择创作类型" }));
    fireEvent.click(await screen.findByRole("button", { name: /Interactive Story/ }));
    expect(screen.getByRole("button", { name: "选择创作类型" })).toHaveTextContent("Interactive Story");
    fireEvent.click(screen.getByRole("button", { name: "选择创作模型" }));
    fireEvent.change(screen.getByRole("textbox", { name: "搜索模型" }), { target: { value: "luna" } });
    expect(screen.queryByRole("button", { name: "deepseek-flash" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "gpt-5.6-luna" }));
    expect(screen.getByRole("button", { name: "选择创作模型" })).toHaveTextContent("gpt-5.6-luna");
    expect(screen.getByRole("button", { name: "选择创作类型" })).toHaveTextContent("Interactive Story");
  });

  it("updates thinking depth while preserving the selected model", async () => {
    render(<HomeComposer />);
    fireEvent.click(screen.getByRole("button", { name: "选择创作模型" }));
    fireEvent.click(await screen.findByRole("button", { name: /Thinking depth/ }));
    fireEvent.click(screen.getByRole("button", { name: "Low" }));
    expect(screen.getByRole("button", { name: "选择创作模型" })).toHaveTextContent("deepseek-v4-pro");
    expect(screen.getByRole("button", { name: "选择创作模型" })).toHaveTextContent("Low");
  });

  it("switches the project from the project menu", () => {
    render(<HomeComposer />);
    expect(screen.getByRole("button", { name: "选择项目" })).toHaveTextContent("项目：ArTrail");
    fireEvent.click(screen.getByRole("button", { name: "选择项目" }));
    fireEvent.click(screen.getByRole("button", { name: "F3/FX" }));
    expect(screen.getByRole("button", { name: "选择项目" })).toHaveTextContent("项目：F3/FX");
    expect(screen.queryByRole("button", { name: "空白项目" })).not.toBeInTheDocument();
  });

  it("selects a Skill from the menu and prefixes it into the submitted prompt", async () => {
    const onCreate = vi.fn();
    render(<HomeComposer initialType="Web Game" onCreate={onCreate} />);
    fireEvent.click(screen.getByRole("button", { name: "选择 Skill" }));
    fireEvent.click(await screen.findByRole("button", { name: /【G001】平台跳跃模板/ }));
    expect(screen.getByRole("button", { name: "移除 【G001】平台跳跃模板" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "创作描述" }), { target: { value: "森林主题" } });
    fireEvent.click(screen.getByRole("button", { name: "发送创作内容" }));
    expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({ prompt: "使用 【G001】平台跳跃模板：森林主题" }));
  });

  it("removes the selected Skill chip", async () => {
    render(<HomeComposer initialType="Web Game" />);
    fireEvent.click(screen.getByRole("button", { name: "选择 Skill" }));
    fireEvent.click(await screen.findByRole("button", { name: /【G002】俯视角射击模板/ }));
    fireEvent.click(screen.getByRole("button", { name: "移除 【G002】俯视角射击模板" }));
    expect(screen.queryByRole("button", { name: "移除 【G002】俯视角射击模板" })).not.toBeInTheDocument();
  });

  it("removes uploaded attachments", () => {
    render(<HomeComposer />);
    fireEvent.change(screen.getByLabelText("添加附件", { selector: "input" }), { target: { files: [new File(["abc"], "story.txt", { type: "text/plain" })] } });
    fireEvent.click(screen.getByRole("button", { name: "移除 story.txt" }));
    expect(screen.queryByRole("button", { name: "移除 story.txt" })).not.toBeInTheDocument();
  });

  it("opens the add menu with the four upload kinds and the asset library", async () => {
    render(<HomeComposer />);
    fireEvent.click(screen.getByRole("button", { name: "添加附件" }));
    expect(await screen.findByRole("button", { name: "图片上传" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "视频上传" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "音频上传" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "文档上传" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "资产库" })).toBeInTheDocument();
  });

  it("filters the file picker by upload kind and opens the asset library", async () => {
    render(<HomeComposer />);
    fireEvent.click(screen.getByRole("button", { name: "添加附件" }));
    fireEvent.click(await screen.findByRole("button", { name: "视频上传" }));
    expect(screen.getByLabelText("添加附件", { selector: "input" })).toHaveAttribute("accept", "video/*");
    fireEvent.click(screen.getByRole("button", { name: "添加附件" }));
    fireEvent.click(await screen.findByRole("button", { name: "资产库" }));
    expect(await screen.findByRole("heading", { name: /所有资产/ })).toBeInTheDocument();
  });
});
describe("Composer docking", () => {
  afterEach(cleanup);
  it("docks to a compact pill when scrolled past, expands on click, collapses on Escape, keeping the draft", () => {
    let cb: IntersectionObserverCallback = () => {};
    (globalThis as any).IntersectionObserver = class { constructor(c: IntersectionObserverCallback) { cb = c; } observe() {} disconnect() {} };
    render(<HomeComposer />);
    fireEvent.change(screen.getByRole("textbox", { name: "创作描述" }), { target: { value: "森林冒险" } });
    act(() => cb([{ isIntersecting: false, intersectionRatio: 0, boundingClientRect: { top: -500 }, rootBounds: { top: 0 } } as any], {} as any));
    const pill = screen.getByRole("button", { name: "展开创作输入框" });
    expect(pill).toHaveTextContent("森林冒险");
    fireEvent.click(pill);
    expect(screen.queryByRole("button", { name: "展开创作输入框" })).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "创作描述" })).toHaveValue("森林冒险");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "展开创作输入框" })).toBeInTheDocument();
  });
});
