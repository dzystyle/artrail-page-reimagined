import { Film, Image, Layers, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type MediaMode } from "@/lib/media-composer";

const starters = [
  { title: "角色与立绘", subtitle: "角色设定 · 多视图 · 表情", icon: UserRound, mode: "image" as const, prompt: "为奇幻冒险游戏设计一位魔法师角色，包含正面、侧面、背面三视图与四种表情，统一服装和配色，干净背景。" },
  { title: "场景与地图", subtitle: "世界观 · 关卡 · 场景氛围", icon: Image, mode: "image" as const, prompt: "为像素风 RPG 游戏创作一座夕阳下的河畔小镇，包含城堡、石桥和商店，色彩统一，具有清晰的可行走区域。" },
  { title: "道具与图标", subtitle: "装备 · 技能 · 界面素材", icon: Layers, mode: "image" as const, prompt: "为奇幻游戏设计一组背包道具图标：药水、宝石、武器和宝箱，统一视角、光照和尺寸，单独排列在干净背景上。" },
  { title: "游戏宣发视频", subtitle: "玩法短片 · 投流买量", icon: Film, mode: "video" as const, prompt: "制作一支赛车游戏投流买量视频：开场呈现高速漂移，随后展示赛道挑战与超车瞬间，节奏紧凑，突出真实玩法与竞速爽感。" },
];

export function MediaCreationIntro({ onChoose, selected }: { onChoose: (prompt: string, mode: MediaMode, title: string) => void; selected: string | null }) {
  return <div className="pb-6 pt-10 sm:pt-14">
    <div className="mb-5 flex items-center justify-center gap-2 text-create">
      <Sparkles className="size-4" aria-hidden="true" />
      <span className="text-[11px] font-medium">ArTrail / GAME MATERIALS</span>
    </div>
    <h1 className="text-center text-[30px] font-semibold leading-tight sm:text-[40px]">游戏素材创作</h1>
    <p className="mt-4 text-center text-sm leading-6 text-muted-foreground sm:text-base">描述你的灵感，创作游戏图片与宣发视频</p>
    <div className="mx-auto mt-6 grid max-w-[760px] grid-cols-2 gap-x-3 gap-y-2 sm:mt-7 sm:grid-cols-4" aria-label="游戏素材灵感">
      {starters.map(item => <Button key={item.title} type="button" variant="ghost" title={item.subtitle} aria-pressed={selected === item.title} onClick={() => onChoose(item.prompt, item.mode, item.title)} className={`h-9 min-w-0 gap-2 rounded-md px-2 text-xs font-medium ${selected === item.title ? "bg-create/10 text-create" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}>
        <item.icon className="size-3.5 shrink-0 text-create" aria-hidden="true" />
        {item.title}
      </Button>)}
    </div>
  </div>;
}