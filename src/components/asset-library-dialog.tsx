import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, FolderOpen, Grid2X2, Image, List, Loader2, Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterLibraryAssets, type LibraryAsset, type LibraryFilters } from "@/lib/asset-library";

const defaults: LibraryFilters = { search: "", project: "all", kind: "all", source: "all", days: "all", sort: "newest" };
function Filter({ label, value, options, onChange }: { label: string; value: string; options: { value: string; name: string }[]; onChange: (value: string) => void }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="h-8 w-auto min-w-[110px] max-w-[180px] gap-2 border-0 bg-secondary text-xs shadow-none"><SelectValue /></SelectTrigger><SelectContent>{options.map(option => <SelectItem key={option.value} value={option.value}>{option.name}</SelectItem>)}</SelectContent></Select>;
}
export function AssetLibraryDialog({ open, onOpenChange, localAssets, onAdd, actionLabel = "添加到画布" }: { open: boolean; onOpenChange: (open: boolean) => void; localAssets: LibraryAsset[]; onAdd: (assets: LibraryAsset[]) => void; actionLabel?: string }) {
  const [filters, setFilters] = useState(defaults);
  const [selected, setSelected] = useState<string[]>([]);
  const [view, setView] = useState("grid");
  const { data, isPending, error, refetch } = useQuery({ queryKey: ["asset-library"], enabled: open, queryFn: async () => {
    const [assets, games] = await Promise.all([supabase.from("game_assets").select("id, name, kind, url, game_id, created_at").order("created_at", { ascending: false }), supabase.from("games").select("id, title")]);
    if (assets.error || games.error) throw new Error("资产加载失败，请重试。");
    const titles = new Map(games.data?.map(game => [game.id, game.title]));
    return (assets.data ?? []).map((asset): LibraryAsset => ({ id: asset.id, name: asset.name, kind: asset.kind, url: asset.url, gameId: asset.game_id, project: titles.get(asset.game_id) ?? "游戏项目", createdAt: asset.created_at, source: "cloud" }));
  } });
  const all = useMemo(() => [...(data ?? []), ...localAssets.filter(local => !data?.some(asset => asset.id === local.id))], [data, localAssets]);
  const filtered = filterLibraryAssets(all, filters);
  const chosen = all.filter(asset => selected.includes(asset.id));
  const update = (key: keyof LibraryFilters, value: string) => setFilters(current => ({ ...current, [key]: value }));
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const changeOpen = (value: boolean) => { onOpenChange(value); if (!value) { setSelected([]); setFilters(defaults); } };
  return <Dialog open={open} onOpenChange={changeOpen}><DialogContent className="flex h-[min(860px,90dvh)] w-[calc(100vw-24px)] max-w-[1320px] flex-col gap-0 overflow-hidden rounded-lg p-0">
    <header className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-4 pr-12"><FolderOpen className="size-5 text-project-mint" /><DialogTitle>所有资产 <span className="ml-2 text-sm font-normal text-muted-foreground">({all.length})</span></DialogTitle><DialogDescription className="sr-only">从资产库选择图片添加到当前画布</DialogDescription></header>
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-4 py-3">
      <Button variant="secondary" size="sm" className="gap-1.5"><Image className="size-3.5" />图片</Button>
      <Filter label="资产来源" value={filters.source} onChange={value => update("source", value)} options={[{ value: "all", name: "全部来源" }, { value: "cloud", name: "游戏资产" }, { value: "device", name: "本机画布" }]} />
      <Filter label="项目筛选" value={filters.project} onChange={value => update("project", value)} options={[{ value: "all", name: "全部项目" }, ...Array.from(new Map(all.map(asset => [asset.gameId, asset.project])).entries()).map(([value, name]) => ({ value, name }))]} />
      <Filter label="资产类型" value={filters.kind} onChange={value => update("kind", value)} options={[{ value: "all", name: "全部类型" }, ...Array.from(new Set(all.map(asset => asset.kind))).map(kind => ({ value: kind, name: kind }))]} />
      <Filter label="时间范围" value={filters.days} onChange={value => update("days", value)} options={[{ value: "all", name: "时间范围" }, { value: "1", name: "最近 24 小时" }, { value: "7", name: "最近 7 天" }, { value: "30", name: "最近 30 天" }]} />
      <Filter label="排序" value={filters.sort} onChange={value => update("sort", value)} options={[{ value: "newest", name: "最新优先" }, { value: "oldest", name: "最早优先" }, { value: "name", name: "名称排序" }]} />
      <div className="relative min-w-[160px] flex-1"><Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" /><Input aria-label="搜索资产" placeholder="搜索资产…" value={filters.search} onChange={event => update("search", event.target.value)} className="h-8 pl-8 text-xs" /></div>
      <div className="flex"><Button size="icon" variant={view === "grid" ? "secondary" : "ghost"} className="size-8" title="图片网格" aria-label="图片网格" onClick={() => setView("grid")}><Grid2X2 /></Button><Button size="icon" variant={view === "list" ? "secondary" : "ghost"} className="size-8" title="列表视图" aria-label="列表视图" onClick={() => setView("list")}><List /></Button></div>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
      {isPending ? <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div> : error ? <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-muted-foreground"><p role="alert">资产加载失败，请重试。</p><Button variant="secondary" onClick={() => void refetch()}>重试</Button></div> : !filtered.length ? <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground"><SlidersHorizontal className="size-7" /><p className="text-sm">{all.length ? "没有匹配的资产" : "暂无可用资产"}</p>{all.length > 0 && <Button variant="secondary" size="sm" onClick={() => setFilters(defaults)}>清除筛选</Button>}</div> : <div className={view === "grid" ? "columns-2 gap-4 sm:columns-3 lg:columns-5 xl:columns-6" : "space-y-2"}>
        {filtered.map(asset => <Button key={asset.id} variant="ghost" aria-label={`选择库资产：${asset.name} · ${asset.project}`} aria-pressed={selected.includes(asset.id)} onClick={() => toggle(asset.id)} className={`group relative h-auto w-full min-w-0 whitespace-normal rounded-lg p-0 text-left ${view === "grid" ? "mb-4 block break-inside-avoid" : "flex justify-start gap-4 border border-border p-2"}`}>
          <div className={`relative overflow-hidden rounded-lg border ${selected.includes(asset.id) ? "border-build ring-2 ring-build" : "border-border"} ${view === "grid" ? "w-full" : "size-16 shrink-0"}`}><img src={asset.url} alt={asset.name} loading="lazy" className={view === "grid" ? "max-h-[280px] min-h-[100px] w-full object-contain bg-secondary" : "size-full object-contain bg-secondary"} /><span className={`absolute right-2 top-2 flex size-5 items-center justify-center rounded border ${selected.includes(asset.id) ? "border-build bg-build text-image-selection-foreground" : "border-border bg-popover opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>{selected.includes(asset.id) && <Check className="size-3" />}</span></div>
          <div className={`min-w-0 ${view === "grid" ? "px-1 pt-2" : "flex-1"}`}><p className="truncate text-xs font-medium" title={asset.name}>{asset.name}</p><p className="mt-1 truncate text-[10px] font-normal text-muted-foreground" title={asset.project}>{asset.project} · {asset.kind}</p><p className="mt-1 text-[10px] font-normal text-muted-foreground">{asset.source === "device" ? "本机画布" : new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(asset.createdAt))}</p></div>
        </Button>)}
      </div>}
    </div>
    <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-background px-4 py-3"><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">已选 {chosen.length} 项</span><Button variant="ghost" size="sm" disabled={!filtered.length} onClick={() => setSelected(current => Array.from(new Set([...current, ...filtered.map(asset => asset.id)])))}>全选当前结果</Button>{selected.length > 0 && <Button variant="ghost" size="sm" onClick={() => setSelected([])}>清空</Button>}</div><div className="ml-auto flex gap-2"><Button variant="ghost" size="sm" onClick={() => changeOpen(false)}>取消</Button><Button size="sm" disabled={!chosen.length} onClick={() => { onAdd(chosen); changeOpen(false); }}>{actionLabel}{chosen.length ? ` (${chosen.length})` : ""}</Button></div></footer>
  </DialogContent></Dialog>;
}