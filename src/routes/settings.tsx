import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronsUpDown, Search, User, Sparkles, SlidersHorizontal, Keyboard, LayoutGrid, Unplug, Puzzle, Mail, Monitor, Smartphone, Wallet, Database, Workflow, Code2, Building2, CircleHelp, ArrowUpRight, X, ChevronLeft, ChevronRight, MonitorCog, Cloud, Laptop, MemoryStick, Cpu, HardDrive, Upload, Radio, Globe, MousePointer2, Server } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import automation from "@/assets/cloud-automation.jpg";
import apple from "@/assets/cloud-apple.jpg";
import gameServer from "@/assets/cloud-game-server.jpg";
import render3d from "@/assets/cloud-3d.jpg";
import windows from "@/assets/cloud-windows.jpg";
import hosting from "@/assets/cloud-hosting.jpg";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "设置 · 电脑 — ArTrail" },
      { name: "description", content: "管理 ArTrail 云电脑与本地计算机，为多人游戏托管服务器。" },
      { property: "og:title", content: "设置 · 电脑 — ArTrail" },
      { property: "og:description", content: "管理 ArTrail 云电脑与本地计算机，为多人游戏托管服务器。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const nav: [string, [typeof User, string][]][] = [
  ["账户", [[User, "账户"], [Sparkles, "用量与计费"]]],
  ["设置", [[SlidersHorizontal, "通用"], [Keyboard, "快捷键"]]],
  ["功能", [[LayoutGrid, "个性化"], [Unplug, "连接器"], [Puzzle, "技能"], [Mail, "Mail ArTrail"], [Monitor, "电脑"]]],
  ["资产", [[Mail, "邮箱"], [Smartphone, "电话"], [Wallet, "钱包"]]],
  ["数据与集成", [[Database, "数据管理"], [Workflow, "集成"], [Code2, "开发者"]]],
];
type Plan = { title: string; desc: string; image: string; tags: string[]; soldOut?: boolean };
const plans: Plan[] = [
  { title: "运行自动化", desc: "让报告、网站检查和机器人全天候持续运行。", image: automation, tags: ["Linux", "服务器"] },
  { title: "构建 iOS 和 Mac 应用", desc: "在云端 Mac 上开发、测试和构建你的应用。", image: apple, tags: ["macOS", "Xcode"], soldOut: true },
  { title: "托管游戏服务器", desc: "为你的朋友提供一个共享世界，即使你离开也能保持在线。", image: gameServer, tags: ["Linux", "服务器"] },
  { title: "创建并渲染 3D", desc: "使用 Blender 在 CPU 上创建 3D 模型并渲染场景。", image: render3d, tags: ["Linux", "Blender"] },
  { title: "使用 Windows 应用", desc: "从你的 Mac 或其他设备访问所需的 Windows 软件。", image: windows, tags: ["Windows"] },
  { title: "构建并托管应用", desc: "构建你的网站或应用，并为其提供一个始终在线的空间。", image: hosting, tags: ["Linux", "服务器"] },
];

function Screen({ src, className = "" }: { src: string; className?: string }) {
  return <div className={`flex flex-col items-center bg-surface-deep pt-6 ${className}`}>
    <div className="w-[78%] rounded-md border-[3px] border-border bg-background p-0.5"><img src={src} alt="" loading="lazy" width={1088} height={608} className="aspect-[16/9] w-full rounded-sm object-cover" /></div>
    <div className="h-5 w-12 bg-gradient-to-b from-secondary to-surface-deep" /><div className="h-1 w-24 rounded-full bg-secondary" />
  </div>;
}
const Tag = ({ t }: { t: string }) => <span className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-sm">{t === "服务器" ? <Server className="size-4 text-muted-foreground" /> : t === "Computer Use" ? <MousePointer2 className="size-4" /> : t === "浏览器" ? <Globe className="size-4" /> : null}{t}</span>;

function SettingsPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Plan | null>(null);
  const [notice, setNotice] = useState("");
  const close = () => { setOpen(false); setDetail(null); };
  return <div className="flex min-h-screen bg-background text-foreground">
    <aside className="flex w-[290px] shrink-0 flex-col border-r border-border bg-card/40 px-3 py-4 max-md:hidden">
      <div className="flex items-center gap-3 px-2"><span className="grid size-9 place-items-center rounded-full bg-link text-sm font-semibold text-primary-foreground">y</span><span className="flex-1"><span className="block text-sm font-medium">yang yang</span><span className="block text-xs text-muted-foreground">个人版</span></span><ChevronsUpDown className="size-4 text-muted-foreground" /></div>
      <div className="relative mt-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input placeholder="搜索" className="h-10 w-full rounded-lg border border-border bg-transparent pl-9 text-sm outline-none" /></div>
      <nav className="mt-3 flex-1 overflow-y-auto">{nav.map(([g, items]) => <div key={g} className="mt-3"><p className="px-3 py-1.5 text-xs text-muted-foreground">{g}</p>{items.map(([I, l]) => <button key={l} className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[15px] ${l === "电脑" ? "bg-secondary" : "hover:bg-accent"}`}><I className="size-4" />{l}</button>)}</div>)}</nav>
      <div className="border-t border-border pt-2"><button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[15px] hover:bg-accent"><Building2 className="size-4" />创建团队</button><button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[15px] hover:bg-accent"><CircleHelp className="size-4" /><span className="flex-1 text-left">获取帮助</span><ArrowUpRight className="size-4 text-muted-foreground" /></button></div>
    </aside>
    <main className="relative min-w-0 flex-1 overflow-y-auto">
      <button aria-label="关闭设置" onClick={() => router.history.length > 1 ? router.history.back() : void router.navigate({ to: "/" })} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
      <div className="mx-auto max-w-[1080px] px-8 py-8">
        <h1 className="border-b border-border pb-5 text-2xl font-semibold">电脑</h1>
        <h2 className="mb-4 mt-10 text-base font-semibold">云电脑</h2>
        <div className="flex flex-col items-center rounded-xl border border-border py-10 text-center"><Cloud className="size-9 text-link" /><p className="mt-4 text-sm font-semibold">没有云端计算机</p><p className="mt-1 text-sm text-muted-foreground">创建一个全天候在线的工作区，让您的 Agent 全天候工作。</p><Button variant="outline" size="sm" className="mt-4" onClick={() => setOpen(true)}>立即创建</Button></div>
        <div className="mb-4 mt-10 flex items-center justify-between"><h2 className="text-base font-semibold">本地计算机</h2><Button variant="outline" size="sm">管理访问权限</Button></div>
        <div className="flex flex-col items-center rounded-xl border border-border py-10 text-center"><Laptop className="size-9 text-link" /><p className="mt-4 text-sm font-semibold">没有本地计算机</p><p className="mt-1 text-sm text-muted-foreground">下载 ArTrail 桌面应用以处理本地文件夹。</p><Button variant="outline" size="sm" className="mt-4">下载桌面应用</Button></div>
        <p className="mt-6 text-center text-xs text-muted-foreground"><Link to="/game" search={{ tab: "multiplayer", prompt: "", project: "ArTrail" }} className="underline underline-offset-4">返回多人游戏</Link></p>
      </div>
    </main>
    <Dialog open={open} onOpenChange={v => !v && close()}>
      <DialogContent className="max-h-[calc(100vh-32px)] max-w-[860px] overflow-y-auto rounded-2xl p-6 sm:rounded-2xl [&>button:last-child]:hidden">
        {!detail ? <>
          <div className="flex items-center justify-between"><DialogTitle className="text-xl font-semibold">创建云电脑</DialogTitle><DialogClose aria-label="关闭" className="text-muted-foreground hover:text-foreground"><X className="size-5" /></DialogClose></div>
          <DialogDescription className="sr-only">选择一个云电脑用途</DialogDescription>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{plans.map(p => <button key={p.title} disabled={p.soldOut} onClick={() => setDetail(p)} className="overflow-hidden rounded-xl border border-border text-left transition-colors hover:border-muted-foreground/50 disabled:cursor-not-allowed">
            <Screen src={p.image} />
            <div className="p-4"><p className="text-base font-semibold">{p.title}</p><p className="mt-1 min-h-10 text-sm text-muted-foreground">{p.desc}</p><div className="mt-3 flex items-center gap-2">{p.tags.map(t => <Tag key={t} t={t} />)}{p.soldOut && <span className="text-sm text-muted-foreground">已售罄</span>}</div></div>
          </button>)}</div>
          <button className="flex items-center gap-4 rounded-xl border border-border p-4 text-left hover:bg-accent"><span className="grid size-10 place-items-center rounded-lg border border-border"><MonitorCog className="size-5" /></span><span className="flex-1"><span className="block text-sm font-semibold">已经有配置想法了吗?</span><span className="block text-sm text-muted-foreground">选择您的操作系统，以及具备所需性能、内存和存储空间的方案。</span></span><span className="flex items-center text-sm font-semibold">自定义<ChevronRight className="size-4" /></span></button>
        </> : <>
          <div className="flex items-center justify-between"><DialogTitle className="flex items-center gap-2 text-xl font-semibold"><button aria-label="返回" onClick={() => { setDetail(null); setNotice(""); }}><ChevronLeft className="size-5" /></button>计算机详情</DialogTitle><DialogClose aria-label="关闭" className="text-muted-foreground hover:text-foreground"><X className="size-5" /></DialogClose></div>
          <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row"><Screen src={detail.image} className="w-full rounded-xl sm:w-[290px]" /><div><p className="text-xl font-semibold">{detail.title}</p><DialogDescription className="mt-2 text-sm text-muted-foreground">{detail.desc}</DialogDescription><div className="mt-4 flex flex-wrap gap-2">{[...detail.tags, "Computer Use", "浏览器"].map(t => <Tag key={t} t={t} />)}</div></div></div>
          <div className="border-b border-border pb-5"><div className="flex items-center justify-between"><p className="text-base"><span className="font-semibold">Ubuntu 24.04 LTS</span><span className="text-muted-foreground"> · Advanced</span> <span className="ml-1 rounded bg-link/15 px-1.5 py-0.5 text-sm text-link">推荐</span></p><button className="flex items-center gap-1.5 text-sm font-semibold"><SlidersHorizontal className="size-4" />自定义</button></div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">{[[MemoryStick, "8 GB 内存"], [Cpu, "2个虚拟 CPU"], [HardDrive, "120 GB 存储"], [Upload, "每月 1000 GB 出站"], [Radio, "1 Gbps 入站"], [Globe, "公网 IP"]].map(([I, t]) => { const C = I as typeof Cpu; return <span key={t as string} className="flex items-center gap-1.5"><C className="size-4" />{t as string}</span>; })}</div></div>
          <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-semibold">地点<CircleHelp className="size-4 text-muted-foreground" /></span><select aria-label="地点" className="h-11 w-64 rounded-xl border border-border bg-transparent px-3 text-sm"><option>东南亚 · 99 ms</option><option>美国西部 · 180 ms</option><option>欧洲 · 230 ms</option></select></div>
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p><span className="text-2xl font-semibold">$50</span><span className="text-muted-foreground"> / 月</span></p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">按月计费，自动续订直至取消，可能需缴纳税费。<br />超出包含的出站流量将按 $0.15/GB 收费。</p>{notice && <p role="status" className="mt-2 text-xs text-link">{notice}</p>}</div><div className="flex gap-2"><Button variant="outline" className="h-11 px-6" onClick={close}>取消</Button><Button className="h-11 px-6" onClick={() => setNotice("示例页面：尚未接入支付，订阅未生效。")}>订阅</Button></div></div>
        </>}
      </DialogContent>
    </Dialog>
  </div>;
}
