import { useState } from "react";
import { ArrowLeftRight, ChevronDown, ChevronUp, Columns2, Copy, Download, Expand, Frame, Image as ImageIcon, Info, Minus, Plus, RotateCw, Scissors, Sparkles, Star, SwatchBook, Wand2, X, ZoomIn, Hash, ListFilter, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type RecentImage = { id: string; image: string; title: string };

const soon = () => toast("该功能暂未接入");

export function RecentImageViewer({ item, onClose, onEditCanvas }: { item: RecentImage | null; onClose: () => void; onEditCanvas: (item: RecentImage) => void }) {
  const [zoom, setZoom] = useState(100);
  const [open, setOpen] = useState(true);
  const prompt = `保持原图${item?.title ?? ""}的主体与构图，为其设计 5 套风格不同的游戏素材。`;
  const btn = "flex h-10 items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/70";

  return <Dialog open={!!item} onOpenChange={o => !o && onClose()}>
    <DialogContent className="h-screen max-h-screen w-screen max-w-none gap-0 overflow-hidden rounded-none border-0 bg-background p-0 sm:rounded-none [&>button]:hidden">
      <DialogTitle className="sr-only">{item?.title ?? "图片详情"}</DialogTitle>
      {item && <div className="relative flex h-full w-full">
        <img src={item.image} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-background/40" />
        <section className="relative flex min-w-0 flex-1 items-center justify-center p-6 pt-20">
          <div className="absolute left-1/2 top-3 flex -translate-x-1/2 gap-2">
            <div className="flex gap-1 rounded-xl border border-border bg-card p-1 shadow-lg">
              <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background"><ImageIcon className="size-4" /></span>
              <button onClick={soon} className="flex size-8 items-center justify-center rounded-lg" aria-label="对比"><Columns2 className="size-4" /></button>
              <button onClick={soon} className="flex size-8 items-center justify-center rounded-lg" aria-label="细节"><ScanLine className="size-4" /></button>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1 text-xs shadow-lg">
              <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="flex size-8 items-center justify-center" aria-label="缩小"><Minus className="size-4" /></button>
              <span className="w-12 text-center">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(300, z + 25))} className="flex size-8 items-center justify-center" aria-label="放大"><Plus className="size-4" /></button>
            </div>
          </div>
          <div className="max-h-full max-w-full overflow-auto">
            <img src={item.image} alt={item.title} style={{ transform: `scale(${zoom / 100})` }} className="max-h-[80vh] rounded-lg object-contain shadow-2xl transition-transform" />
          </div>
        </section>
        <aside className="relative m-2 flex w-[380px] shrink-0 flex-col gap-2 overflow-y-auto rounded-2xl border border-border bg-card p-2.5">
          <div className="flex items-center gap-3 p-1">
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs">幻</span>
            <div className="flex-1"><p className="text-sm font-medium">幻想3900</p><p className="text-xs text-muted-foreground">创作者</p></div>
            <button onClick={onClose} aria-label="关闭" className="flex size-8 items-center justify-center rounded-full bg-secondary"><X className="size-4" /></button>
          </div>
          <div className="rounded-xl bg-secondary/50 p-2">
            <div className="flex items-center justify-between px-1 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><ListFilter className="size-3.5" />提示词</span>
              <button onClick={() => { navigator.clipboard?.writeText(prompt); toast("已复制提示词"); }} className="flex items-center gap-1 rounded-md border border-border px-2 py-1"><Copy className="size-3" />复制</button></div>
            <p className="mt-2 rounded-lg bg-secondary/60 p-3 text-sm leading-6">{prompt}</p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-2">
            <button onClick={() => setOpen(o => !o)} className="flex w-full items-center justify-between px-1 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Info className="size-3.5" />图片详情</span>{open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}</button>
            {open && <dl className="mt-2 space-y-2 rounded-lg bg-secondary/60 p-3 text-sm">
              {[["风格模型", "GPT Image 2.6 精细 · 标准档"], ["画质", "高"], ["尺寸", "3840 × 2160"], ["创建时间", "2026-11-09 15:49:10"]].map(([k, v]) => <div key={k} className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>)}
            </dl>}
          </div>
          <div className="rounded-xl bg-secondary/50 p-2">
            <p className="px-1 text-xs text-muted-foreground">参考图像</p>
            <img src={item.image} alt="参考图像" className="mt-2 size-14 rounded-md border border-border object-cover" />
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <Button onClick={() => onEditCanvas(item)} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-medium text-background"><Hash className="size-4" />去画布编辑</Button>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={soon} className={btn}><RotateCw className="size-4" />再次生成</button>
              <button onClick={soon} className={btn}><ArrowLeftRight className="size-4" />复用参数</button>
            </div>
            <p className="text-xs text-muted-foreground">用这张图继续</p>
            <div className="grid grid-cols-2 gap-2">
              {([[Wand2, "全能编辑"], [Frame, "强控生图"], [Scissors, "一键抠图"], [Expand, "智能扩图"], [ZoomIn, "高清放大"], [SwatchBook, "延续风格"]] as const).map(([I, l]) => <button key={l} onClick={soon} className={btn}><I className="size-4" />{l}</button>)}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <a href={item.image} download className={btn}><Download className="size-4" />下载</a>
              <button onClick={soon} className={btn} aria-label="复制"><Copy className="size-4" /></button>
              <button onClick={soon} className={btn} aria-label="收藏"><Star className="size-4" /></button>
            </div>
            <Sparkles className="hidden" />
          </div>
        </aside>
      </div>}
    </DialogContent>
  </Dialog>;
}
