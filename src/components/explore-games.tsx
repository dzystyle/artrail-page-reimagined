import { useState } from "react";
import { cn } from "@/lib/utils";
const imgs = import.meta.glob("@/assets/game-*.jpg", { eager: true, import: "default" }) as Record<string, string>;
const img = (n: number) => Object.entries(imgs).find(([k]) => k.endsWith(`/game-${n}.jpg`))?.[1] ?? "";
export const games = [
  ["Iron Rift FPS", "动作"], ["太空蠕虫 3D", "街机"], ["Side Scroller", "动作"], ["侠盗", "策略"],
  ["峡谷赛道", "体育"], ["超级地牢", "街机"], ["穴居人大战荒野", "动作"], ["二维太空蠕虫", "街机"],
  ["沙海", "模拟"], ["霜垒堡", "策略"], ["Wildclaw：巨像狩猎", "动作"], ["游戏开发游戏", "模拟"],
].map(([name, tag], i) => ({ name, tag, image: img(i + 1) }));
const tabs = ["全部", "动作", "街机", "策略", "模拟", "体育", "休闲"];

export function ExploreGames() {
  const [all, setAll] = useState(false);
  const [tab, setTab] = useState("全部");
  const list = all ? games.filter(g => tab === "全部" || g.tag === tab) : games.slice(0, 4);
  return <section aria-labelledby="explore-games" className="mt-6">
    <div className="mb-5 flex items-center justify-between">
      <h2 id="explore-games" className="text-xl font-semibold">探索游戏</h2>
      <button onClick={() => setAll(v => !v)} className="text-base text-muted-foreground transition-colors hover:text-foreground">{all ? "显示更少" : "显示全部"}</button>
    </div>
    {all && <div className="mb-5 flex flex-wrap gap-1">{tabs.map(t => <button key={t} onClick={() => setTab(t)} className={cn("rounded-xl px-4 py-2 text-base transition-colors", tab === t ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground")}>{t}</button>)}</div>}
    <div className={cn("grid gap-5", all ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4")}>
      {list.map(g => <div key={g.name} className="group relative aspect-[16/9] cursor-pointer overflow-hidden rounded-2xl bg-card">
        <img src={g.image} alt={g.name} width={640} height={360} loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute right-0 top-0 rounded-bl-xl bg-background/85 px-2.5 py-1 text-sm font-medium">{g.tag}</span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-4 pb-3 pt-10 text-lg font-semibold">{g.name}</div>
      </div>)}
    </div>
  </section>;
}
