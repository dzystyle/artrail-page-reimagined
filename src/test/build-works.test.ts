import { describe, expect, it } from "vitest";
import { buildWorks } from "@/lib/build-works";
import { worksForMode } from "@/lib/creation-mode";

const MOCHE =
  "http://10.1.165.88:43120/#/projects/a7f124cd-49d6-4aa7-98e4-659f301d8cf6/conversations/01a1c47c-fabd-773b-9fa3-2c3d4d9b6397";

describe("build works catalogue", () => {
  it("opens 末班车 on the given conversation link", () => {
    expect(buildWorks.find(work => work.name === "末班车")?.url).toBe(MOCHE);
  });

  it("keeps the link on the story-mode card", () => {
    const storyWorks = worksForMode(buildWorks, "story");
    expect(storyWorks.map(work => work.name)).toEqual(["末班车"]);
    expect(storyWorks[0]?.url).toBe(MOCHE);
  });

  it("leaves game cards without an external link", () => {
    for (const work of worksForMode(buildWorks, "build")) {
      expect(work.url).toBeUndefined();
    }
  });
});
