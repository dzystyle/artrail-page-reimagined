export type ToolCategory = "全部工具" | "视频与买量" | "文本与出海" | "美术资产" | "音频";
export type ToolboxTool = {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  tags: string[];
  upcoming: boolean;
};

export const toolCategories: ToolCategory[] = ["全部工具", "视频与买量", "文本与出海", "美术资产", "音频"];
export const toolboxTools: ToolboxTool[] = [
  { id: "auto-edit", name: "自动剪辑", category: "视频与买量", description: "从游戏录屏中挑选精彩瞬间，剪出节奏鲜明的玩法短片与买量视频。", tags: ["高光提取", "多比例剪辑", "字幕与节奏"], upcoming: true },
  { id: "localization", name: "游戏文本本地化", category: "文本与出海", description: "让剧情、对白与界面文案跨越语言，保留角色语气与游戏世界观。", tags: ["术语一致", "变量保护", "多语言校对"], upcoming: true },
  { id: "image", name: "游戏宣传图", category: "美术资产", description: "为新版本、活动与商店页面制作吸睛的游戏视觉。", tags: ["商店封面", "活动海报"], upcoming: false },
  { id: "video", name: "游戏买量视频", category: "视频与买量", description: "把玩法创意转化为短片，探索不同风格的推广素材。", tags: ["玩法短片", "视频创作"], upcoming: false },
  { id: "assets", name: "像素资产模板", category: "美术资产", description: "从角色、道具到场景，探索不同像素精度的资产模板。", tags: ["角色精灵", "风格参考"], upcoming: false },
  { id: "audio", name: "游戏音效", category: "音频", description: "为战斗、交互和环境寻找契合游戏氛围的声音灵感。", tags: ["交互音效", "环境氛围"], upcoming: false },
];

export function filterToolboxTools(category: ToolCategory, query: string) {
  const term = query.trim().toLocaleLowerCase();
  return toolboxTools.filter(tool => (category === "全部工具" || tool.category === category) && `${tool.name} ${tool.description} ${tool.tags.join(" ")}`.toLocaleLowerCase().includes(term));
}