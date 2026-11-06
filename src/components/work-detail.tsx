import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Work } from "@/lib/works";

export function WorkDetail({ work, onBack }: { work: Work; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const total = work.images.length;
  const current = work.images[index] ?? work.images[0]!;
  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground lg:flex-row">
      <div className="relative flex min-h-[60vh] min-w-0 flex-1 flex-col">
        <img src={current} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full scale-110 object-cover opacity-25 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-background/55" />

        <button
          onClick={onBack}
          aria-label="返回"
          className="absolute left-5 top-5 z-10 grid size-10 place-items-center rounded-full border border-border bg-card/80 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="relative flex flex-1 items-center justify-center px-6 pb-4 pt-20">
          <div className="relative">
            <span className="absolute left-3 top-3 rounded-full bg-background/75 px-3 py-1 text-xs text-foreground/90">AIGC By {work.author}</span>
            <img
              src={current}
              alt={`${work.title} 预览图 ${index + 1}`}
              className="max-h-[64vh] w-auto max-w-full rounded-2xl border border-border/60 object-contain shadow-2xl"
            />
          </div>
        </div>

        <div className="relative flex items-center justify-center gap-3 px-6 pb-8">
          <button
            onClick={() => go(-1)}
            aria-label="上一张"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card/80 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex gap-2 overflow-x-auto px-1">
            {work.images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setIndex(i)}
                aria-label={`查看第 ${i + 1} 张`}
                aria-current={i === index}
                className={cn(
                  "shrink-0 overflow-hidden rounded-lg border-2 transition-opacity",
                  i === index ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <img src={src} alt="" className="h-16 w-12 object-cover" />
              </button>
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="下一张"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card/80 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <aside className="w-full shrink-0 p-4 lg:h-screen lg:w-[380px]">
        <div className="flex h-full flex-col overflow-y-auto rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-semibold leading-snug">{work.title}</h1>
            <button
              onClick={onBack}
              aria-label="关闭"
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {work.tags.map((t) => (
              <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{t}</span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-build text-sm font-semibold">{work.author.slice(0, 1)}</span>
            <span className="text-[15px]">{work.author}</span>
          </div>

          <h2 className="mt-6 text-sm font-semibold text-muted-foreground">作品介绍</h2>
          <p className="mt-2 text-sm leading-relaxed">{work.description}</p>

          <h2 className="mt-6 text-sm font-semibold text-muted-foreground">使用的 Skill</h2>
          <div className="mt-3 rounded-xl border border-border bg-background/60 p-3">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{work.skill.name}</p>
                <span className="mt-1.5 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-foreground">Skill</span>
              </div>
              <button className="shrink-0 rounded-full bg-foreground px-4 py-1.5 text-[13px] font-semibold text-background transition-opacity hover:opacity-90">
                去使用
              </button>
            </div>
          </div>

          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-[15px] font-semibold transition-colors hover:bg-accent">
            <Sparkles className="size-4" />
            制作这款游戏
          </button>

          <p className="mt-auto pt-5 text-xs text-muted-foreground">共 {work.resources} 个资源</p>
        </div>
      </aside>
    </div>
  );
}
