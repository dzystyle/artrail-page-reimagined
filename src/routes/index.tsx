import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Search, PanelLeft, SquarePen, Monitor, Library, Shapes, Workflow, LayoutGrid,
  MoreHorizontal, FolderPlus, FileText, Gamepad2, MessageCircle, Loader, Cloud,
  Briefcase, Plus, Mic, AudioLines, ArrowUp, ChevronDown, ChevronRight, Sparkles,
  Gift, MonitorSmartphone, Bell, Hammer, Folder, Clapperboard, Film, Smartphone, Presentation, MessageSquarePlus, Box, Play,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Sidebar, Logo } from "@/components/app-sidebar";
import { SubscriptionDialog } from "@/components/subscription-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { WorkspaceSearch } from "@/components/workspace-search";
import { HomeComposer } from "@/components/home-composer";
import { RecentCanvases } from "@/components/home-gallery";
import { HomeImageGallery } from "@/components/home-image-gallery";
import { isGameCreation } from "@/lib/game-workspace";
import entryBuild from "@/assets/game-3.jpg";
import entryCreate from "@/assets/entry-create.jpg";
import entryStory from "@/assets/entry-story.jpg";
import thumbVideo from "@/assets/thumb-video.jpg";
import thumbApp from "@/assets/thumb-app.jpg";
import thumbSlides from "@/assets/thumb-slides.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArTrail — 你的 AI 智能体工作台" },
      { name: "description", content: "ArTrail：构建游戏，创作互动影游、图片和视频。" },
      { property: "og:title", content: "ArTrail — AI 智能体工作台" },
      { property: "og:description", content: "构建游戏，创作互动影游、图片和视频。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});


const promos = [
  { title: "创建你的视频", desc: "让想法变为现实", img: thumbVideo },
  { title: "游戏开发", desc: "把创意变成游戏", img: thumbApp },
  { title: "互动影游", desc: "每个选择都改写结局", img: entryStory },
];
function PromoCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (paused) return; const t = setInterval(() => setI(v => (v + 1) % promos.length), 3500); return () => clearInterval(t); }, [paused]);
  return <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="flex w-full items-center gap-3 sm:w-[320px] sm:shrink-0">
    <div aria-live="polite" className="relative h-[76px] min-w-0 flex-1 overflow-hidden rounded-2xl border border-border/70 bg-surface-deep">
      <div className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]" style={{ transform: `translateY(-${i * 76}px)` }}>
        {promos.map((p, k) => <div key={p.title} aria-hidden={k !== i} className={`flex h-[76px] items-center gap-4 px-5 transition-opacity duration-500 ${k === i ? "opacity-100" : "opacity-0"}`}>
          <span className="relative shrink-0"><img src={p.img} alt="" width={44} height={44} className="size-11 rounded-md border-2 border-foreground/70 object-cover" />
            {k === 0 && <span className="absolute -bottom-1 -left-1 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="size-2.5 fill-current" /></span>}</span>
          <span className="min-w-0"><span className="block text-[16px] font-semibold">{p.title}</span><span className="mt-1 block text-sm text-muted-foreground">{p.desc}</span></span>
        </div>)}
      </div>
    </div>
    <div role="tablist" aria-label="推荐切换" className="flex flex-col items-center gap-1.5">
      {promos.map((p, k) => <button key={p.title} type="button" role="tab" aria-selected={k === i} aria-label={p.title} onClick={() => setI(k)} className={`w-1.5 rounded-full transition-all duration-300 ${k === i ? "h-5 bg-foreground/70" : "h-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"}`} />)}
    </div>
  </div>;
}

export function Index() {
  const navigate = useNavigate();
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const examples = [
    { img: thumbVideo, tag: "视频", Icon: Film, title: "创作一支动漫短片" },
    { img: thumbApp, tag: "应用", Icon: Smartphone, title: "制作个人预算应用" },
    { img: thumbSlides, tag: "幻灯片", Icon: Presentation, title: "把教案做成幻灯片" },
  ];
  const mainRef = useRef<HTMLElement>(null);
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main ref={mainRef} className="relative flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="flex min-h-[52px] flex-wrap items-center justify-end gap-2 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="lg:hidden"><WorkspaceSearch compact /></div>
            <div className="flex items-center rounded-lg border border-border text-[15px]">
              <span className="px-3 py-1.5 text-muted-foreground">免费计划</span>
              <span className="h-4 w-px bg-border" />
              <Button variant="ghost" className="h-auto rounded-l-none px-3 py-1.5 text-[15px] font-normal text-link" onClick={() => setSubscriptionOpen(true)}>升级</Button>
            </div>
            <span className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-[15px]"><Sparkles className="size-4" />300</span>
            <ThemeToggle />
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-[1040px] flex-col px-6 pb-0 pt-2 sm:px-8 sm:pt-3 [&>div:last-child]:mb-0 [&>div:last-child]:mt-5">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-2 sm:flex-nowrap sm:py-3">
            <div className="flex shrink-0 items-center gap-3 text-foreground">
              <Logo className="size-12 shrink-0 sm:size-14" />
              <span className="font-brand text-[36px] font-bold leading-none sm:text-[42px]">ArTrail</span>
            </div>
            <PromoCarousel />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1.9fr_1fr]">
            <div className="grid gap-3">
              <Link to="/build" search={{ mode: "build" }} className="group relative flex h-[96px] flex-col justify-center overflow-hidden rounded-2xl border border-border/70 bg-card/60 shadow-[0_8px_24px_-12px_oklch(0_0_0/0.6)] hover:-translate-y-0.5 px-5 transition-all duration-300 hover:border-foreground/30">
                <img src={entryBuild} alt="" aria-hidden width={1536} height={512} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/70 to-transparent" />
                <span className="relative flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-build"><Gamepad2 className="size-3.5" />Build</span>
                <span className="relative mt-1 flex items-center gap-1 text-[22px] font-semibold">构建游戏<ChevronRight className="size-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" /></span>
                <span className="relative mt-0.5 text-xs text-muted-foreground">从一个玩法开始，打造你的游戏世界</span>
              </Link>
              <Link to="/create" className="group relative flex h-[96px] flex-col items-start justify-center overflow-hidden rounded-2xl border border-border/70 bg-card/60 shadow-[0_8px_24px_-12px_oklch(0_0_0/0.6)] hover:-translate-y-0.5 px-4 text-left transition-all duration-300 hover:border-foreground/30">
                <img src={entryCreate} alt="" aria-hidden width={1536} height={512} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/70 to-transparent" />
                <span className="relative flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-create"><Shapes className="size-3.5" />Create</span>
                <span className="relative mt-1 flex items-center gap-1 text-[17px] font-semibold tracking-tight">创建图片和视频<ChevronRight className="size-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" /></span>
                 <span className="relative mt-0.5 text-xs text-muted-foreground">游戏宣传图、玩法短片、投流买量视频</span>
              </Link>
            </div>
            <Link to="/build" search={{ mode: "story" }} className="group relative flex min-h-[204px] flex-col items-center justify-end gap-1.5 overflow-hidden rounded-2xl border border-border/70 bg-card/60 shadow-[0_8px_24px_-12px_oklch(0_0_0/0.6)] hover:-translate-y-0.5 p-4 text-center transition-all duration-300 hover:border-foreground/30">
              <img src={entryStory} alt="" aria-hidden width={816} height={816} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <span className="relative rounded-full border border-foreground/20 bg-background/40 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] backdrop-blur"><Clapperboard className="mr-1 inline size-3.5 align-[-2px]" />Interactive</span>
              <span className="relative mt-1 flex items-center gap-1 text-[19px] font-semibold tracking-tight">互动影游<ChevronRight className="size-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" /></span>
              <span className="relative text-xs text-muted-foreground">每个选择，都改写结局</span>
            </Link>
          </div>
          <HomeComposer scrollRoot={mainRef} onCreate={request => { if (isGameCreation(request.type)) void navigate({ to: "/game", search: { tab: "canvas", prompt: request.prompt, project: request.project } }); else if (isMediaCreation(request.type)) void navigate({ to: "/create" }); else void navigate({ to: "/build", search: { mode: request.type === "Interactive Story" ? "story" : "build" } }); }} />
        </section>
        <div className="mx-auto w-full max-w-[1600px] px-6 pt-8 sm:px-8">
          <RecentCanvases />
          <HomeImageGallery />
        </div>

      </main>
      <SubscriptionDialog open={subscriptionOpen} onOpenChange={setSubscriptionOpen} />
    </div>
  );
}
