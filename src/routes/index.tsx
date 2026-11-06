import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, PanelLeft, SquarePen, Monitor, Library, Shapes, Workflow, LayoutGrid,
  MoreHorizontal, FolderPlus, FileText, Gamepad2, MessageCircle, Loader, Cloud,
  Briefcase, Plus, Mic, AudioLines, ArrowUp, ChevronDown, ChevronRight, Sparkles,
  Gift, MonitorSmartphone, Bell, Hammer, Folder, Clapperboard, Film, Smartphone, Presentation, MessageSquarePlus, Box,
  Check, Eye, EyeOff,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import thumbVideo from "@/assets/thumb-video.jpg";
import thumbApp from "@/assets/thumb-app.jpg";
import thumbSlides from "@/assets/thumb-slides.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artrail — 你的 AI 智能体工作台" },
      { name: "description", content: "Artrail：构建网站、应用和游戏，创建幻灯片、图片和视频。" },
      { property: "og:title", content: "Artrail — AI 智能体工作台" },
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
    <aside className="flex h-screen w-[333px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-2.5">
      <div className="flex h-[52px] items-center justify-between px-1.5">
        <div className="flex items-center gap-1.5">
          <Logo className="size-7" />
          <span className="font-brand text-lg font-bold tracking-tight">artrail</span>
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

const models = [
  { id: "max", name: "Artrail 2.0 Max", badge: "Pro", desc: "为复杂任务设计的高性能代理。" },
  { id: "std", name: "Artrail 2.0", badge: "Pro", desc: "多功能代理，能够执行大部分任务。" },
  { id: "lite", name: "Artrail 2.0 Lite", desc: "一个适合日常任务的轻量级代理。" },
  { id: "flex", name: "Artrail Flex", badge: "Beta", desc: "使用你自己的模型 API 密钥来驱动 Artrail。" },
];
const providers = ["OpenAI", "Anthropic", "Google Gemini", "DeepSeek", "自定义端点"];

function RingsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="12" r="5.5" />
      <circle cx="15" cy="12" r="5.5" className="opacity-40" />
    </svg>
  );
}

function FlexDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [provider, setProvider] = useState("");
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const ready = provider !== "" && key.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] gap-0 rounded-2xl border-border bg-card p-7">
        <div className="flex flex-col items-center text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-foreground">
            <RingsIcon className="size-7" />
          </span>
          <DialogTitle className="mt-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            Artrail Flex
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">Beta</span>
          </DialogTitle>
          <DialogDescription className="mt-2 text-[13px] leading-relaxed">
            使用您自己的 API 密钥和模型运行 Artrail。第三方模型的性能可能有所不同，且不受 Artrail 保证。
          </DialogDescription>
        </div>

        <div className="mt-6 space-y-4 text-left">
          <div>
            <p className="mb-1.5 text-[14px] text-foreground">提供商</p>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="h-10 rounded-lg border-border bg-background px-3 text-[14px]">
                <SelectValue placeholder="选择一个提供商" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border bg-popover">
                {providers.map((p) => <SelectItem key={p} value={p} className="text-[14px]">{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-[14px] text-foreground">API 密钥</p>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="输入您的 API 密钥"
                className="h-10 rounded-lg border-border bg-background pr-10 text-[14px]"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "隐藏 API 密钥" : "显示 API 密钥"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <button onClick={() => onOpenChange(false)} className="h-10 flex-1 rounded-lg border border-border text-[15px] text-foreground transition-colors hover:bg-accent">
            取消
          </button>
          <button disabled={!ready} className="h-10 flex-1 rounded-lg bg-primary text-[15px] font-medium text-primary-foreground transition-opacity disabled:opacity-40">
            连接
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModelPicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("lite");
  const [flexOpen, setFlexOpen] = useState(false);
  const active = models.find((m) => m.id === current) ?? models[2];

  const choose = (m: { id: string }) => {
    setOpen(false);
    if (m.id === "flex") {
      setFlexOpen(true);
      return;
    }
    setCurrent(m.id);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[15px] font-medium text-foreground transition-colors hover:bg-accent">
          {active.name}
          <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-[360px] rounded-xl border-border bg-popover p-1.5">
          <div className="space-y-0.5">
            {models.map((m) => (
              <button key={m.id} onClick={() => choose(m)} className="flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent">
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-[15px] font-medium text-foreground">
                    {m.name}
                    {m.badge && <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-secondary-foreground">{m.badge}</span>}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">{m.desc}</span>
                </span>
                {m.id === current && <Check className="mt-1 size-4 shrink-0 text-foreground" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <FlexDialog open={flexOpen} onOpenChange={setFlexOpen} />
    </>
  );
}

export function Index() {
  const examples = [
    { img: thumbVideo, tag: "视频", Icon: Film, title: "创作一支动漫短片" },
    { img: thumbApp, tag: "应用", Icon: Smartphone, title: "制作个人预算应用" },
    { img: thumbSlides, tag: "幻灯片", Icon: Presentation, title: "把教案做成幻灯片" },
  ];
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="relative flex h-screen flex-1 flex-col overflow-y-auto">
        <header className="flex h-[52px] items-center justify-between px-6">
          <ModelPicker />
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border text-[15px]">
              <span className="px-3 py-1.5 text-muted-foreground">免费计划</span>
              <span className="h-4 w-px bg-border" />
              <span className="px-3 py-1.5 text-link">升级</span>
            </div>
            <span className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-[15px]"><Sparkles className="size-4" />300</span>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[853px] flex-1 pt-[80px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo className="size-16" />
              <span className="font-brand text-[50px] font-bold leading-none tracking-tight">artrail</span>
            </div>
            <div className="flex h-[62px] w-[280px] items-center gap-3 rounded-xl bg-surface-deep px-4">
              <img src={thumbVideo} alt="" className="h-8 w-10 rounded object-cover" />
              <div>
                <p className="text-sm font-semibold">创建你的视频</p>
                <p className="text-xs text-muted-foreground">让想法变为现实</p>
              </div>
            </div>
          </div>

          <div className="mt-9 grid grid-cols-[540px_1fr] gap-3.5">
            <div className="flex flex-col gap-3.5">
              {[
                { Icon: Hammer, c: "text-build", t: "构建", s: "网站、应用和游戏", D: GridDeco },
                { Icon: Shapes, c: "text-create", t: "创建", s: "图片和视频", D: CardsDeco },
              ].map(({ Icon, c, t, s, D }) => (
                <button key={t} className="relative h-[144px] overflow-hidden rounded-2xl bg-card p-[22px] text-left transition-colors hover:bg-accent">
                  <Icon className={`size-6 ${c}`} fill="currentColor" />
                  <p className="mt-4 flex items-center gap-1 text-[17px] font-semibold">{t}<ChevronRight className="size-4" /></p>
                  <p className="mt-1 text-[15px] text-muted-foreground">{s}</p>
                  <D />
                </button>
              ))}
            </div>
            <button className="relative flex flex-col items-center justify-center rounded-2xl bg-card text-center transition-colors hover:bg-accent">
              <Clapperboard className="size-[72px] text-muted-foreground/60" strokeWidth={1.2} />
              <p className="mt-8 text-[17px] font-semibold">互动故事</p>
              <p className="mt-1.5 text-[15px] text-muted-foreground">场景、选择和分支</p>
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
