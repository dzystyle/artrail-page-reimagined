import { useState } from "react";
import { ChevronRight, Plus, Workflow, ImageIcon } from "lucide-react";
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

const canvases = [
  { img: canvas1, title: "戴安娜-Diana", count: 681, meta: "刚刚编辑 · 宋扬", icon: Workflow },
  { img: canvas2, title: "1105-2", count: 63, meta: "刚刚编辑 · chengpeng", icon: ImageIcon },
  { img: canvas3, title: "节点", count: 6, meta: "1 分钟前编辑 · 郭智妍", icon: Workflow },
  { img: canvas4, title: "机甲炮击", count: 171, meta: "1 分钟前编辑 · 朱玉儿", icon: ImageIcon },
];

const works = [
  { img: work1, title: "鉴宝题材模拟经营角色设定", author: "林悦" },
  { img: work2, title: "【模拟经营】餐厅建筑图标", author: "郭凌" },
  { img: work3, title: "Q版扁平玩具风角色", author: "宋扬" },
  { img: work4, title: "西式中世纪冒险RPG游戏图标", author: "杨宇轩" },
  { img: work5, title: "中世纪奇幻 · 风格化卡通角色设定包", author: "雷嘉玲" },
  { img: work6, title: "樱花黄昏街道场景", author: "朱玉儿" },
  { img: work7, title: "半写实3D渲染风格下的现代FPS游戏图标包", author: "杨宇轩" },
  { img: work8, title: "海盗船长角色设定", author: "chengpeng" },
];

function Tabs({ items, active, onChange, dots }: { items: string[]; active: string; onChange: (v: string) => void; dots?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {items.map((t, i) => (
        <span key={t} className="flex items-center gap-4">
          {dots && i > 0 && <span className="size-1 rounded-full bg-muted-foreground/40" />}
          <button onClick={() => onChange(t)} className={`text-[15px] transition-colors ${active === t ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        </span>
      ))}
    </div>
  );
}

export function RecentCanvases() {
  const tabs = ["画布创作", "最近使用", "本周热门", "推荐技能"];
  const [tab, setTab] = useState(tabs[0]!);
  return (
    <section aria-label="最近画布" className="mt-4">
      <Tabs items={tabs} active={tab} onChange={setTab} dots />
      <div className="mt-6 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">最近画布 <span className="text-sm font-normal text-muted-foreground">(10)</span></h2>
        <button className="flex items-center text-sm text-muted-foreground hover:text-foreground">查看全部<ChevronRight className="size-4" /></button>
      </div>
      <div className="-mx-1 mt-4 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        <button className="flex w-[200px] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl bg-card p-3 transition-colors hover:bg-accent">
          <Plus className="size-6" />
          <span className="text-sm font-semibold">新建画布</span>
        </button>
        {canvases.map((c) => (
          <button key={c.title} className="w-[200px] shrink-0 snap-start rounded-2xl bg-card p-2.5 text-left transition-colors hover:bg-accent">
            <img src={c.img} alt={c.title} loading="lazy" width={992} height={672} className="aspect-[16/11] w-full rounded-xl object-cover" />
            <div className="mt-2.5 flex items-center gap-2 px-1">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.title} <span className="text-muted-foreground">({c.count})</span></p>
                <p className="truncate text-xs text-muted-foreground">{c.meta}</p>
              </div>
              <c.icon className="size-5 shrink-0 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function FeaturedWorks() {
  const tabs = ["精选作品", "创作课程"];
  const [tab, setTab] = useState(tabs[0]!);
  return (
    <section aria-label="精选作品" className="pb-32">
      <div className="flex gap-8 border-b border-border">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 pb-3 text-[16px] transition-colors ${tab === t ? "border-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {works.map((w) => (
          <button key={w.title} className="group text-left">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card">
              <img src={w.img} alt={w.title} loading="lazy" width={992} height={672} className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-full bg-foreground px-5 py-1.5 text-sm font-semibold text-background">查看</span>
              </div>
              <span className="absolute bottom-2 left-3 text-xs text-foreground/90 opacity-0 transition-opacity group-hover:opacity-100">@ {w.author}</span>
            </div>
            <p className="mt-2.5 truncate text-[15px]">{w.title}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
