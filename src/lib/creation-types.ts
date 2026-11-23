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

/** Build page type menu: Chinese entries mixing game engines with story and canvas. */
export const buildCreationTypes: CreationType[] = [
  { name: "网页游戏", desc: "浏览器里直接玩，HTML5、Phaser 或 Three.js", icon: Globe },
  { name: "互动故事", desc: "场景、选项和分支", icon: Clapperboard },
  { name: "素材画布", desc: "在画布上做图片、视频和 3D 素材，不做游戏", icon: Image },
  { name: "Godot", desc: "需要本机安装 Godot 4", icon: Gamepad2 },
  { name: "通用游戏", desc: "先不定引擎，让 agent 建议", icon: Gamepad2 },
  { name: "TapTap Maker 游戏", desc: "TapTap Maker 上的 UrhoX/Lua 游戏。在它的面板里登录，并新建或连接 Maker 项目。", icon: Box },
];

const mediaTypes = ["图片生成", "视频生成", "音频生成"];

export function isMediaCreation(type: string) {
  return mediaTypes.includes(type);
}
