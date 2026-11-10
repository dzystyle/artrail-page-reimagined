import { describe, expect, it } from "vitest";
import { assetPresetPrompt, assetPresets, getAssetPreset, getPixelStyle, pixelStyles } from "@/lib/asset-presets";
describe("asset template workflow", () => {
  it("offers three different pixel densities", () => { expect(pixelStyles.map(style => style.id)).toEqual(["coarse", "classic", "fine"]); expect(new Set(pixelStyles.map(style => style.resolution)).size).toBe(3); });
  it("uses the selected template and pixel style for generation", () => { const prompt = assetPresetPrompt("characters", "coarse", 1, "绿色外套"); expect(prompt).toContain("top-down RPG character"); expect(prompt).toContain("Chunky coarse pixel"); expect(prompt).toContain("绿色外套"); expect(prompt).toContain("Reference image 1"); });
  it("provides different outputs for every template", () => { expect(assetPresets).toHaveLength(8); for (const preset of assetPresets) { expect(new Set(preset.instructions).size).toBe(4); } });
  it("rejects unknown presets and outputs", () => { expect(getAssetPreset("unknown")).toBeUndefined(); expect(getPixelStyle("unknown")).toBeUndefined(); expect(() => assetPresetPrompt("characters", "fine", 8, "")).toThrow(); });
});