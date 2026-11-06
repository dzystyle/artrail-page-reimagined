import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Search, PanelLeft, SquarePen, Monitor, Library, Shapes, Workflow, LayoutGrid,
  MoreHorizontal, FolderPlus, FileText, Gamepad2, MessageCircle, Loader, Cloud,
  Briefcase, Plus, Mic, AudioLines, ArrowUp, ChevronDown, ChevronRight, Sparkles,
  Gift, MonitorSmartphone, Bell, Hammer, Folder, Clapperboard, Film, Smartphone, Presentation, MessageSquarePlus, Box, Play,
} from "lucide-react";
import { useRef } from "react";
import { Sidebar, Logo } from "@/components/app-sidebar";
import { HomeComposer } from "@/components/home-composer";
import { RecentCanvases, FeaturedWorks } from "@/components/home-gallery";
import { isGameCreation } from "@/lib/game-workspace";
import entryBuild from "@/assets/entry-build.jpg";
import entryCreate from "@/assets/entry-create.jpg";
import entryStory from "@/assets/entry-story.jpg";
import thumbVideo from "@/assets/thumb-video.jpg";
import thumbApp from "@/assets/thumb-app.jpg";
import thumbSlides from "@/assets/thumb-slides.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArTrail — 你的 AI 智能体工作台" },
      { name: "description", content: "ArTrail：构建网站、应用和游戏，创建幻灯片、图片和视频。" },
      { property: "og:title", content: "ArTrail — AI 智能体工作台" },
      { property: "og:description", content: "构建网站、应用和游戏，创建幻灯片、图片和视频。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function GridDeco() {
  return (
    <div className="pointer-events-none absolute -right-2 top-5 h-[140px] w-[160px] opacity-50"
      style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
      <div className="absolute left-7 top-7 size-[110px] rounded-full border-[26px] border-accent" />
    </div>
  );
}
function CardsDeco() {
  return (
    <div className="pointer-events-none absolute -right-4 top-4 h-[150px] w-[160px]">
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute h-[100px] w-[110px] rounded-lg border border-border bg-accent/40"
          style={{ left: 10 + i * 18, top: 18 + i * 4, transform: `rotate(${-14 + i * 6}deg)` }} />
      ))}
    </div>
  );
}

export function Index() {
  const navigate = useNavigate();
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
            <div className="flex items-center rounded-lg border border-border text-[15px]">
              <span className="px-3 py-1.5 text-muted-foreground">免费计划</span>
              <span className="h-4 w-px bg-border" />
              <span className="px-3 py-1.5 text-link">升级</span>
            </div>
            <span className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-[15px]"><Sparkles className="size-4" />300</span>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-[1040px] flex-col px-6 pb-0 pt-2 sm:px-8 sm:pt-3 [&>div:last-child]:mb-0 [&>div:last-child]:mt-5">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-2 sm:flex-nowrap sm:py-3">
            <div className="flex shrink-0 items-center gap-3 text-foreground/80">
              <Logo className="size-12 shrink-0 sm:size-14" />
              <span className="font-brand text-[36px] font-bold leading-none sm:text-[42px]">ArTrail</span>
            </div>
            <div className="flex min-h-[76px] w-full items-center gap-4 rounded-lg bg-surface-deep px-5 py-4 text-left sm:w-[300px] sm:shrink-0">
              <span className="relative shrink-0">
                <img src={thumbVideo} alt="" width={44} height={44} className="size-11 rounded-md border-2 border-foreground/80 object-cover" />
                <span className="absolute -bottom-1 -left-1 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="size-2.5 fill-current" /></span>
              </span>
              <span className="min-w-0 whitespace-normal"><span className="block text-[16px] font-semibold">创建你的视频</span><span className="mt-1 block text-sm font-normal text-muted-foreground">让想法变为现实</span></span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1.9fr_1fr]">
            <div className="grid gap-3">
              <Link to="/build" search={{ mode: "build" }} className="group relative flex h-[84px] flex-col justify-center overflow-hidden rounded-xl border border-border bg-card/60 px-4 transition-colors hover:border-foreground/30">
                <img src={entryBuild} alt="" aria-hidden width={1536} height={512} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/70 to-transparent" />
                <Hammer className="relative mb-1.5 size-5 text-build" />
                <span className="relative flex items-center gap-1 text-[15px] font-semibold">构建<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
                <span className="relative text-xs text-muted-foreground">网站、应用和游戏</span>
              </Link>
              <button type="button" className="group relative flex h-[84px] flex-col items-start justify-center overflow-hidden rounded-xl border border-border bg-card/60 px-4 text-left transition-colors hover:border-foreground/30">
                <img src={entryCreate} alt="" aria-hidden width={1536} height={512} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-card via-card/70 to-transparent" />
                <Shapes className="relative mb-1.5 size-5 text-create" />
                <span className="relative flex items-center gap-1 text-[15px] font-semibold">创建<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
                <span className="relative text-xs text-muted-foreground">图片和视频</span>
              </button>
            </div>
            <Link to="/build" search={{ mode: "story" }} className="group relative flex min-h-[180px] flex-col items-center justify-end gap-1.5 overflow-hidden rounded-xl border border-border bg-card/60 p-4 text-center transition-colors hover:border-foreground/30">
              <img src={entryStory} alt="" aria-hidden width={816} height={816} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <span className="relative grid size-11 place-items-center rounded-xl bg-secondary/80 backdrop-blur"><Clapperboard className="size-5 text-muted-foreground" /></span>
              <span className="relative flex items-center gap-1 text-[15px] font-semibold">互动影游<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
              <span className="relative text-xs text-muted-foreground">场景、选择和分支</span>
            </Link>
          </div>
          <HomeComposer scrollRoot={mainRef} onCreate={request => { if (isGameCreation(request.type)) void navigate({ to: "/game", search: { tab: "canvas", prompt: request.prompt, project: request.project } }); else void navigate({ to: "/build", search: { mode: request.type === "Interactive Story" ? "story" : "build" } }); }} />
        </section>
        <div className="mx-auto w-full max-w-[1040px] px-6 pt-8 sm:px-8">
          <RecentCanvases />
          <FeaturedWorks />
        </div>

      </main>
    </div>
  );
}
