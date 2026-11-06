import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Search, PanelLeft, SquarePen, Monitor, Library, Shapes, Workflow, LayoutGrid,
  MoreHorizontal, FolderPlus, FileText, Gamepad2, MessageCircle, Loader, Cloud,
  Briefcase, Plus, Mic, AudioLines, ArrowUp, ChevronDown, ChevronRight, Sparkles,
  Gift, MonitorSmartphone, Bell, Hammer, Folder, Clapperboard, Film, Smartphone, Presentation, MessageSquarePlus, Box,
} from "lucide-react";
import { useRef } from "react";
import { Sidebar, Logo } from "@/components/app-sidebar";
import { HomeComposer } from "@/components/home-composer";
import { RecentCanvases, FeaturedWorks } from "@/components/home-gallery";
import { isGameCreation } from "@/lib/game-workspace";
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

        <section className="mx-auto flex w-full max-w-[820px] flex-col px-6 pb-6 pt-4 sm:px-8 sm:pt-8">
          <Link to="/build" search={{ mode: "story" }} className="mx-auto flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 pl-1 pr-3 text-sm transition-colors hover:bg-accent">
            <img src={thumbVideo} alt="" width={28} height={28} className="size-7 rounded-full object-cover" />
            <span className="text-muted-foreground">新功能</span><span className="h-3 w-px bg-border" /><span>互动故事上线</span><ChevronRight className="size-4 text-muted-foreground" />
          </Link>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Logo className="size-9 shrink-0" />
            <span className="font-brand text-[30px] font-bold leading-none tracking-tight">ArTrail</span>
          </div>
          <p className="mt-3 text-center text-[15px] text-muted-foreground">一句话描述你想创作的内容，剩下的交给 ArTrail</p>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-[1.9fr_1fr]">
            <div className="grid gap-3">
              <Link to="/build" search={{ mode: "build" }} className="group relative flex h-[84px] flex-col justify-center overflow-hidden rounded-xl border border-border bg-card/60 px-4 transition-colors hover:bg-accent">
                <GridDeco />
                <Hammer className="relative mb-1.5 size-5 text-build" />
                <span className="relative flex items-center gap-1 text-[15px] font-semibold">构建<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
                <span className="relative text-xs text-muted-foreground">网站、应用和游戏</span>
              </Link>
              <button type="button" className="group relative flex h-[84px] flex-col items-start justify-center overflow-hidden rounded-xl border border-border bg-card/60 px-4 text-left transition-colors hover:bg-accent">
                <CardsDeco />
                <Shapes className="relative mb-1.5 size-5 text-create" />
                <span className="relative flex items-center gap-1 text-[15px] font-semibold">创建<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
                <span className="relative text-xs text-muted-foreground">图片和视频</span>
              </button>
            </div>
            <Link to="/build" search={{ mode: "story" }} className="group flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/60 p-4 text-center transition-colors hover:bg-accent">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary"><Clapperboard className="size-5 text-muted-foreground" /></span>
              <span className="flex items-center gap-1 text-[15px] font-semibold">互动影游<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
              <span className="text-xs text-muted-foreground">场景、选择和分支</span>
            </Link>
          </div>
          <HomeComposer scrollRoot={mainRef} onCreate={request => { if (isGameCreation(request.type)) void navigate({ to: "/game", search: { tab: "canvas", prompt: request.prompt, project: request.project } }); else void navigate({ to: "/build", search: { mode: request.type === "Interactive Story" ? "story" : "build" } }); }} />
        </section>
        <div className="mx-auto w-full max-w-[1200px] px-6 pt-10 sm:px-8">
          <RecentCanvases />
          <FeaturedWorks />
        </div>

      </main>
    </div>
  );
}
