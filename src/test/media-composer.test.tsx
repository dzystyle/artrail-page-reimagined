import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MediaComposer } from "@/components/media-composer";
import { mediaModes, referenceMediaRate } from "@/lib/media-composer";

const skills = [{ name: "短片叙事模板", image: "/preview.jpg", category: "视频制作" }];
describe("Media composer", () => {
  afterEach(cleanup);
  it("provides the four reference modes", () => {
    expect(mediaModes.map(item => item.id)).toEqual(["agent", "video", "image", "audio"]);
  });
  it("keeps reference credits at 60 per second with previous rate 90", () => {
    expect(referenceMediaRate).toEqual({ current: 60, previous: 90 });
  });
  it("switches modes and resets the available media model", () => {
    render(<MediaComposer skills={skills} skill={null} onSkillChange={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "选择生成模式" }));
    fireEvent.click(screen.getByRole("button", { name: /图片生成/ }));
    fireEvent.click(screen.getByRole("button", { name: "选择媒体模型" }));
    expect(screen.getByRole("button", { name: "Seedream 5.0" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: "Seedance 2.5" })).not.toBeInTheDocument();
  });
  it("selects a Skill from the composer menu", () => {
    const onSkillChange = vi.fn();
    render(<MediaComposer skills={skills} skill={null} onSkillChange={onSkillChange} />);
    fireEvent.click(screen.getByRole("button", { name: "选择 Skill" }));
    fireEvent.click(screen.getByRole("button", { name: "短片叙事模板" }));
    expect(onSkillChange).toHaveBeenCalledWith(skills[0]);
  });
  it("preserves the draft without implying generation", () => {
    render(<MediaComposer skills={skills} skill={null} onSkillChange={vi.fn()} />);
    fireEvent.change(screen.getByRole("textbox", { name: "创作描述" }), { target: { value: "猫咪短片" } });
    fireEvent.click(screen.getByRole("button", { name: "发送创作内容" }));
    expect(screen.getByRole("textbox", { name: "创作描述" })).toHaveValue("猫咪短片");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
  it("passes the actual prompt and selected mode into the workspace", () => {
    const onSubmit = vi.fn();
    render(<MediaComposer skills={skills} skill={skills[0] ?? null} onSkillChange={vi.fn()} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "选择生成模式" }));
    fireEvent.click(screen.getByRole("button", { name: /图片生成/ }));
    fireEvent.change(screen.getByRole("textbox", { name: "创作描述" }), { target: { value: "  游戏宣传海报  " } });
    fireEvent.click(screen.getByRole("button", { name: "发送创作内容" }));
    expect(onSubmit).toHaveBeenCalledWith({ text: "游戏宣传海报", mode: "image", skill: skills[0], files: [] });
  });
});