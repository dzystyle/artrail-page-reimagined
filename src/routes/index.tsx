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

        <section className="mx-auto flex w-full max-w-[860px] flex-col px-4 pb-10 pt-6 sm:pt-10">
          <div className="mb-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Logo className="size-12 shrink-0" />
              <span className="truncate font-brand text-[40px] font-bold leading-none tracking-tight">ArTrail</span>
            </div>
            <button className="hidden items-center gap-3 rounded-2xl border border-border bg-surface-deep py-2.5 pl-3 pr-6 text-left transition-colors hover:bg-accent sm:flex">
              <img src={thumbVideo} alt="" width={56} height={40} className="h-10 w-14 shrink-0 rounded-md object-cover" />
              <span><span className="block text-[15px] font-semibold">互动故事上线</span><span className="block text-xs text-muted-foreground">用场景和选择分支讲故事</span></span>
            </button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1.9fr_1fr]">
            <div className="grid gap-3">
              <Link to="/build" search={{ mode: "build" }} className="group relative flex h-[130px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:bg-accent">
                <GridDeco />
                <Hammer className="mb-auto size-6 text-build" />
                <span className="relative flex items-center gap-1 text-[17px] font-semibold">构建<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
                <span className="relative text-sm text-muted-foreground">网站、应用和游戏</span>
              </Link>
              <button className="group relative flex h-[130px] flex-col items-start justify-end overflow-hidden rounded-2xl border border-border bg-card/60 p-5 text-left transition-colors hover:bg-accent">
                <CardsDeco />
                <Shapes className="mb-auto size-6 text-create" />
                <span className="relative flex items-center gap-1 text-[17px] font-semibold">创建<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
                <span className="relative text-sm text-muted-foreground">图片和视频</span>
              </button>
            </div>
            <Link to="/build" search={{ mode: "story" }} className="group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card/60 p-5 text-center transition-colors hover:bg-accent">
              <span className="grid size-16 place-items-center rounded-2xl bg-secondary"><Clapperboard className="size-8 text-muted-foreground" /></span>
              <span className="flex items-center gap-1 text-[17px] font-semibold">互动故事<ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
              <span className="text-sm text-muted-foreground">场景、选择和分支</span>
            </Link>
          </div>
          <HomeComposer scrollRoot={mainRef} onCreate={request => { if (isGameCreation(request.type)) void navigate({ to: "/game", search: { tab: "canvas", prompt: request.prompt, project: request.project } }); else void navigate({ to: "/build", search: { mode: request.type === "Interactive Story" ? "story" : "build" } }); }} />
        </section>
        <div className="mx-auto w-full max-w-[1280px] border-t border-border px-4 pt-8 sm:px-8">
          <RecentCanvases />
          <FeaturedWorks />
        </div>

      </main>
    </div>
  );
}
