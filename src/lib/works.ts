import canvas1 from "@/assets/canvas-1.jpg";
import canvas2 from "@/assets/canvas-2.jpg";
import canvas3 from "@/assets/canvas-3.jpg";
import canvas4 from "@/assets/canvas-4.jpg";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";
import work6 from "@/assets/work-6.jpg";
import work7 from "@/assets/work-7.jpg";
import work8 from "@/assets/work-8.jpg";

export type Work = {
  id: string;
  title: string;
  author: string;
  tags: string[];
  description: string;
  skill: { id: string; name: string };
  resources: number;
  images: string[];
};

// Demo catalogue for the featured-works gallery and its detail page.
export const works: Work[] = [
  {
    id: "jianbao-character-sheet",
    title: "鉴宝题材模拟经营角色设定",
    author: "林悦",
    tags: ["角色", "模拟经营", "鉴宝", "国风", "设定图"],
    description:
      "使用模型 GPT Image 2.5 Sunburst 生成鉴宝题材模拟经营游戏的角色设定集，包含掌柜、鉴定师、摊主与藏家等角色的三视图、表情差分和随身道具。",
    skill: { id: "A031", name: "【A031】【角色设定】国风经营角色三视图" },
    resources: 12,
    images: [work1, work3, work5, work8, work2],
  },
  {
    id: "restaurant-building-icons",
    title: "【模拟经营】餐厅建筑图标",
    author: "郭凌",
    tags: ["图标", "模拟经营", "建筑", "扁平", "餐厅"],
    description:
      "使用模型 GPT Image 2.5 Sunburst 生成餐厅经营类建筑图标集，覆盖前厅、厨房、仓库与外摆区等功能建筑，统一 128px 网格与描边粗细。",
    skill: { id: "B102", name: "【B102】【建筑图标】模拟经营建筑集" },
    resources: 24,
    images: [work2, work4, work7, work6, work1],
  },
  {
    id: "toy-style-characters",
    title: "Q版扁平玩具风角色",
    author: "宋扬",
    tags: ["角色", "Q版", "扁平", "玩具风"],
    description:
      "使用模型 Gemini Image 生成 Q 版扁平玩具风角色包，含 8 个基础姿势与 6 组可替换配件，可直接用作休闲游戏主角。",
    skill: { id: "A012", name: "【A012】【角色包】Q版扁平玩具风" },
    resources: 14,
    images: [work3, work1, work5, work2, work8],
  },
  {
    id: "medieval-rpg-icons",
    title: "西式中世纪冒险RPG游戏图标",
    author: "杨宇轩",
    tags: ["图标", "RPG", "中世纪", "冒险"],
    description:
      "使用模型 GPT Image 2.5 Sunburst 生成西式中世纪冒险 RPG 的道具与技能图标，包含武器、护甲、药水与卷轴四组，统一斜 45 度光源。",
    skill: { id: "B077", name: "【B077】【图标】中世纪冒险道具" },
    resources: 32,
    images: [work4, work2, work7, work6, work3],
  },
  {
    id: "fantasy-character-pack",
    title: "中世纪奇幻 · 风格化卡通角色设定包",
    author: "雷嘉玲",
    tags: ["角色", "奇幻", "卡通", "设定包"],
    description:
      "使用模型 GPT Image 2.5 Sunburst 生成中世纪奇幻风格化卡通角色设定包，含职业立绘、头像与状态表情，适配横版冒险玩法。",
    skill: { id: "A066", name: "【A066】【设定包】风格化卡通角色" },
    resources: 18,
    images: [work5, work3, work1, work8, work4],
  },
  {
    id: "sakura-dusk-street",
    title: "樱花黄昏街道场景",
    author: "朱玉儿",
    tags: ["场景", "黄昏", "街道", "二次元"],
    description:
      "使用模型 Gemini Image 生成樱花黄昏街道场景概念图，含远景、中景与近景三层视差素材，可用作剧情关卡背景。",
    skill: { id: "C023", name: "【C023】【场景】日系街道氛围" },
    resources: 9,
    images: [work6, work4, work2, work7, work5],
  },
  {
    id: "fps-icon-pack",
    title: "半写实3D渲染风格下的现代FPS游戏图标包",
    author: "杨宇轩",
    tags: ["图标", "FPS", "3D渲染", "半写实"],
    description:
      "使用模型 GPT Image 2.5 Sunburst 生成半写实 3D 渲染的现代 FPS 图标包，覆盖武器、配件、弹药与赛季奖励四类。",
    skill: { id: "B118", name: "【B118】【图标】现代FPS武器图标" },
    resources: 28,
    images: [work7, work4, work2, work6, work8],
  },
  {
    id: "pirate-captain-sheet",
    title: "海盗船长角色设定",
    author: "chengpeng",
    tags: ["角色", "海盗", "设定", "厚涂"],
    description:
      "使用模型 GPT Image 2.5 Sunburst 生成厚涂风格海盗船长角色设定，包含正面立绘、侧面示意、服装分层与武器细节。",
    skill: { id: "A055", name: "【A055】【角色设定】厚涂海盗船长" },
    resources: 7,
    images: [work8, work5, work3, work1, work6],
  },
];

export function findWork(id: string): Work | undefined {
  return works.find((w) => w.id === id);
}
