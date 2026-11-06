import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowLeft, Box, Check, ChevronDown, ChevronRight, Clapperboard, Gamepad2, Globe, Image, Lightbulb, Plus, Search, Settings, X, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const types = [
  { name: "Web Game", desc: "在浏览器中运行，支持 HTML5、Phaser 或 Three.js", icon: Globe },
  { name: "Interactive Story", desc: "场景、选择和分支", icon: Clapperboard },
  { name: "Asset Canvas", desc: "在画布上创作图片、视频和 3D 资产", icon: Image },
  { name: "Godot", desc: "需要在此电脑上安装 Godot 4", icon: Gamepad2 },
  { name: "General Game", desc: "任意引擎，由智能体推荐", icon: Gamepad2 },
  { name: "TapTap Maker game", desc: "使用 UrhoX/Lua 创建 TapTap Maker 项目", icon: Box },
];
const modelNames = ["deepseek-flash", "deepseek-v4-flash", "deepseek-v4-pro", "gemini-3.5-flash", "gemini-3.8-flash", "gemini-4-argon", "gpt-5.5", "gpt-5.6-luna", "gpt-5.6-sol"];
const depths = ["Off", "Low", "Medium", "High"];
const initialProviders = [
  { name: "ArTrail-deepseed", detail: "自定义端点 · 语言 · 图像", enabled: true },
  { name: "火山引擎方舟", detail: "API 密钥 · 图像 · 视频", enabled: true },
  { name: "Hyper3D", detail: "API 密钥 · 3D", enabled: true },
];

function ProviderSettings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [providers, setProviders] = useState(initialProviders);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("全部");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [notice, setNotice] = useState("");
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[85vh] max-w-[850px] overflow-y-auto bg-background p-0">
      <div className="flex min-h-[560px]">
        <aside className="hidden w-44 shrink-0 border-r border-border p-4 sm:block">
          <p className="mb-5 text-sm font-semibold">设置</p>
          <div className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm"><KeyRound className="size-4" />提供商</div>
        </aside>
        <div className="min-w-0 flex-1 p-6 sm:p-8">
          <DialogTitle>提供商</DialogTitle>
          <DialogDescription className="sr-only">模型提供商与默认模型设置</DialogDescription>
          <div className="mt-6 flex gap-3">
            <Input aria-label="搜索提供商" placeholder="搜索提供商" value={search} onChange={e => setSearch(e.target.value)} />
            <Button variant="secondary" onClick={() => { setName(""); setEndpoint(""); setEditing(true); }}><Plus />添加提供商</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-1">{["全部", "语言", "图像", "视频", "3D", "声音"].map(t => <Button key={t} variant={tab === t ? "secondary" : "ghost"} size="sm" onClick={() => setTab(t)}>{t}</Button>)}</div>
          <h3 className="mb-2 mt-6 text-sm font-medium">默认模型</h3>
          <div className="divide-y divide-border rounded-lg bg-card text-sm">
            <div className="flex items-center justify-between p-3"><span>聊天模型</span><span className="text-muted-foreground">在输入框中选择</span></div>
            {[{ label: "图像", models: ["自动 · 豆宝 Seedream 5.0 Pro", "不指定"] }, { label: "视频", models: ["自动 · 豆宝种子舞 2.5", "不指定"] }].map(row => <label key={row.label} className="flex flex-wrap items-center justify-between gap-2 p-3"><span>{row.label}</span><select aria-label={`${row.label}默认模型`} className="max-w-full rounded-md border border-border bg-background p-1.5">{row.models.map(m => <option key={m}>{m}</option>)}</select></label>)}
            <div className="flex justify-between p-3"><span>3D</span><span className="text-muted-foreground">Hyper3D</span></div>
          </div>
          <h3 className="mb-2 mt-6 text-sm font-medium">提供商</h3>
          <div className="divide-y divide-border rounded-lg bg-card">{providers.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (tab === "全部" || p.detail.includes(tab))).map(p => <div key={p.name} className="flex items-center gap-3 p-3"><Box className="size-5 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="break-words text-sm">{p.name}</p><p className="text-xs text-muted-foreground">{p.detail}</p></div><Switch aria-label={`启用 ${p.name}`} checked={p.enabled} onCheckedChange={enabled => setProviders(list => list.map(item => item.name === p.name ? { ...item, enabled } : item))} className="data-[state=checked]:bg-build" /><Button variant="ghost" size="icon" aria-label={`配置 ${p.name}`} title="配置提供商" onClick={() => { setName(p.name); setEndpoint(""); setEditing(true); }}><Settings /></Button></div>)}</div>
          <h3 className="mb-2 mt-6 text-sm font-medium">热门提供商</h3>
          {["OpenAI", "Anthropic", "OpenRouter"].filter(p => p.toLowerCase().includes(search.toLowerCase())).map(p => <div key={p} className="flex items-center justify-between border-b border-border py-3 text-sm"><span>{p}</span><Button variant="secondary" size="sm" onClick={() => { setName(p); setEndpoint(""); setEditing(true); }}>配置</Button></div>)}
          {editing && <form className="mt-4 space-y-3 border-t border-border pt-4" onSubmit={e => { e.preventDefault(); if (!providers.some(p => p.name === name.trim())) setProviders(list => [...list, { name: name.trim(), detail: "自定义端点 · 语言", enabled: false }]); setEditing(false); setNotice("设置已暂存于本次页面；尚未连接模型服务。"); }}>
            <Input aria-label="提供商名称" placeholder="提供商名称" value={name} onChange={e => setName(e.target.value)} required />
            <Input aria-label="服务地址" placeholder="https://…" type="url" value={endpoint} onChange={e => setEndpoint(e.target.value)} required />
            <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setEditing(false)}>取消</Button><Button type="submit">保存</Button></div>
          </form>}
          {notice && <p role="status" className="mt-4 text-sm text-muted-foreground">{notice}</p>}
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}

/** Keeps the composer in one instance so the draft survives docking/expanding. */
export function HomeComposer({ scrollRoot }: { scrollRoot?: React.RefObject<HTMLElement | null> } = {}) {
  const anchor = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [anchorHeight, setAnchorHeight] = useState<number>();
  useEffect(() => {
    const el = anchor.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      const out = !entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0) + 1;
      if (out && el.firstElementChild) setAnchorHeight(el.offsetHeight);
      setDocked(out);
      if (!out) setExpanded(false);
    }, { root: scrollRoot?.current ?? null, threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [scrollRoot]);
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);
  const [text, setText] = useState("");
  const [type, setType] = useState(types[2] ?? types[0]);
  const [typeOpen, setTypeOpen] = useState(false);
  const [model, setModel] = useState("deepseek-v4-pro");
  const [modelOpen, setModelOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [depthView, setDepthView] = useState(false);
  const [depth, setDepth] = useState("High");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  if (!type) return null;
  const TypeIcon = type.icon;
  const floating = docked && expanded;
  const hiddenFull = docked && !expanded;
  return <div ref={anchor} style={docked ? { height: anchorHeight } : undefined} className="mb-12 mt-8">
    {floating && <div aria-hidden className="fixed inset-0 z-40 bg-background/60 backdrop-blur-[2px] animate-in fade-in-0" onClick={() => setExpanded(false)} />}
    {hiddenFull && <button type="button" aria-label="展开创作输入框" onClick={() => { setExpanded(true); requestAnimationFrame(() => textarea.current?.focus()); }}
      className="fixed bottom-6 left-1/2 z-40 flex w-[min(540px,calc(100vw-32px))] -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-card/80 py-2.5 pl-6 pr-2.5 text-left shadow-2xl backdrop-blur-xl animate-in fade-in-0 slide-in-from-bottom-4 lg:ml-[166px]">
      <span className={`flex-1 truncate text-[15px] ${text ? "text-foreground" : "text-muted-foreground"}`}>{text || "输入你的需求即可生成图片、视频…"}</span>
      <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground"><ArrowUp className="size-4" /></span>
    </button>}
  <section aria-label="创作输入框" className={floating ? "fixed bottom-6 left-1/2 z-50 w-[min(885px,calc(100vw-32px))] -translate-x-1/2 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-6 lg:ml-[166px]" : hiddenFull ? "hidden" : ""}>
    <form className="rounded-2xl border border-input bg-card p-4 sm:p-5" onSubmit={e => { e.preventDefault(); setNotice("尚未连接创作服务，你的输入已保留。"); }}>
      <Textarea ref={textarea} aria-label="创作描述" placeholder="描述你想创作的内容…" value={text} onChange={e => { setText(e.target.value); setNotice(""); }} className="h-[112px] resize-none border-0 p-0 text-base shadow-none focus-visible:ring-0 md:text-base" />
      {files.length > 0 && <div className="mb-3 flex flex-wrap gap-2">{files.map((file, i) => <div key={`${file.name}-${i}`} className="flex max-w-full items-center gap-1 rounded-md bg-secondary pl-2 text-xs"><span className="truncate">{file.name}</span><Button type="button" size="icon" variant="ghost" className="size-7" aria-label={`移除 ${file.name}`} onClick={() => setFiles(list => list.filter((_, index) => index !== i))}><X /></Button></div>)}</div>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <input ref={fileInput} type="file" multiple className="hidden" aria-label="添加附件" onChange={e => { setFiles(list => [...list, ...Array.from(e.target.files ?? [])]); e.target.value = ""; }} />
          <Button type="button" variant="ghost" size="icon" title="添加附件" aria-label="添加附件" onClick={() => fileInput.current?.click()}><Plus className="size-5" /></Button>
          <Popover open={typeOpen} onOpenChange={setTypeOpen}><PopoverTrigger asChild><Button type="button" variant="ghost" aria-label="选择创作类型" className="text-muted-foreground"><TypeIcon /><span>{type.name}</span><ChevronDown /></Button></PopoverTrigger>
            <PopoverContent align="start" side="bottom" className="w-[min(420px,calc(100vw-32px))] rounded-lg p-1.5">
              {types.map(t => <Button type="button" key={t.name} variant="ghost" onClick={() => { setType(t); setTypeOpen(false); }} className={`h-auto w-full justify-start whitespace-normal px-3 py-2 text-left ${type.name === t.name ? "bg-accent" : ""}`}><t.icon className="text-muted-foreground" /><span className="flex-1"><span className="block text-[15px] font-normal">{t.name}</span><span className="block text-[13px] font-normal leading-snug text-muted-foreground">{t.desc}</span></span>{t.name === type.name && <Check />}</Button>)}
              <Button type="button" variant="ghost" className="h-auto w-full justify-start px-3 py-2" onClick={() => { setTypeOpen(false); setSettingsOpen(true); }}><Plus /><span className="text-left"><span className="block">More types…</span><span className="text-xs font-normal text-muted-foreground">提供商设置</span></span></Button>
            </PopoverContent>
          </Popover>
        </div>
        <div className="ml-auto flex min-w-0 items-center gap-2">
          <Popover open={modelOpen} onOpenChange={v => { setModelOpen(v); if (!v) { setDepthView(false); setSearch(""); } }}><PopoverTrigger asChild><Button type="button" aria-label="选择创作模型" variant="ghost" className="min-w-0 gap-1.5 px-2 text-muted-foreground sm:gap-2"><span className="rounded bg-secondary px-1.5 text-xs">A</span><span className="truncate text-foreground">{model}</span><span className="text-muted-foreground">{depth}</span><ChevronDown /></Button></PopoverTrigger>
            <PopoverContent align="end" side="bottom" className="w-[min(315px,calc(100vw-32px))] rounded-lg p-0">
              {depthView ? <><Button type="button" variant="ghost" className="h-12 w-full justify-start rounded-none border-b border-border px-4 text-base" onClick={() => setDepthView(false)}><ArrowLeft />Thinking depth</Button><div className="p-1.5">{depths.map(d => <Button type="button" variant="ghost" key={d} className="h-11 w-full justify-between px-3 text-base font-normal" onClick={() => { setDepth(d); setModelOpen(false); setDepthView(false); }}>{d}{depth === d && <Check />}</Button>)}</div></> : <>
                <div className="flex items-center gap-2 border-b border-border px-3 py-2"><Search className="size-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} aria-label="搜索模型" placeholder="Search models" className="h-8 min-w-0 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" /><Button type="button" variant="ghost" size="icon" aria-label="提供商设置" title="提供商设置" onClick={() => { setModelOpen(false); setSettingsOpen(true); }}><Settings /></Button></div>
                <p className="px-4 pb-1 pt-3 text-xs text-muted-foreground">A · ArTrail-deepseed</p>
                <div className="max-h-[330px] overflow-y-auto p-1.5">{modelNames.filter(m => m.toLowerCase().includes(search.toLowerCase())).map(m => <Button type="button" key={m} variant="ghost" className="h-9 w-full justify-between px-3 font-normal" onClick={() => { setModel(m); setModelOpen(false); }}>{m}{model === m && <Check />}</Button>)}{!modelNames.some(m => m.includes(search.toLowerCase())) && <p className="p-3 text-sm text-muted-foreground">没有匹配的模型</p>}</div>
                <Button type="button" variant="ghost" className="h-11 w-full justify-between rounded-none border-t border-border px-4 font-normal" onClick={() => setDepthView(true)}>Thinking depth<span className="flex items-center gap-1 text-muted-foreground">{depth}<ChevronRight /></span></Button>
              </>}
            </PopoverContent>
          </Popover>
          <Button type="submit" size="icon" aria-label="发送创作内容" title="发送" disabled={!text.trim()} className="size-10 shrink-0 rounded-full"><ArrowUp /></Button>
        </div>
      </div>
    </form>
    <div className="mt-2 flex justify-center gap-3 text-muted-foreground"><Button variant="ghost" onClick={() => { setText(""); setFiles([]); setNotice(""); textarea.current?.focus(); }}><Clapperboard />空白项目</Button><Button variant="ghost" onClick={() => { setText("创作一个在森林中探索的互动故事，每个选择都会改变故事的走向。"); textarea.current?.focus(); }}><Lightbulb />灵感</Button></div>
    {notice && <p role="status" className="mt-2 text-center text-sm text-muted-foreground">{notice}</p>}
  </section>
    <ProviderSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
  </div>;
}