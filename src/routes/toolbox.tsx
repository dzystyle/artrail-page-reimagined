import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, AudioLines, Box, Check, Film, Image, Languages, Search, Scissors, Sparkles, Wrench } from "lucide-react";
import { Sidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { filterToolboxTools, toolCategories, type ToolCategory, type ToolboxTool } from "@/lib/toolbox";
import autoEdit from "@/assets/toolbox-auto-edit.jpg";
import localization from "@/assets/toolbox-localization.jpg";
import imagePreview from "@/assets/build-templates-1.jpg";
import videoPreview from "@/assets/build-templates-2.jpg";
import assetPreview from "@/assets/build-templates-3.jpg";
import audioPreview from "@/assets/build-templates-6.jpg";

export const Route = createFileRoute("/toolbox")({
  head: () => ({ meta: [
    { title: "游戏创作工具箱 — ArTrail" },
    { name: "description", content: "探索 ArTrail 游戏创作工具：自动剪辑、游戏文本本地化、宣传图、买量视频和像素资产。" },
    { property: "og:title", content: "游戏创作工具箱 — ArTrail" },
    { property: "og:description", content: "从游戏资产制作到推广与出海，发现适合你的创作工具。" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ToolboxPage,
});

const visuals = {
  "auto-edit": { image: autoEdit, icon: Scissors },
  localization: { image: localization, icon: Languages },
  image: { image: imagePreview, icon: Image },
  video: { image: videoPreview, icon: Film },
  assets: { image: assetPreview, icon: Box },
  audio: { image: audioPreview, icon: AudioLines },
};

function ToolCard({ tool, featured, onPreview }: { tool: ToolboxTool; featured?: boolean; onPreview: (tool: ToolboxTool) => void }) {
  const visual = visuals[tool.id as keyof typeof visuals];
  const Icon = visual.icon;
  return <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-muted-foreground/40">
    <div className="relative overflow-hidden">
      <img src={visual.image} alt={tool.name} loading="lazy" width={1280} height={720} className={`${featured ? "aspect-[2.5/1]" : "aspect-[16/9]"} w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none`} />
      {tool.upcoming && <span className="absolute left-3 top-3 rounded-md bg-surface-deep px-2.5 py-1 text-xs font-medium text-foreground">即将推出</span>}
    </div>
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <div className="flex items-center gap-2.5"><Icon className={`size-5 shrink-0 ${tool.id === "localization" ? "text-create" : "text-project-mint"}`} /><h3 className="text-lg font-semibold">{tool.name}</h3></div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
      <div className="mb-5 mt-3 flex flex-wrap gap-2">{tool.tags.map(tag => <span key={tag} className="text-xs text-muted-foreground">{tag}</span>)}</div>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3"><span className="text-xs text-muted-foreground">{tool.category}</span>
        {tool.upcoming ? <Button variant="ghost" size="sm" onClick={() => onPreview(tool)}>了解详情<ArrowUpRight className="size-4" /></Button> : <Button variant="ghost" size="sm" asChild><Link to={tool.id === "assets" ? "/build" : "/create"}>打开{tool.id === "assets" ? "模板" : "创作页"}<ArrowUpRight className="size-4" /></Link></Button>}
      </div>
    </div>
  </article>;
}

function ToolboxPage() {
  const [category, setCategory] = useState<ToolCategory>("全部工具");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ToolboxTool | null>(null);
  const tools = filterToolboxTools(category, query);
  const upcoming = tools.filter(tool => tool.upcoming);
  const available = tools.filter(tool => !tool.upcoming);
  return <div className="flex h-dvh overflow-hidden bg-background text-foreground">
    <Sidebar />
    <main className="min-w-0 flex-1 overflow-y-auto">
      <header className="flex h-[60px] items-center justify-between border-b border-border px-5 sm:px-8">
        <div className="flex items-center gap-2 text-sm"><Link to="/" className="mr-2 lg:hidden" aria-label="返回首页"><ArrowLeft className="size-4" /></Link><Wrench className="size-4 text-project-mint" /><span>工具箱</span></div><ThemeToggle />
      </header>
      <div className="mx-auto max-w-[1480px] px-5 pb-12 pt-8 sm:px-8 xl:px-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="mb-2 text-xs font-medium text-project-mint">创作 · 推广 · 出海</p><h1 className="text-3xl font-semibold">游戏创作工具箱</h1><p className="mt-3 text-sm text-muted-foreground">从一个灵感，到被世界看见。</p></div>
          <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="搜索工具" placeholder="搜索工具、用途…" value={query} onChange={e => setQuery(e.target.value)} className="h-10 pl-9" /></div>
        </div>
        <nav aria-label="工具分类" className="mt-7 flex gap-1 overflow-x-auto border-b border-border pb-3">{toolCategories.map(item => <Button key={item} variant={category === item ? "secondary" : "ghost"} size="sm" className="shrink-0" onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</Button>)}</nav>
        {upcoming.length > 0 && <section className="mt-7"><div className="mb-4 flex items-center gap-2"><Sparkles className="size-4 text-project-mint" /><h2 className="text-base font-semibold">下一站，新能力</h2><span className="ml-auto text-xs text-muted-foreground">即将推出</span></div><div className="grid gap-5 md:grid-cols-2">{upcoming.map(tool => <ToolCard key={tool.id} tool={tool} featured onPreview={setSelected} />)}</div></section>}
        {available.length > 0 && <section className="mt-9"><div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold">创作工具</h2><span className="text-xs text-muted-foreground">{available.length} 个入口</span></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{available.map(tool => <ToolCard key={tool.id} tool={tool} onPreview={setSelected} />)}</div></section>}
        {tools.length === 0 && <div className="flex flex-col items-center py-24 text-muted-foreground"><Search className="mb-4 size-8" /><p>没有找到相关工具</p><Button variant="ghost" className="mt-3" onClick={() => { setQuery(""); setCategory("全部工具"); }}>清除筛选</Button></div>}
      </div>
    </main>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-32px)] max-w-2xl overflow-y-auto p-0">
        {selected && <><img src={selected.id === "auto-edit" ? autoEdit : localization} alt={selected.name} width={1280} height={720} className="aspect-[2.5/1] w-full rounded-t-lg object-cover" /><div className="p-6"><span className="text-xs text-project-mint">即将推出</span><DialogTitle className="mt-3 text-2xl tracking-normal">{selected.name}</DialogTitle><DialogDescription className="mt-3 leading-6">{selected.description}</DialogDescription><div className="my-6 space-y-3">{selected.tags.map(tag => <div key={tag} className="flex items-center gap-3 text-sm"><Check className="size-4 text-project-mint" />{tag}</div>)}</div><div className="border-t border-border pt-4"><p className="text-sm text-muted-foreground">{selected.id === "auto-edit" ? "计划支持游戏录屏导入、精彩片段识别与成片导出。" : "计划支持文本导入、术语表管理与多语言导出。"}</p><p className="mt-2 text-xs text-muted-foreground">工具尚未开放，当前不上传素材、不执行处理或扣费。</p></div><Button variant="secondary" className="mt-6 w-full" onClick={() => setSelected(null)}>知道了</Button></div></>}
      </DialogContent>
    </Dialog>
  </div>;
}