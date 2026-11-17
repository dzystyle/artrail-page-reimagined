import { ArrowUpRight, Film, Image, Layers, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type MediaMode } from "@/lib/media-composer";
import character from "@/assets/build-templates-1.jpg";
import scene from "@/assets/build-templates-6.jpg";
import items from "@/assets/build-templates-4.jpg";
import video from "@/assets/toolbox-auto-edit.jpg";

const starters = [
  { title: "角色与立绘", subtitle: "角色设定 · 多视图 · 表情", image: character, icon: UserRound, mode: "image" as const, prompt: "为奇幻冒险游戏设计一位魔法师角色，包含正面、侧面、背面三视图与四种表情，统一服装和配色，干净背景。" },
  { title: "场景与地图", subtitle: "世界观 · 关卡 · 场景氛围", image: scene, icon: Image, mode: "image" as const, prompt: "为像素风 RPG 游戏创作一座夕阳下的河畔小镇，包含城堡、石桥和商店，色彩统一，具有清晰的可行走区域。" },
  { title: "道具与图标", subtitle: "装备 · 技能 · 界面素材", image: items, icon: Layers, mode: "image" as const, prompt: "为奇幻游戏设计一组背包道具图标：药水、宝石、武器和宝箱，统一视角、光照和尺寸，单独排列在干净背景上。" },
  { title: "游戏宣发视频", subtitle: "玩法短片 · 投流买量", image: video, icon: Film, mode: "video" as const, prompt: "制作一支赛车游戏投流买量视频：开场呈现高速漂移，随后展示赛道挑战与超车瞬间，节奏紧凑，突出真实玩法与竞速爽感。" },
];

export function MediaCreationIntro({ onChoose, selected }: { onChoose: (prompt: string, mode: MediaMode, title: string) => void; selected: string | null }) {
  return <div className="pb-5 pt-5 sm:pt-8">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="游戏素材灵感">
      {starters.map(item => <Button key={item.title} type="button" variant="ghost" aria-pressed={selected === item.title} onClick={() => onChoose(item.prompt, item.mode, item.title)} className={`group block h-auto min-w-0 overflow-hidden rounded-lg border p-0 text-left font-normal transition-colors ${selected === item.title ? "border-create bg-accent" : "border-border bg-card hover:border-muted-foreground/50"}`}>
        <span className="relative block aspect-[2.6/1] overflow-hidden bg-muted">
          <img src={item.image} alt={item.title} className={`h-full w-full transition-transform duration-300 motion-safe:group-hover:scale-105 ${item.title === "角色与立绘" ? "object-contain" : "object-cover"}`} />
        </span>
        <span className="block px-3.5 py-3.5">
          <span className="flex items-center gap-2">
            <item.icon className="size-4 shrink-0 text-create" />
            <span className="min-w-0 flex-1 whitespace-normal text-[15px] font-semibold tracking-wide">{item.title}</span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          </span>
          <span className="mt-2 block whitespace-normal text-xs leading-5 tracking-wide text-muted-foreground">{item.subtitle}</span>
        </span>
      </Button>)}
    </div>
  </div>;
}