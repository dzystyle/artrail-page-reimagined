import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { imageCategories, imageTemplates, filterImageTemplates, type ImageTemplate } from "@/lib/image-templates";
import cover from "@/assets/image-tools-cover.jpg";

const tools = [
  { title: "换风格", badge: "HOT", description: "一键换成主流商业游戏风", image: imageTemplates[1]?.image, tone: "image-tool-style" },
  { title: "AI换装", badge: "NEW", description: "选服装与姿势，生成全新穿搭", image: imageTemplates[9]?.image, tone: "image-tool-outfit" },
  { title: "游戏画风", badge: "", description: "选一款 Steam 游戏，照它的画风出图", image: imageTemplates[8]?.image, tone: "" },
  { title: "全能编辑", badge: "", description: "打字就能改图，不用会 PS", image: imageTemplates[0]?.image, tone: "" },
  { title: "延续风格", badge: "", description: "传参考图，同画风出新图", image: imageTemplates[9]?.image, tone: "" },
  { title: "放大", badge: "", description: "模糊小图也能放大到 4K", image: imageTemplates[0]?.image, tone: "" },
];

export function HomeImageGallery() {
  const [category, setCategory] = useState("全部");
  const [selected, setSelected] = useState<ImageTemplate | null>(null);
  const filtered = filterImageTemplates(category);
  return <section aria-label="图片工具与模板" className="mt-8 pb-28">
    <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
      <Button asChild variant="ghost" className="group relative h-auto overflow-hidden rounded-lg border border-border p-0">
        <Link to="/create" aria-label="NANO BANANA 2.1 图片创作"><img src={cover} alt="ArTrail NANO BANANA 2.1" width={1536} height={816} loading="lazy" className="aspect-[1.9/1] h-full w-full object-cover" /><span className="absolute bottom-3 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full bg-primary" /></Link>
      </Button>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {tools.map(tool => <Button asChild variant="ghost" key={tool.title} className={`group relative h-auto min-h-20 items-start justify-start overflow-hidden rounded-lg border border-border bg-card px-3 py-4 text-left ${tool.tone}`}>
          <Link to="/create"><span className="relative z-10 min-w-0 pr-8"><span className="flex flex-wrap items-center gap-1 text-xs font-semibold">{tool.title}<ChevronRight className="size-3" />{tool.badge && <span className={`image-tool-badge ${tool.badge === "NEW" ? "image-tool-new" : ""}`}>{tool.badge}</span>}</span><span className="mt-1 block max-w-32 whitespace-normal text-[10px] font-normal leading-relaxed text-muted-foreground">{tool.description}</span></span><img src={tool.image} alt="" width={60} height={60} loading="lazy" className="absolute -bottom-1 right-3 size-12 rounded-md object-cover object-bottom transition-transform group-hover:-translate-y-1" /></Link>
        </Button>)}
      </div>
    </div>
    <div className="my-5 flex items-center gap-3">
      <h2 className="shrink-0 text-sm font-semibold">模板</h2><span className="h-3 w-px shrink-0 bg-border" />
      <div aria-label="模板分类" className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1">
        {imageCategories.map(item => <Button key={item} variant={category === item ? "secondary" : "outline"} aria-pressed={category === item} onClick={() => setCategory(item)} className="h-6 shrink-0 rounded-full px-2.5 text-[10px] font-normal shadow-none">{item}</Button>)}
      </div>
      <Button variant="ghost" className="hidden h-6 shrink-0 gap-0 px-0 text-[10px] text-muted-foreground sm:flex" onClick={() => setCategory("全部")}>查看全部<ChevronRight className="size-3" /></Button>
    </div>
    <div aria-label="图片模板列表" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {filtered.map(item => <Button variant="ghost" key={item.id} onClick={() => setSelected(item)} aria-label={`查看${item.title}`} className="group relative aspect-square h-auto w-full overflow-hidden rounded-lg bg-card p-0">
        <img src={item.image} alt={item.title} width={384} height={726} loading="lazy" className="h-full w-full object-fill transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.02]" />
      </Button>)}
    </div>
    <div className="mt-5 flex justify-center"><Button variant="default" className="rounded-full px-5 text-xs" onClick={() => setCategory("全部")}>查看全部模板<ArrowUpRight className="size-3" /></Button></div>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-32px)] max-w-2xl overflow-y-auto sm:p-7">
        <DialogTitle>{selected?.title}</DialogTitle><DialogDescription className="sr-only">图片模板预览</DialogDescription>
        {selected && <img src={selected.image} alt={selected.title} width={384} height={726} className="mx-auto max-h-[60vh] w-auto max-w-full rounded-lg object-contain" />}
        <Button asChild className="justify-self-end"><Link to="/create">去创作<ArrowUpRight /></Link></Button>
      </DialogContent>
    </Dialog>
  </section>;
}