import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HomeComposer } from "@/components/home-composer";

describe("Homepage composer", () => {
  afterEach(cleanup);

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

  it("removes uploaded attachments and resets the draft", () => {
    render(<HomeComposer />);
    fireEvent.change(screen.getByLabelText("添加附件", { selector: "input" }), { target: { files: [new File(["abc"], "story.txt", { type: "text/plain" })] } });
    fireEvent.click(screen.getByRole("button", { name: "移除 story.txt" }));
    expect(screen.queryByRole("button", { name: "移除 story.txt" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "创作描述" }), { target: { value: "森林冒险" } });
    fireEvent.click(screen.getByRole("button", { name: "空白项目" }));
    expect(screen.getByRole("textbox", { name: "创作描述" })).toHaveValue("");
  });
});