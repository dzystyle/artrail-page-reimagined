import { useState } from "react";
import { ArrowUpRight, CornerDownLeft, Maximize2, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const imgs = import.meta.glob("@/assets/game-*.jpg", { eager: true, import: "default" }) as Record<string, string>;
const img = (n: number) => Object.entries(imgs).find(([k]) => k.endsWith(`/game-${n}.jpg`))?.[1] ?? "";
const genreDesc: Record<string, string> = {
  动作: "节奏紧凑的动作体验，流畅的操控手感、富有冲击力的打击反馈与层层递进的关卡挑战。",
  街机: "上手即玩的街机玩法，短局快节奏、分数追逐与不断叠加的成长乐趣。",
  策略: "在资源、地形与时机之间做出抉择，用布局与战术智胜对手。",
  模拟: "经营与建造并行，在自由的沙盒世界里规划、发展并见证成长。",
  体育: "竞速与对抗的爽快体验，精准的物理反馈与紧张的赛点时刻。",
};
export type ExploreGame = { name: string; tag: string; image: string; desc: string; prompt: string };
export const games: ExploreGame[] = [
  ["Iron Rift FPS", "动作"], ["太空蠕虫 3D", "街机"], ["Side Scroller", "动作"], ["侠盗", "策略"],
  ["峡谷赛道", "体育"], ["超级地牢", "街机"], ["穴居人大战荒野", "动作"], ["二维太空蠕虫", "街机"],
  ["沙海", "模拟"], ["霜垒堡", "策略"], ["Wildclaw：巨像狩猎", "动作"], ["游戏开发游戏", "模拟"],
].map(([name = "", tag = ""], i) => ({
  name, tag, image: img(i + 1),
  desc: name === "太空蠕虫 3D"
    ? "在快节奏、竞争激烈的 3D 蠕虫竞技场中吞噬一个鲜活的宇宙。以星尘成长，吞下天体以获得可永久叠加的能力，加速穿越危险区域，并在自由混战或 6v6 团队战中智胜对手蠕虫。"
    : `《${name}》—— ${genreDesc[tag] ?? ""}`,
  prompt: name === "太空蠕虫 3D"
    ? "打造一款精致的、基于浏览器的 Three.js 游戏《太空蠕虫 3D》：这是一款设定在绚丽宇宙战场中的竞技贪吃蛇成长竞技场。玩家持续操控一条光滑、如果冻般的蠕虫，收集能量，撕咬更小的对手，并吞噬会化为身体节段且提供可叠加永久能力的天体。消耗身体长度可以进行加速。包含 12 条蠕虫自由混战和 6v6 团队战、智能 AI 对手、小行星、带警示标记的能量门、引力井、磁铁/护盾/免费加速拾取物、王冠悬赏、撕咬连击与播报、星尘外观、本地记录、可选加入的排行榜、小地图、清晰的危险区域与可吞噬物体指示、英文和简体中文 UI、减少动态效果、鼠标/键盘/手柄/双指触控操作、丰富粒子效果、响应式 HUD、自定义音乐和 SFX、快速分阶段加载，以及具有电影感的低眩光照明。"
    : `打造一款基于浏览器的${tag}游戏《${name}》：${genreDesc[tag] ?? ""}包含完整的主菜单、新手引导、可调难度、计分与本地记录、键盘/鼠标/触控操作、响应式 HUD、粒子特效、背景音乐与音效，以及流畅的分阶段加载。`,
}));
const tabs = ["全部", "动作", "街机", "策略", "模拟", "体育", "休闲"];

export function ExploreGames({ onContinue, onUsePrompt }: { onContinue?: (g: ExploreGame) => void; onUsePrompt?: (g: ExploreGame) => void } = {}) {
  const [all, setAll] = useState(false);
  const [tab, setTab] = useState("全部");
  const [open, setOpen] = useState<ExploreGame | null>(null);
  const list = all ? games.filter(g => tab === "全部" || g.tag === tab) : games.slice(0, 4);
  return <section aria-labelledby="explore-games" className="mt-6">
    <div className="mb-5 flex items-center justify-between">
      <h2 id="explore-games" className="text-xl font-semibold">探索游戏</h2>
      <button onClick={() => setAll(v => !v)} className="text-base text-muted-foreground transition-colors hover:text-foreground">{all ? "显示更少" : "显示全部"}</button>
    </div>
    {all && <div className="mb-5 flex flex-wrap gap-1">{tabs.map(t => <button key={t} onClick={() => setTab(t)} className={cn("rounded-xl px-4 py-2 text-base transition-colors", tab === t ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground")}>{t}</button>)}</div>}
    <div className={cn("grid gap-5", all ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4")}>
      {list.map(g => <button type="button" key={g.name} aria-label={`查看 ${g.name} 详情`} onClick={() => setOpen(g)} className="group relative aspect-[16/9] overflow-hidden rounded-2xl bg-card text-left">
        <img src={g.image} alt={g.name} width={640} height={360} loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute right-0 top-0 rounded-bl-xl bg-background/85 px-2.5 py-1 text-sm font-medium">{g.tag}</span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-4 pb-3 pt-10 text-lg font-semibold">{g.name}</div>
      </button>)}
    </div>
    <Dialog open={!!open} onOpenChange={v => !v && setOpen(null)}>
      <DialogContent className="flex h-[min(860px,calc(100vh-48px))] w-[calc(100vw-48px)] max-w-[1880px] gap-3 rounded-[28px] border-border bg-background p-3 sm:rounded-[28px] [&>button:last-child]:hidden">
        {open && <>
          <div className="relative hidden min-w-0 flex-1 overflow-hidden rounded-2xl bg-card md:block">
            <img src={open.image} alt={open.name} className="size-full object-cover" />
          </div>
          <aside className="flex w-full shrink-0 flex-col rounded-2xl bg-card p-6 md:w-[372px]">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-2xl font-semibold">{open.name}</DialogTitle>
              <DialogClose aria-label="关闭" className="text-muted-foreground transition-colors hover:text-foreground"><X className="size-6" /></DialogClose>
            </div>
            <DialogDescription className="mt-4 text-base leading-relaxed text-foreground/85">{open.desc}</DialogDescription>
            <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">使用 <span className="text-foreground">ArTrail 2.0 Max</span>，一条提示词即可创作</p>
              <p className="mt-4 min-h-0 flex-1 overflow-y-auto text-sm leading-relaxed text-muted-foreground">{open.prompt}</p>
              <button type="button" onClick={() => { onUsePrompt?.(open); setOpen(null); }} className="mt-3 flex items-center gap-1.5 self-end text-sm text-foreground/85 hover:text-foreground"><CornerDownLeft className="size-4" />使用此提示词</button>
            </div>
            <div className="mt-6 flex gap-2.5">
              <Button variant="secondary" className="h-12 flex-1 rounded-xl text-base" onClick={() => window.open(open.image, "_blank", "noopener")}><ArrowUpRight />在新标签中打开</Button>
              <Button variant="secondary" size="icon" aria-label="全屏查看" className="size-12 rounded-xl" onClick={() => window.open(open.image, "_blank", "noopener")}><Maximize2 /></Button>
            </div>
            <Button className="mt-3 h-12 rounded-xl text-base" onClick={() => { onContinue?.(open); setOpen(null); }}>在这款游戏上继续做</Button>
          </aside>
        </>}
      </DialogContent>
    </Dialog>
  </section>;
}
