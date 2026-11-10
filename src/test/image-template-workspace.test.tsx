import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { imageTemplates } from "@/lib/image-templates";
import { ImageTemplateWorkspace } from "@/components/image-template-workspace";

const canvasRender = vi.hoisted(() => vi.fn());
vi.mock("@/components/image-template-canvas", () => ({
  ImageTemplateCanvas: (props: unknown) => { canvasRender(props); return null; },
}));

describe("Recent material canvas editing", () => {
  afterEach(() => { cleanup(); canvasRender.mockClear(); });
  it("closes preview, activates canvas and passes the exact selected material", () => {
    const template = imageTemplates.find(item => item.id === "style");
    const recent = imageTemplates[1];
    if (!template || !recent) throw new Error("Missing example material");
    render(<ImageTemplateWorkspace initialTemplate={template} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: `查看 ${recent.title}` }));
    fireEvent.click(screen.getByRole("button", { name: "去画布编辑" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "画布", hidden: true })).toHaveAttribute("aria-pressed", "true");
    expect(canvasRender).toHaveBeenLastCalledWith(expect.objectContaining({
      editingImage: expect.objectContaining({ id: recent.id, image: recent.image, title: recent.title }),
    }));
  });
});