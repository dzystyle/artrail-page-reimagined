import { useState } from "react";
import { ChevronRight, Plus, Workflow, ImageIcon } from "lucide-react";
import canvas1 from "@/assets/canvas-1.jpg";
import canvas2 from "@/assets/canvas-2.jpg";
import canvas3 from "@/assets/canvas-3.jpg";
import canvas4 from "@/assets/canvas-4.jpg";

const canvases = [
  { img: canvas1, title: "戴安娜-Diana", count: 681, meta: "刚刚编辑 · 宋扬", icon: Workflow },
  { img: canvas2, title: "1105-2", count: 63, meta: "刚刚编辑 · chengpeng", icon: ImageIcon },
  { img: canvas3, title: "节点", count: 6, meta: "1 分钟前编辑 · 郭智妍", icon: Workflow },
  { img: canvas4, title: "机甲炮击", count: 171, meta: "1 分钟前编辑 · 朱玉儿", icon: ImageIcon },
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
    <section aria-label="最近画布">
      <Tabs items={tabs} active={tab} onChange={setTab} dots />
      <div className="mt-4 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">最近画布 <span className="text-sm font-normal text-muted-foreground">(10)</span></h2>
        <button className="flex items-center text-sm text-muted-foreground hover:text-foreground">查看全部<ChevronRight className="size-4" /></button>
      </div>
      <div className="-mx-1 mt-4 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        <button className="flex w-[200px] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl bg-card p-3 transition-colors hover:bg-accent xl:w-[calc((100%-48px)/5)]">
          <Plus className="size-6" />
          <span className="text-sm font-semibold">新建画布</span>
        </button>
        {canvases.map((c) => (
          <button key={c.title} className="w-[200px] shrink-0 snap-start rounded-2xl bg-card p-2.5 text-left transition-colors hover:bg-accent xl:w-[calc((100%-48px)/5)]">
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

