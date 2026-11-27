import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bell, ChevronLeft, ChevronRight, Clapperboard, Gamepad2, Image, Sparkles, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import gameCover from "@/assets/creation-update-game.png.asset.json";
import storyCover from "@/assets/creation-update-story.png.asset.json";
import modelCover from "@/assets/creation-update-models.png.asset.json";

const slides = [
  { label: "构建游戏", image: gameCover.url, mode: "build" as const, eyebrow: "PLAY YOUR IDEAS", title: "构建游戏", subtitle: "从一个玩法开始，\n让想象成为可玩的世界。", description: "游戏设计、美术资产、可玩版本，让创意一步步成形。", tags: ["游戏设计", "美术资产", "在线试玩"] },
  { label: "互动影游", image: storyCover.url, mode: "story" as const, eyebrow: "EVERY CHOICE MATTERS", title: "互动影游", subtitle: "故事不止被观看，\n也由每一次选择改写。", description: "场景、角色与剧情分支，让观众走进你的故事。", tags: ["剧情分支", "沉浸场景", "互动叙事"] },
  { label: "新模型", image: modelCover.url, mode: null, eyebrow: "MORE WAYS TO CREATE", title: "新模型", subtitle: "新的画面，新的可能。", description: "图片与视频模型更新，让游戏素材创作拥有更多选择。", tags: ["图片模型", "视频模型"] },
];
const imageModels = ["gpt-image-2.6-flare", "gpt-image-2.6-sunburst", "gemini-nano-banana-2.1", "doubao-seedream-5-0-flash", "doubao-seedream-5-5"];
const videoModels = ["gemini-omni-flash", "gemini-omni-1.1-flash", "doubao-seedance-2-5-flash", "kling-v4-flash", "kling-v4"];

export function CreationUpdatesDialog({ children, autoOpen = false }: { children?: React.ReactNode; autoOpen?: boolean }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => { if (autoOpen) setOpen(true); }, [autoOpen]);
  const slide = slides[index] ?? slides[0];
  if (!slide) return null;
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>{children ?? <Button variant="ghost" size="icon" aria-label="查看创作更新" title="创作更新"><Bell /></Button>}</DialogTrigger>
    <DialogContent className="creation-update-dialog flex h-[min(860px,92dvh)] w-[calc(100vw-24px)] max-w-[780px] flex-col gap-0 overflow-hidden rounded-lg border-0 p-0 text-update-foreground [&>button]:hidden">
      <img key={slide.image} src={slide.image} alt="" className={`absolute inset-x-0 top-0 w-full object-cover object-center ${index === 2 ? "h-[48%]" : "h-[65%]"}`} />
      <div className="creation-update-shade pointer-events-none absolute inset-0" />
      <div className="relative flex shrink-0 items-center justify-between px-6 pb-4 pt-6 sm:px-10">
        <span className="flex items-center gap-2 text-sm font-medium"><Sparkles className="size-4" />ArTrail <span className="ml-2 border-l border-update-foreground/25 pl-3 text-update-foreground/70">创作更新</span></span>
        <DialogClose asChild><Button size="icon" variant="ghost" className="rounded-full bg-update-foreground/10 hover:bg-update-foreground/20 hover:text-update-foreground" aria-label="关闭创作更新"><X /></Button></DialogClose>
      </div>
      <div className={`relative flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-6 sm:px-10 ${index === 2 ? "justify-start sm:justify-end" : "justify-end"}`}>
        <div key={slide.label} className="creation-update-content pt-12">
          <div className="mb-5 flex flex-wrap gap-2">{slide.tags.map(tag => <span key={tag} className="rounded-full border border-update-foreground/15 bg-update-foreground/10 px-3 py-1 text-[11px] backdrop-blur-sm">{tag}</span>)}</div>
          <p className="mb-3 text-[10px] font-medium tracking-[0.16em] text-update-foreground/65">{slide.eyebrow}</p>
          <DialogTitle className="text-[32px] font-semibold leading-tight tracking-normal sm:text-[44px]">{slide.title}</DialogTitle>
          <p className="mt-3 whitespace-pre-line text-[23px] font-semibold leading-snug sm:text-[30px]">{slide.subtitle}</p>
          <DialogDescription className="mt-4 max-w-[520px] text-sm leading-6 text-update-foreground/75">{slide.description}</DialogDescription>
          {index === 2 ? <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[{ title: "图片模型", Icon: Image, models: imageModels }, { title: "视频模型", Icon: Video, models: videoModels }].map(group => <section key={group.title} className="min-w-0 border-t border-update-foreground/25 pt-3">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><group.Icon className="size-4" />{group.title}<span className="ml-auto text-[10px] font-normal text-update-foreground/70">{group.models.length} 款</span></h3>
              <ul className="space-y-2">{group.models.map(model => <li key={model} className="break-words text-[12px] leading-5 text-update-foreground/85">{model}</li>)}</ul>
            </section>)}
            <p className="text-[11px] leading-5 text-update-foreground/70 sm:col-span-2">模型更新展示 · 实际可用范围以创作页为准</p>
          </div> : slide.mode && <DialogClose asChild><Button asChild className="mt-6 border border-update-foreground/30 bg-update-foreground/10 text-update-foreground shadow-none backdrop-blur-sm hover:bg-update-foreground/20">
            <Link to="/build" search={{ mode: slide.mode }}>{slide.mode === "build" ? <Gamepad2 /> : <Clapperboard />}{slide.mode === "build" ? "开始构建游戏" : "开始创作影游"}<ArrowUpRight /></Link>
          </Button></DialogClose>}
        </div>
      </div>
      <footer className="relative shrink-0 px-6 pb-7 pt-3 sm:px-10">
        <div role="tablist" aria-label="创作更新分类" className="grid grid-cols-3 gap-3">{slides.map((item, i) => <Button key={item.label} role="tab" aria-selected={i === index} variant="ghost" onClick={() => setIndex(i)} className="h-auto flex-col items-start gap-3 rounded-none p-0 text-update-foreground/60 hover:bg-transparent hover:text-update-foreground">
          <span className={`h-[3px] w-full rounded-full ${i === index ? "bg-update-foreground" : "bg-update-foreground/25"}`} />
          <span className={`text-xs ${i === index ? "text-update-foreground" : ""}`}>{item.label}</span>
        </Button>)}</div>
        <div className="mt-5 flex items-center justify-between"><span className="text-[10px] text-update-foreground/65">0{index + 1} / 03</span><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label="上一页更新" onClick={() => setIndex((index + 2) % 3)} className="size-7 text-update-foreground/70 hover:bg-update-foreground/10 hover:text-update-foreground"><ChevronLeft /></Button><Button variant="ghost" size="icon" aria-label="下一页更新" onClick={() => setIndex((index + 1) % 3)} className="size-7 text-update-foreground/70 hover:bg-update-foreground/10 hover:text-update-foreground"><ChevronRight /></Button></div></div>
      </footer>
    </DialogContent>
  </Dialog>;
}