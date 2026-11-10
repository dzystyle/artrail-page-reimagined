export const pixelStyles = [
  { id: "coarse", name: "粗像素", english: "Coarse Pixels", detail: "大颗粒像素，简洁轮廓与色块", instruction: "Chunky coarse pixel art, simple readable silhouettes, a restrained palette of up to 8 colors", resolution: 64 },
  { id: "classic", name: "经典像素", english: "Classic Pixels", detail: "经典像素质感，适量细节与高光", instruction: "Classic medium-density pixel art, crisp pixel edges, a restrained palette of up to 16 colors", resolution: 128 },
  { id: "fine", name: "精细像素", english: "Fine Pixels", detail: "细腻小像素，更丰富的层次与细节", instruction: "Fine detailed pixel art, crisp small pixels, a cohesive palette of up to 48 colors", resolution: 256 },
] as const;
export type PixelStyle = typeof pixelStyles[number]["id"];
export const assetPresets = [
  { id: "characters", name: "人物", desc: "角色设定图、精灵图和头像", outputs: ["角色设定图", "俯视角色", "多角度视图", "半身头像"], instructions: ["A character reference sheet with full body front, side and back views and facial expressions", "One top-down RPG character sprite, entire body visible", "A coherent sprite sheet of the same character from eight viewing angles", "A half-body character portrait for dialogue UI"] },
  { id: "animation", name: "帧动画", desc: "空闲、行走、奔跑、攻击和受伤帧", outputs: ["空闲动画", "行走动画", "攻击动画", "受伤动画"], instructions: ["A 4-frame idle animation sprite sheet", "A 6-frame walk cycle sprite sheet", "A 6-frame attack animation sprite sheet", "A 4-frame damage reaction sprite sheet"] },
  { id: "map", name: "地图", desc: "地形、图块集和建筑物", outputs: ["地形图块", "建筑图块", "装饰图块", "地图场景"], instructions: ["A seamless terrain tile set for a top-down game", "A building tile set consistent with the reference architecture", "A set of environmental decoration tiles", "A complete top-down game map environment"] },
  { id: "items", name: "项目和用户界面", desc: "道具、设备和用户界面图标", outputs: ["道具图标", "装备图标", "界面按钮", "状态图标"], instructions: ["A cohesive sheet of game item icons", "A cohesive sheet of equipment icons", "A game UI button and panel asset sheet, no text", "A set of readable game status effect icons"] },
  { id: "creatures", name: "生物", desc: "怪物和动物", outputs: ["生物设定图", "俯视精灵", "多角度视图", "生物头像"], instructions: ["A creature reference sheet with consistent front side and back views", "One top-down creature sprite", "A sheet of the same creature from eight angles", "A creature portrait icon"] },
  { id: "scenes", name: "场景", desc: "游戏背景和环境", outputs: ["场景全景", "背景远景", "前景元素", "环境变体"], instructions: ["A complete game environment panorama", "A distant game background layer", "A foreground decoration asset sheet", "An alternate lighting version of the reference environment"] },
  { id: "outfits", name: "服装", desc: "给角色换装", outputs: ["服装设定图", "正面换装", "背面换装", "服饰细节"], instructions: ["A costume design sheet preserving the character identity", "A front view of the same character in a new coherent outfit", "A back view of the same outfit", "A sheet of matching outfit accessories"] },
  { id: "effects", name: "效果", desc: "打击、爆发、斩击和轨迹", outputs: ["打击效果", "爆发效果", "斩击效果", "轨迹效果"], instructions: ["A hit impact effect sprite sheet", "An explosion effect sprite sheet", "A slash effect sprite sheet", "A projectile trail effect sprite sheet"] },
] as const;
export function getAssetPreset(id: unknown) { return assetPresets.find(preset => preset.id === id); }
export function getPixelStyle(id: unknown) { return pixelStyles.find(style => style.id === id); }
export function assetPresetPrompt(template: string, density: string, output: number, description: string) {
  const preset = getAssetPreset(template);
  const style = getPixelStyle(density);
  const instruction = preset?.instructions[output];
  if (!preset || !style || !instruction) throw new Error("无效的资产模板。");
  return `Create a production-quality game asset. Reference image 1 is the user's subject reference: preserve its identity, signature colors, silhouette, costume and materials. Adapt only the composition and pixel-art treatment. Output: ${instruction}. Style: ${style.instruction}. Consistent lighting, clean separated elements, no labels, no watermark. User instructions: ${description || "保持参考图中的主体设计。"}`;
}