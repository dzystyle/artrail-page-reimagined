import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { WorkDetail } from "@/components/work-detail";
import { findWork, works } from "@/lib/works";

describe("Featured work detail", () => {
  afterEach(cleanup);

  it("shows the 制作这款游戏 button next to 去使用", () => {
    const work = findWork("jianbao-character-sheet")!;
    render(<WorkDetail work={work} onBack={() => {}} />);
    expect(screen.getByRole("button", { name: "制作这款游戏" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "去使用" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: work.title })).toBeInTheDocument();
    expect(screen.getByText(`共 ${work.resources} 个资源`)).toBeInTheDocument();
  });

  it("switches the preview when a thumbnail is clicked", () => {
    const work = findWork("sakura-dusk-street")!;
    render(<WorkDetail work={work} onBack={() => {}} />);
    expect(screen.getByRole("img", { name: `${work.title} 预览图 1` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "查看第 3 张" }));
    expect(screen.getByRole("img", { name: `${work.title} 预览图 3` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "下一张" }));
    expect(screen.getByRole("img", { name: `${work.title} 预览图 4` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "上一张" }));
    expect(screen.getByRole("img", { name: `${work.title} 预览图 3` })).toBeInTheDocument();
  });

  it("calls onBack from the back and close buttons", () => {
    const work = findWork("pirate-captain-sheet")!;
    let back = 0;
    render(<WorkDetail work={work} onBack={() => { back += 1; }} />);
    fireEvent.click(screen.getByRole("button", { name: "返回" }));
    fireEvent.click(screen.getByRole("button", { name: "关闭" }));
    expect(back).toBe(2);
  });

  it("calls onMake when 制作这款游戏 is clicked", () => {
    const work = findWork("fps-icon-pack")!;
    let made = 0;
    render(<WorkDetail work={work} onBack={() => {}} onMake={() => { made += 1; }} />);
    fireEvent.click(screen.getByRole("button", { name: "制作这款游戏" }));
    expect(made).toBe(1);
  });

  it("gives every work a unique id, tags and preview images", () => {
    expect(new Set(works.map((w) => w.id)).size).toBe(works.length);
    for (const w of works) {
      expect(w.tags.length).toBeGreaterThan(0);
      expect(w.images.length).toBeGreaterThan(1);
    }
  });
});
