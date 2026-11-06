import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, PlusCircle, Gamepad2, Box, Globe, Code2, Smartphone, Cpu, Joystick, Layers, Palette, Image, Grid3x3, Shapes } from "lucide-react";
import { Sidebar } from "@/components/app-sidebar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/plugins")({
  head: () => ({
    meta: [
      { title: "插件 — ArTrail" },
      { name: "description", content: "管理 ArTrail 插件：游戏创作、引擎平台、美术资产工具。" },
      { property: "og:title", content: "插件 — ArTrail" },
      { property: "og:description", content: "管理 ArTrail 插件：游戏创作、引擎平台、美术资产工具。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PluginsPage,
});

type Plugin = { name: string; desc: string; icon: typeof Box; tags: string[]; beta?: boolean };
const groups: { title: string; items: Plugin[] }[] = [
  { title: "Game creation", items: [
    { name: "Game Studio", desc: "跨引擎创建并改进游戏。", icon: Gamepad2, tags: ["General Game", "Interactive Story", "Godot", "3 skills"] },
    { name: "Three.js World", desc: "设计并构建细节丰富、可探索的 Three.js 世界。", icon: Box, tags: ["Web Game", "1 skill"] },
    { name: "Web Game Studio", desc: "构建并打磨浏览器游戏。", icon: Globe, tags: ["Web Game", "10 skills"] },
  ]},
  { title: "Engines & platforms", items: [
    { name: "Cocos Creator", beta: true, desc: "开发 Cocos 游戏并构建平台产物。", icon: Code2, tags: ["General Game", "1 skill"] },
    { name: "Douyin Mini Games", beta: true, desc: "适配、预览并检查抖音小游戏构建。", icon: Smartphone, tags: ["General Game", "1 skill"] },
    { name: "Godot", beta: true, desc: "制作 Godot 游戏，支持 Web 构建预览与 MCP 工具。", icon: Cpu, tags: ["General Game", "Godot", "3 tools", "MCP"] },
    { name: "TapTap Maker", desc: "使用官方 Maker CLI 创建、预览并提交 TapTap Maker 游戏。", icon: Joystick, tags: ["TapTap Maker game", "2 skills", "MCP"] },
    { name: "Unity", beta: true, desc: "使用官方工具编辑、测试并构建 Unity 项目。", icon: Layers, tags: ["General Game", "1 skill"] },
    { name: "Unreal Engine", beta: true, desc: "通过 Unreal MCP 检查场景、编辑 Actor。", icon: Shapes, tags: ["General Game", "MCP"] },
  ]},
  { title: "Art & assets", items: [
    { name: "Aseprite", beta: true, desc: "创作像素画并导出带元数据的动画图集。", icon: Palette, tags: ["General Game", "Asset Canvas", "1 skill"] },
    { name: "Blender", beta: true, desc: "制作游戏资产并导出可用的 GLB 文件。", icon: Box, tags: ["General Game", "Asset Canvas", "1 skill"] },
    { name: "Image to Three.js", desc: "根据参考图生成程序化 Three.js 模型。", icon: Image, tags: ["Web Game", "1 skill"] },
    { name: "Tiled", beta: true, desc: "构建瓦片地图、碰撞与关卡对象层。", icon: Grid3x3, tags: ["General Game", "Asset Canvas"] },
  ]},
];

function PluginCard({ p }: { p: Plugin }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center gap-4 rounded-xl bg-card px-4 py-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary"><p.icon className="size-5" /></span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><span className="text-[15px] font-medium">{p.name}</span>{p.beta && <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">Beta</span>}</div>
        <p className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">{p.desc}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span>{on ? "所有项目已启用" : "已停用"}</span>
          {p.tags.map((t) => <span key={t} className="rounded-md bg-secondary px-1.5 py-0.5 text-foreground/80">{t}</span>)}
        </div>
      </div>
      <Switch checked={on} onCheckedChange={setOn} aria-label={`启用 ${p.name}`} />
    </div>
  );
}

function PluginsPage() {
  const [tab, setTab] = useState("已安装");
  const [q, setQ] = useState("");
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const filtered = groups.map((g) => ({ ...g, items: g.items.filter((p) => (p.name + p.desc).toLowerCase().includes(q.toLowerCase())) })).filter((g) => g.items.length);
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1240px] px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold">插件</h1>
            <div className="flex items-center gap-2">
              <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索插件……" className="w-56 pl-9" /></div>
              <Button variant="secondary"><PlusCircle />添加</Button>
            </div>
          </div>
          <div className="mt-6 flex gap-1 text-sm">
            {[["已安装", total], ["浏览"], ["技能", 26]].map(([t, n]) => (
              <button key={t} onClick={() => setTab(t as string)} className={`rounded-full px-3 py-1.5 ${tab === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}{n !== undefined && <span className="ml-1.5 text-muted-foreground">{n}</span>}</button>
            ))}
          </div>
          {filtered.map((g) => (
            <section key={g.title} className="mt-8">
              <h2 className="mb-3 text-[17px] font-semibold">{g.title} <span className="ml-1 font-normal text-muted-foreground">{g.items.length}</span></h2>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{g.items.map((p) => <PluginCard key={p.name} p={p} />)}</div>
            </section>
          ))}
          {!filtered.length && <p className="mt-16 text-center text-muted-foreground">没有找到匹配的插件</p>}
        </div>
      </main>
    </div>
  );
}
