import { describe, expect, it } from "vitest";
import { getMediaWorkspaceDraft, setMediaWorkspaceDraft, validateMediaWorkspaceSearch } from "@/lib/media-workspace";

describe("media workspace entry", () => {
  it("retains prompt and media mode on direct entry", () => {
    expect(validateMediaWorkspaceSearch({ prompt: "制作游戏买量视频", mode: "video" })).toEqual({ prompt: "制作游戏买量视频", mode: "video" });
    expect(validateMediaWorkspaceSearch({ prompt: "游戏音效", mode: "audio" })).toEqual({ prompt: "游戏音效", mode: "audio" });
    expect(validateMediaWorkspaceSearch({ mode: "invalid", prompt: 5 })).toEqual({ prompt: "", mode: "video" });
  });
  it("does not attach a different session's material to an unrelated prompt", () => {
    const draft = { text: "游戏宣传图", mode: "image" as const, skill: null, files: [] };
    setMediaWorkspaceDraft(draft);
    expect(getMediaWorkspaceDraft("游戏宣传图")).toBe(draft);
    expect(getMediaWorkspaceDraft("游戏音效")).toBeNull();
  });
});