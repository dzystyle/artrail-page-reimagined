import game1 from "@/assets/game-1.jpg";
import game2 from "@/assets/game-2.jpg";
import game3 from "@/assets/game-3.jpg";
import game4 from "@/assets/game-4.jpg";
import game5 from "@/assets/game-5.jpg";
import game6 from "@/assets/game-6.jpg";
import game7 from "@/assets/game-7.jpg";
import game8 from "@/assets/game-8.jpg";
import game9 from "@/assets/game-9.jpg";
import game10 from "@/assets/game-10.jpg";
import game11 from "@/assets/game-11.jpg";
import game12 from "@/assets/game-12.jpg";

export type GameSkill = { name: string; image: string; category: string };

/** Browser-safe demo catalogue; session-only until generation services connect. */
export const gameSkills: GameSkill[] = [
  { name: "【G001】平台跳跃模板", image: game1, category: "玩法模板" },
  { name: "【G002】俯视角射击模板", image: game2, category: "玩法模板" },
  { name: "【G003】消除益智模板", image: game3, category: "玩法模板" },
  { name: "【G004】跑酷闯关模板", image: game4, category: "玩法模板" },
  { name: "【G005】塔防布阵模板", image: game5, category: "玩法模板" },
  { name: "【G006】赛车竞速模板", image: game6, category: "玩法模板" },
  { name: "【G011】像素场景生成", image: game7, category: "场景美术" },
  { name: "【G012】卡通角色立绘", image: game8, category: "场景美术" },
  { name: "【G013】科幻 UI 套件", image: game9, category: "界面 UI" },
  { name: "【G014】休闲游戏图标", image: game10, category: "界面 UI" },
  { name: "【G021】战斗音效包", image: game11, category: "音效配乐" },
  { name: "【G022】循环背景音乐", image: game12, category: "音效配乐" },
];
