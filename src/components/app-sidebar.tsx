import { Link, useRouterState } from "@tanstack/react-router";
import { Search, PanelLeft, Rocket, MonitorPlay, Sparkles, MessageSquarePlus, LayoutGrid, Folder, Box, Puzzle, FolderPlus, FileText, Cloud, MessageCircle, Gamepad2, Loader, Gift, ChevronRight, MonitorSmartphone, Bell } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6l1.5 5M19 3v6M26 5l-2 5M8 12l4 3" />
      <path d="M13 17c4-3 11-3 14 1s1 9-4 10l3 7M13 17c-3 3-3 8 0 11 3 2 6 1 8-1" />
      <circle cx="21" cy="21" r="2" />
    </svg>
  );
}

const nav = [
  { icon: Sparkles, label: "创作", to: "/" as const },
  { icon: MessageSquarePlus, label: "新会话" },
  { icon: LayoutGrid, label: "画布" },
];
const nav2 = [
  { icon: Folder, label: "资产" },
  { icon: Box, label: "Skill" },
  { icon: Puzzle, label: "插件", to: "/plugins" as const },
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

function Item({ icon: Icon, label, badge, spin, to }: { icon: typeof Search; label: string; badge?: string; spin?: boolean; to?: "/" | "/plugins" }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const active = to !== undefined && path === to;
  const cls = `flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[15px] text-sidebar-foreground hover:bg-sidebar-accent ${active ? "bg-sidebar-accent font-semibold" : ""}`;
  const inner = (<>
      <Icon className={`size-[18px] shrink-0 ${spin ? "text-create" : ""}`} />
      <span className="truncate">{label}</span>
      {badge && <span className="rounded-md bg-accent px-1.5 py-0.5 text-xs font-medium">{badge}</span>}
  </>);
  return to ? <Link to={to} className={cls}>{inner}</Link> : <button className={cls}>{inner}</button>;
}

function ProjectLink({ id, name, icon: Icon }: { id: string; name: string; icon: typeof Search }) {
  return (
    <Link to="/projects/$projectId" params={{ projectId: id }} className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[15px] text-sidebar-foreground hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent font-semibold" }}>
      <Icon className="size-[18px] shrink-0" /><span className="truncate">{name}</span>
    </Link>
  );
}

export function Sidebar() {
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
      <div className="space-y-[5px]">{([["new-hope", "NEW-HOPE", Rocket], ["f3fx", "F3/FX", Gamepad2], ["artrail", "ArTrail", MonitorPlay]] as const).map(([id, n, I]) => <ProjectLink key={id} id={id} name={n} icon={I} />)}</div>
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

