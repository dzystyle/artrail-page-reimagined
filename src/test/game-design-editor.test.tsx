import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GameDesignEditor } from "@/components/game-design-editor";
import type { GameDesign } from "@/lib/game-pipeline";

const design: GameDesign = { title: "森林游戏", summary: "收集蘑菇", sections: [{ heading: "玩法", body: "方向键移动" }], assets: [{ name: "蘑菇", kind: "道具", prompt: "红蘑菇" }] };
afterEach(cleanup);
describe("design editing", () => {
  it("saves changed document fields without modifying the asset plan or source design", async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    render(<GameDesignEditor design={design} onSave={save} onClose={() => {}} />);
    fireEvent.change(screen.getByRole("textbox", { name: "设计文档标题" }), { target: { value: "蘑菇冒险" } });
    fireEvent.click(screen.getByRole("button", { name: "1.玩法" }));
    fireEvent.change(screen.getByRole("textbox", { name: "章节内容" }), { target: { value: "点击移动" } });
    fireEvent.click(screen.getByRole("button", { name: "保存修改" }));
    await waitFor(() => expect(save).toHaveBeenCalledWith({ ...design, title: "蘑菇冒险", sections: [{ heading: "玩法", body: "点击移动" }] }));
    expect(design.sections[0]?.body).toBe("方向键移动");
  });
  it("discards unsaved changes without saving", () => {
    const save = vi.fn(), close = vi.fn();
    render(<GameDesignEditor design={design} onSave={save} onClose={close} />);
    fireEvent.change(screen.getByRole("textbox", { name: "设计文档标题" }), { target: { value: "未保存修改" } });
    fireEvent.click(screen.getByRole("button", { name: "取消" }));
    expect(close).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "放弃修改" }));
    expect(close).toHaveBeenCalledOnce();
    expect(save).not.toHaveBeenCalled();
  });
});