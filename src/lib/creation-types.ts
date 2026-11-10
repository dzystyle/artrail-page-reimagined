import { AudioLines, Box, Clapperboard, Gamepad2, Globe, Image, ImagePlus, Video, type LucideIcon } from "lucide-react";

export type CreationType = { name: string; desc: string; icon: LucideIcon };

/** Homepage creation-type menu: entry points plus media generation. */
export const homeCreationTypes: CreationType[] = [
  { name: "Web Game", desc: "在浏览器中运行，支持 HTML5、Phaser 或 Three.js", icon: Globe },
  { name: "Interactive Story", desc: "场景、选择和分支", icon: Clapperboard },
  { name: "Asset Canvas", desc: "在画布上创作图片、视频和 3D 资产", icon: Image },
  { name: "图片生成", desc: "按描述或参考图生成图片资产", icon: ImagePlus },
  { name: "视频生成", desc: "生成玩法短片与投流买量视频", icon: Video },
  { name: "音频生成", desc: "生成背景音乐与音效", icon: AudioLines },
];

/** Build page menu: every entry stays inside the game workspace. */
export const gameCreationTypes: CreationType[] = [
  { name: "Laya IdeaAPI", desc: "专业游戏生成 API · 从玩法创意到游戏创作", icon: Gamepad2 },
  { name: "Web Game", desc: "在浏览器中运行，支持 HTML5、Phaser 或 Three.js", icon: Globe },
  { name: "Godot", desc: "需要在此电脑上安装 Godot 4", icon: Gamepad2 },
  { name: "General Game", desc: "任意引擎，由智能体推荐", icon: Gamepad2 },
  { name: "TapTap Maker game", desc: "使用 UrhoX/Lua 创建 TapTap Maker 项目", icon: Box },
];

const mediaTypes = ["图片生成", "视频生成", "音频生成"];

export function isMediaCreation(type: string) {
  return mediaTypes.includes(type);
}
