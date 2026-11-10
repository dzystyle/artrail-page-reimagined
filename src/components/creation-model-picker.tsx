import { useState } from "react";
import { ArrowLeft, Box, Check, ChevronDown, ChevronRight, KeyRound, Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AddProviderDialog, type ProviderDraft } from "@/components/add-provider-dialog";

const modelNames = ["deepseek-flash", "deepseek-v4-flash", "deepseek-v4-pro", "gemini-3.5-flash", "gemini-3.8-flash", "gemini-4-argon", "gpt-5.5", "gpt-5.6-luna", "gpt-5.6-sol"];
const depths = ["Off", "Low", "Medium", "High"];
const initialProviders: ({ name: string; detail: string; enabled: boolean } & Partial<ProviderDraft>)[] = [
  { name: "ArTrail-deepseed", detail: "自定义端点 · 语言 · 图像", enabled: true },
  { name: "火山引擎方舟", detail: "API 密钥 · 图像 · 视频", enabled: true },
  { name: "Hyper3D", detail: "API 密钥 · 3D", enabled: true },
];

export function ProviderSettings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [providers, setProviders] = useState(initialProviders);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("全部");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [notice, setNotice] = useState("");
  return <><Dialog open={open && !editing} onOpenChange={onOpenChange}>
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
            <Button variant="secondary" onClick={() => { setName(""); setEditing(true); }}><Plus />添加提供商</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-1">{["全部", "语言", "图像", "视频", "3D", "声音"].map(t => <Button key={t} variant={tab === t ? "secondary" : "ghost"} size="sm" onClick={() => setTab(t)}>{t}</Button>)}</div>
          <h3 className="mb-2 mt-6 text-sm font-medium">默认模型</h3>
          <div className="divide-y divide-border rounded-lg bg-card text-sm">
            <div className="flex items-center justify-between p-3"><span>聊天模型</span><span className="text-muted-foreground">在输入框中选择</span></div>
            {[{ label: "图像", models: ["自动 · 豆宝 Seedream 5.0 Pro", "不指定"] }, { label: "视频", models: ["自动 · 豆宝种子舞 2.5", "不指定"] }].map(row => <label key={row.label} className="flex flex-wrap items-center justify-between gap-2 p-3"><span>{row.label}</span><select aria-label={`${row.label}默认模型`} className="max-w-full rounded-md border border-border bg-background p-1.5">{row.models.map(m => <option key={m}>{m}</option>)}</select></label>)}
            <div className="flex justify-between p-3"><span>3D</span><span className="text-muted-foreground">Hyper3D</span></div>
          </div>
          <h3 className="mb-2 mt-6 text-sm font-medium">提供商</h3>
          <div className="divide-y divide-border rounded-lg bg-card">{providers.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (tab === "全部" || p.detail.includes(tab))).map(p => <div key={p.name} className="flex items-center gap-3 p-3"><Box className="size-5 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="break-words text-sm">{p.name}</p><p className="text-xs text-muted-foreground">{p.detail}</p></div><Switch aria-label={`启用 ${p.name}`} checked={p.enabled} onCheckedChange={enabled => setProviders(list => list.map(item => item.name === p.name ? { ...item, enabled } : item))} className="data-[state=checked]:bg-build" /><Button variant="ghost" size="icon" aria-label={`配置 ${p.name}`} title="配置提供商" onClick={() => { setName(p.name); setEditing(true); }}><Settings /></Button></div>)}</div>
          <h3 className="mb-2 mt-6 text-sm font-medium">热门提供商</h3>
          {["OpenAI", "Anthropic", "OpenRouter"].filter(p => p.toLowerCase().includes(search.toLowerCase())).map(p => <div key={p} className="flex items-center justify-between border-b border-border py-3 text-sm"><span>{p}</span><Button variant="secondary" size="sm" onClick={() => { setName(p); setEditing(true); }}>配置</Button></div>)}
          {notice && <p role="status" className="mt-4 text-sm text-muted-foreground">{notice}</p>}
        </div>
      </div>
    </DialogContent>
  </Dialog>{open && editing && <AddProviderDialog initial={providers.find(provider => provider.name === name) ?? { name }} onClose={() => setEditing(false)} onSave={draft => {
    setProviders(list => {
      const existing = list.find(provider => provider.name === name || provider.name === draft.name);
      const updated = { ...draft, detail: `${draft.protocol} · 语言 · ${draft.models.filter(model => model.enabled).length} 个模型`, enabled: existing?.enabled ?? false };
      return existing ? list.map(provider => provider === existing ? updated : provider) : [...list, updated];
    });
    setEditing(false);
    setNotice("设置已暂存于本次页面；尚未连接模型服务，密钥未保存。");
  }} />}</>;
}

export function CreationModelPicker({ model, depth, onModelChange, onDepthChange, compact = false }: {
  model: string; depth: string; onModelChange: (model: string) => void; onDepthChange: (depth: string) => void; compact?: boolean;
}) {
  const [modelOpen, setModelOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [depthView, setDepthView] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  return <>
          <Popover open={modelOpen} onOpenChange={v => { setModelOpen(v); if (!v) { setDepthView(false); setSearch(""); } }}><PopoverTrigger asChild><Button type="button" aria-label="选择创作模型" variant="ghost" className={compact ? "h-7 min-w-0 max-w-full gap-1 px-1 text-[10px] text-muted-foreground [&_svg]:size-3" : "min-w-0 gap-1.5 px-2 text-muted-foreground sm:gap-2"}><span className="rounded bg-secondary px-1.5 text-xs">A</span><span className="truncate text-foreground">{model}</span><span className="text-muted-foreground">{depth}</span><ChevronDown /></Button></PopoverTrigger>
            <PopoverContent align="end" side="bottom" className="w-[min(315px,calc(100vw-32px))] rounded-lg p-0">
              {depthView ? <><Button type="button" variant="ghost" className="h-12 w-full justify-start rounded-none border-b border-border px-4 text-base" onClick={() => setDepthView(false)}><ArrowLeft />Thinking depth</Button><div className="p-1.5">{depths.map(d => <Button type="button" variant="ghost" key={d} className="h-11 w-full justify-between px-3 text-base font-normal" onClick={() => { onDepthChange(d); setModelOpen(false); setDepthView(false); }}>{d}{depth === d && <Check />}</Button>)}</div></> : <>
                <div className="flex items-center gap-2 border-b border-border px-3 py-2"><Search className="size-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} aria-label="搜索模型" placeholder="Search models" className="h-8 min-w-0 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" /><Button type="button" variant="ghost" size="icon" aria-label="提供商设置" title="提供商设置" onClick={() => { setModelOpen(false); setSettingsOpen(true); }}><Settings /></Button></div>
                <p className="px-4 pb-1 pt-3 text-xs text-muted-foreground">A · ArTrail-deepseed</p>
                <div className="max-h-[330px] overflow-y-auto p-1.5">{modelNames.filter(m => m.toLowerCase().includes(search.toLowerCase())).map(m => <Button type="button" key={m} variant="ghost" className="h-9 w-full justify-between px-3 font-normal" onClick={() => { onModelChange(m); setModelOpen(false); }}>{m}{model === m && <Check />}</Button>)}{!modelNames.some(m => m.includes(search.toLowerCase())) && <p className="p-3 text-sm text-muted-foreground">没有匹配的模型</p>}</div>
                <Button type="button" variant="ghost" className="h-11 w-full justify-between rounded-none border-t border-border px-4 font-normal" onClick={() => setDepthView(true)}>Thinking depth<span className="flex items-center gap-1 text-muted-foreground">{depth}<ChevronRight /></span></Button>
              </>}
            </PopoverContent>
          </Popover>
    <ProviderSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
  </>;
}
