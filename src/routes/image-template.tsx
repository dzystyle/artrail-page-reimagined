import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, ChevronRight, ChevronUp, Copy, Gem, Info, Maximize2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { imageTemplates } from "@/lib/image-templates";
import { RecentImageViewer, type RecentImage } from "@/components/recent-image-viewer";

type Search = { id: string };

export const Route = createFileRoute("/image-template")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s["id"] === "string" && imageTemplates.some(t => t.id === s["id"]) ? s["id"] : "style",
  }),
  head: () => ({
    meta: [
      { title: "图片模板工作台 — ArTrail" },
      { name: "description", content: "选择游戏图片模板，替换示例图并生成同类型游戏素材。" },
      { property: "og:title", content: "图片模板工作台 — ArTrail" },
      { property: "og:description", content: "选择游戏图片模板，替换示例图并生成同类型游戏素材。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImageTemplatePage,
});

function ImageTemplatePage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate({ from: "/image-template" });
  const template = imageTemplates.find(t => t.id === id) ?? imageTemplates[0]!;
  const others = imageTemplates.filter(t => t.id !== template.id);
  const sample = others.slice(0, 2);
  const [recent, setRecent] = useState<RecentImage | null>(null);
  const [assist, setAssist] = useState(false);
  const [expand, setExpand] = useState(false);
  const [desc, setDesc] = useState(`保留 [图1] 的内容与构图，使用 [图2] 的画风重新绘制。`);
  const wall = [...others, ...others, ...others].slice(0, 18);

  return <div className="min-h-screen bg-background text-foreground">
    <header className="flex items-center justify-between px-4 py-3">
      <div className="flex rounded-full border border-border bg-card p-1 text-xs">
        <span className="rounded-full bg-foreground px-4 py-1.5 font-medium text-background">工作台</span>
        <Link to="/" className="px-4 py-1.5 text-muted-foreground">画布</Link>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" className="relative rounded-full" aria-label="通知"><Bell className="size-4" /><span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-destructive text-[8px] leading-3 text-destructive-foreground">1</span></Button>
        <div className="flex items-center overflow-hidden rounded-full border border-border bg-card text-xs"><span className="flex items-center gap-1 px-3"><Gem className="size-3" />6</span><span className="bg-secondary px-3 py-2 font-medium">开通会员</span></div>
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">幻</span>
      </div>
    </header>

    <div className="flex flex-col gap-6 px-4 pb-6 lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col gap-3 rounded-2xl border border-border bg-card p-3 lg:sticky lg:top-3 lg:h-[calc(100vh-80px)] lg:w-[380px]">
        <div className="relative overflow-hidden rounded-xl">
          <img src={template.image} alt={template.title} className="aspect-[2.1/1] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-background/70 px-2 py-0.5 text-xs"><Copy className="size-3" />2</span>
          <div className="absolute right-3 top-3 flex gap-1.5">
            <Button asChild size="sm" variant="secondary" className="h-7 rounded-full text-xs"><Link to="/"><Pencil className="size-3" />更换</Link></Button>
            <Button asChild size="icon" variant="secondary" className="size-7 rounded-full"><Link to="/" aria-label="关闭"><X className="size-3" /></Link></Button>
          </div>
          <div className="absolute bottom-3 left-4"><h1 className="text-xl font-semibold">{template.title}</h1><p className="mt-1 text-xs text-muted-foreground">保留构图，迁移参考画风</p></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sample.map((s, i) => <div key={s.id} className="overflow-hidden rounded-lg border border-border bg-secondary">
            <div className="relative"><img src={s.image} alt={`图${i + 1}`} className="aspect-[1.6/1] w-full object-cover" /><span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium">图{i + 1}</span></div>
            <div className="flex items-center justify-between px-2 py-1.5 text-[10px] text-muted-foreground">{i === 0 ? "示例 · 点击替换" : <>风格<ChevronDown className="size-3" /></>}</div>
          </div>)}
        </div>
        <button className="flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground" onClick={() => toast("图片上传服务暂未接入")}><span className="flex items-center gap-1.5"><Plus className="size-4" />添加图片</span>2/6</button>

        <div className="flex min-h-40 flex-1 flex-col rounded-xl bg-secondary/60 p-3">
          <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">修改描述</h2><span className="flex items-center gap-2 text-[10px] text-muted-foreground">[图1][图2]<Trash2 className="size-3 cursor-pointer" onClick={() => setDesc("")} /></span></div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} aria-label="修改描述" className="mt-2 flex-1 resize-none bg-transparent text-sm leading-7 outline-none" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-4"><label className="flex items-center gap-1.5">图推词<Switch checked={assist} onCheckedChange={setAssist} /></label><label className="flex items-center gap-1.5">扩写<Switch checked={expand} onCheckedChange={setExpand} /></label></span>
            <span className="flex items-center gap-3"><span className="flex items-center gap-1"><Pencil className="size-3" />小助手</span><Maximize2 className="size-3" /></span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2"><div><p className="text-[10px] text-muted-foreground">模型</p><p className="text-sm">GPT Image 2.6</p></div><ChevronRight className="size-4 text-muted-foreground" /></div>
        <div className="grid grid-cols-3 gap-2">
          {[["比例", "16:9"], ["输出", "4K · 标准"], ["张数", "1 张"]].map(([k, v]) => <div key={k} className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-1.5"><div><p className="text-[10px] text-muted-foreground">{k}</p><p className="text-xs">{v}</p></div><ChevronUp className="size-3 text-muted-foreground" /></div>)}
        </div>
        <p className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground"><Info className="size-3" />怎么用</p>
        <Button onClick={() => toast("生成服务暂未接入，已保留当前设置")} className="h-12 rounded-full bg-foreground text-sm text-background hover:bg-foreground/90">用示例图生成 1 张 <Gem className="size-3" />80</Button>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {wall.map((t, i) => <button key={`${t.id}-${i}`} onClick={() => navigate({ search: { id: t.id } })} className={`group relative overflow-hidden rounded-xl border border-border bg-card text-left ${i % 3 === 1 ? "aspect-[1.4/1]" : "aspect-[1.6/1]"}`}>
            <img src={t.image} alt={t.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3"><span className="block text-[10px] text-muted-foreground">{t.categories[0]}</span><span className="text-sm font-semibold">{t.title}</span></span>
          </button>)}
        </div>
      </main>

      <aside className="hidden w-16 shrink-0 flex-col items-center gap-3 xl:flex">
        <p className="text-xs text-muted-foreground">最近</p>
        <RecentImageViewer item={recent} onClose={() => setRecent(null)} />
        {imageTemplates.slice(0, 2).map(t => <button key={t.id} onClick={() => setRecent(t)} aria-label={`查看 ${t.title}`} className="overflow-hidden rounded-lg border border-border"><img src={t.image} alt={t.title} className="size-14 object-cover" /></button>)}
        <span className="mt-auto text-xs text-muted-foreground">全部 →</span>
      </aside>
    </div>
  </div>;
}
