import { createFileRoute } from "@tanstack/react-router";
import {
  Search, PanelLeft, SquarePen, Monitor, Library, Shapes, Workflow, LayoutGrid,
  MoreHorizontal, FolderPlus, FileText, Gamepad2, MessageCircle, Loader, Cloud,
  Briefcase, Plus, Mic, AudioLines, ArrowUp, ChevronDown, ChevronRight, Sparkles,
  Gift, MonitorSmartphone, Bell, Hammer, Folder, Clapperboard, Film, Smartphone, Presentation, MessageSquarePlus, Box,
} from "lucide-react";
import { useRef } from "react";
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

function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6l1.5 5M19 3v6M26 5l-2 5M8 12l4 3" />
      <path d="M13 17c4-3 11-3 14 1s1 9-4 10l3 7M13 17c-3 3-3 8 0 11 3 2 6 1 8-1" />
      <circle cx="21" cy="21" r="2" />
    </svg>
  );
}

const nav = [
  { icon: Sparkles, label: "创作", active: true },
  { icon: MessageSquarePlus, label: "新会话" },
  { icon: LayoutGrid, label: "画布" },
];
const nav2 = [
  { icon: Folder, label: "资产" },
  { icon: Box, label: "Skill" },
];
const tasks = [
  { icon: FileText, label: "新建任务" },
  { icon: Cloud, label: "测试并演示 Canva 连接器功能" },
  { icon: MessageCircle, label: "开发基于照片互动的AI虚拟伴侣游戏" },
  { icon: Gamepad2, label: "根据文档开发游戏" },
  { icon: Gamepad2, label: "开发多人对战派对小游戏" },
  { icon: Gamepad2, label: "分析小游戏创意方向" },
  { icon: Loader, label: "开发机甲美女题材游戏", spin: true },
];

function Item({ icon: Icon, label, badge, spin, active }: { icon: typeof Search; label: string; badge?: string; spin?: boolean; active?: boolean }) {
  return (
    <button className={`flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[15px] text-sidebar-foreground hover:bg-sidebar-accent ${active ? "bg-sidebar-accent font-semibold" : ""}`}>
      <Icon className={`size-[18px] shrink-0 ${spin ? "text-create" : ""}`} />
      <span className="truncate">{label}</span>
      {badge && <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs font-medium">{badge}</span>}
    </button>
  );
}

function Sidebar() {
  return (
    <aside className="hidden h-screen w-[333px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-2.5 lg:flex">
      <div className="flex h-[52px] items-center justify-between px-1.5">
        <div className="flex items-center gap-1.5">
          <Logo className="size-7" />
          <span className="font-brand text-lg font-bold tracking-tight">ArTrail</span>
        </div>
        <div className="flex gap-3 text-muted-foreground">
          <Search className="size-5" /><PanelLeft className="size-5" />
        </div>
      </div>
      <nav className="mt-2 space-y-[5px]">{nav.map((n) => <Item key={n.label} {...n} />)}
        <div className="mx-1.5 my-2 h-px bg-sidebar-border" />
        {nav2.map((n) => <Item key={n.label} {...n} />)}</nav>
      <p className="mt-5 px-2.5 py-2 text-sm text-muted-foreground">项目</p>
      <Item icon={FolderPlus} label="新项目" />
      <p className="mt-5 px-2.5 py-2 text-sm text-muted-foreground">任务</p>
      <div className="space-y-[5px] overflow-y-auto">{tasks.map((t, i) => <Item key={i} {...t} />)}</div>
      <div className="mt-auto pb-2">
        <button className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-left">
          <Gift className="size-5" />
          <div className="flex-1">
            <p className="text-[15px]">赚取 2,500 积分</p>
            <p className="text-xs text-muted-foreground">每邀请一位好友</p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
        <div className="mt-2 flex items-center gap-2.5 px-1 py-1.5">
          <span className="grid size-8 place-items-center rounded-full bg-build text-sm text-foreground">y</span>
          <span className="flex-1 text-[15px]">yang yang</span>
          <MonitorSmartphone className="size-5" /><Bell className="ml-2 size-5" />
        </div>
      </div>
    </aside>
  );
}

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

        <div className="mx-auto w-full max-w-[1120px] px-4 pb-32 pt-6 sm:px-8 sm:pt-10">
          <section className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <Logo className="size-11" />
              <span className="font-brand text-[40px] font-bold leading-none tracking-tight">ArTrail</span>
            </div>
            <p className="mt-3 text-[15px] text-muted-foreground">今天想创作点什么？从一个入口开始，或直接在下方描述你的想法。</p>
          </section>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { Icon: Hammer, c: "text-build", t: "构建", s: "网站、应用和游戏", D: GridDeco },
              { Icon: Shapes, c: "text-create", t: "创建", s: "图片和视频", D: CardsDeco },
              { Icon: Clapperboard, c: "text-muted-foreground", t: "互动故事", s: "场景、选择和分支", D: null },
            ].map(({ Icon, c, t, s, D }) => (
              <button key={t} className="relative h-[104px] overflow-hidden rounded-2xl bg-card p-5 text-left transition-colors hover:bg-accent">
                <Icon className={`size-5 ${c}`} fill={D ? "currentColor" : "none"} />
                <p className="mt-3 flex items-center gap-1 text-[16px] font-semibold">{t}<ChevronRight className="size-4" /></p>
                <p className="mt-0.5 text-sm text-muted-foreground">{s}</p>
                {D && <div className="absolute -right-6 -top-4 scale-75 opacity-70"><D /></div>}
              </button>
            ))}
          </div>

          <div className="mt-12"><RecentCanvases /></div>
          <div className="mx-auto mt-10 max-w-[860px]"><HomeComposer scrollRoot={mainRef} /></div>
          <div className="mt-14"><FeaturedWorks /></div>
        </div>
      </main>
    </div>
  );
}
