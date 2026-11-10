import { useState } from "react";
import { Bell, ChevronDown, ChevronRight, ChevronUp, Copy, Gem, Info, Maximize2, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { imageTemplates } from "@/lib/image-templates";
import { RecentImageViewer, type RecentImage } from "@/components/recent-image-viewer";

import { ImageTemplateCanvas } from "@/components/image-template-canvas";
import type { ImageTemplate } from "@/lib/image-templates";
export function ImageTemplateWorkspace({ initialTemplate, onClose }: { initialTemplate: ImageTemplate; onClose: () => void }) {
  const [template, setTemplate] = useState(initialTemplate);
  const [mode, setMode] = useState<"workspace" | "canvas">("workspace");
  const [canvasOpened, setCanvasOpened] = useState(false);
  const others = imageTemplates.filter(t => t.id !== template.id);
  const sample = others.slice(0, 2);
  const [recent, setRecent] = useState<RecentImage | null>(null);
  const [assist, setAssist] = useState(false);
  const [expand, setExpand] = useState(false);
  const [desc, setDesc] = useState(`保留 [图1] 的内容与构图，使用 [图2] 的画风重新绘制。`);
  const wall = [...others, ...others, ...others].slice(0, 18);

  return <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
    <header className="flex items-center justify-between px-4 py-3">
      <div className="flex rounded-full border border-border bg-card p-1 text-xs">
        {([ ["workspace", "工作台"], ["canvas", "画布"] ] as const).map(([value, label]) => <Button key={value} variant={mode === value ? "default" : "ghost"} aria-pressed={mode === value} onClick={() => { if (value === "canvas") setCanvasOpened(true); setMode(value); }} className="h-8 rounded-full px-4 text-xs">{label}</Button>)}
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" className="relative hidden rounded-full sm:flex" aria-label="通知"><Bell className="size-4" /><span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-destructive text-[8px] leading-3 text-destructive-foreground">1</span></Button>
        <div className="flex items-center overflow-hidden rounded-full border border-border bg-card text-xs"><span className="flex items-center gap-1 px-3 py-2"><Gem className="size-3" />6</span><span className="hidden bg-secondary px-3 py-2 font-medium sm:block">开通会员</span></div>
        <span className="hidden size-9 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground sm:flex">幻</span>
        <Button size="icon" variant="ghost" aria-label="关闭模板工作台" title="关闭" onClick={onClose}><X className="size-4" /></Button>
      </div>
    </header>

    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 lg:flex-row lg:overflow-hidden">
      <aside className={`${mode === "canvas" ? "hidden lg:flex" : "flex"} w-full shrink-0 flex-col gap-3 border-border bg-card p-3 lg:h-full lg:w-[340px] lg:overflow-y-auto xl:w-[380px]`}>
        <div className="relative overflow-hidden rounded-xl">
          <img src={template.image} alt={template.title} className="aspect-[2.1/1] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-background/70 px-2 py-0.5 text-xs"><Copy className="size-3" />2</span>
          <div className="absolute right-3 top-3 flex gap-1.5">
            <Button size="sm" variant="secondary" className="h-7 rounded-full text-xs" onClick={() => { setMode("workspace"); }}><Pencil className="size-3" />更换</Button>
            
          </div>
          <div className="absolute bottom-3 left-4"><h1 className="text-xl font-semibold">{template.title}</h1><p className="mt-1 text-xs text-muted-foreground">保留构图，迁移参考画风</p></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sample.map((s, i) => <div key={s.id} className="overflow-hidden rounded-lg border border-border bg-secondary">
            <div className="relative"><img src={s.image} alt={`图${i + 1}`} className="aspect-[1.6/1] w-full object-cover" /><span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium">图{i + 1}</span></div>
            <div className="flex items-center justify-between px-2 py-1.5 text-[10px] text-muted-foreground">{i === 0 ? "示例 · 点击替换" : <>风格<ChevronDown className="size-3" /></>}</div>
          </div>)}
        </div>
        <Button variant="outline" className="flex items-center justify-between rounded-lg border-dashed px-3 py-2 text-xs text-muted-foreground" onClick={() => toast("图片上传服务暂未接入")}><span className="flex items-center gap-1.5"><Plus className="size-4" />添加图片</span>2/6</Button>

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

      <main className="relative min-h-[480px] min-w-0 flex-1 lg:min-h-0">
        <div hidden={mode !== "canvas"} className="h-full min-h-[480px]">{canvasOpened && <ImageTemplateCanvas key={template.id} template={template} samples={sample} />}</div>
        <div hidden={mode !== "workspace"} className="h-full overflow-y-auto"><div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {wall.map((t, i) => <Button variant="ghost" key={`${t.id}-${i}`} aria-label={`使用${t.title}`} onClick={() => setTemplate(t)} className={`group relative block h-auto whitespace-normal overflow-hidden rounded-lg border border-border bg-card p-0 text-left ${i % 3 === 1 ? "aspect-[1.4/1]" : "aspect-[1.6/1]"}`}>
            <img src={t.image} alt={t.title} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3"><span className="block text-[10px] text-muted-foreground">{t.categories[0]}</span><span className="text-sm font-semibold">{t.title}</span></span>
          </Button>)}
        </div></div>
      </main>

      <aside className="hidden w-16 shrink-0 flex-col items-center gap-3 xl:flex">
        <p className="text-xs text-muted-foreground">最近</p>
        {imageTemplates.slice(0, 2).map(t => <Button variant="ghost" key={t.id} onClick={() => setRecent(t)} aria-label={`查看 ${t.title}`} className="h-auto overflow-hidden rounded-lg border border-border p-0"><img src={t.image} alt={t.title} className="size-14 object-cover" /></Button>)}
        <span className="mt-auto text-xs text-muted-foreground">全部 →</span>
      </aside>
    </div>
    <RecentImageViewer item={recent} onClose={() => setRecent(null)} />
  </div>;
}
