import { createFileRoute, Link } from "@tanstack/react-router";
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
          <div className="flex flex-col items-center text-center">
            <button className="mb-7 flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 pl-1 pr-3 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-link">新功能</span>
              互动故事上线：用场景和选择分支讲故事
              <ChevronRight className="size-3.5" />
            </button>
            <div className="flex items-center gap-3">
              <Logo className="size-12" />
              <span className="font-brand text-[44px] font-bold leading-none tracking-tight">ArTrail</span>
            </div>
            <p className="mt-4 text-[17px] text-muted-foreground">把想法变成游戏、故事、图片和视频</p>
          </div>
          <HomeComposer scrollRoot={mainRef} />
          <div className="-mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { Icon: Hammer, c: "text-build", t: "构建", s: "网站、应用和游戏" },
              { Icon: Shapes, c: "text-create", t: "创建", s: "图片和视频" },
              { Icon: Clapperboard, c: "text-muted-foreground", t: "互动故事", s: "场景、选择和分支" },
            ].map(({ Icon, c, t, s }) => (
               t === "构建" || t === "互动故事" ? <Button key={t} asChild variant="ghost" className="group h-auto justify-start whitespace-normal rounded-xl border border-border bg-card/60 px-4 py-3 text-left">
                 <Link to="/build" search={{ mode: t === "互动故事" ? "story" : "build" }}>
                   <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary"><Icon className={`size-[18px] ${c}`} /></span>
                   <span className="min-w-0 flex-1"><span className="block text-[15px] font-semibold">{t}</span><span className="block truncate text-xs font-normal text-muted-foreground">{s}</span></span>
                   <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                 </Link>
               </Button> : <button key={t} className="group flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-left transition-colors hover:bg-accent">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary"><Icon className={`size-[18px] ${c}`} /></span>
                <span className="min-w-0 flex-1"><span className="block text-[15px] font-semibold">{t}</span><span className="block truncate text-xs text-muted-foreground">{s}</span></span>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </section>
        <div className="mx-auto w-full max-w-[1280px] border-t border-border px-4 pt-8 sm:px-8">
          <RecentCanvases />
          <FeaturedWorks />
        </div>

      </main>
    </div>
  );
}
