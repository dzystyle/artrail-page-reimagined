import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Background, BackgroundVariant, ReactFlow, ReactFlowProvider, useNodesState, useReactFlow, type NodeProps } from "@xyflow/react";
import { get, set } from "idb-keyval";
import { Box, Crop, Download, Eraser, Expand, FileText, Grid2X2, Layers, Loader2, ScanFace, SquareUserRound, Trash2, Type, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CanvasAddMenu } from "@/components/canvas-add-menu";
import { mergeCanvasAssets, storedCanvasNodes, type CanvasNode, type CanvasSnapshot } from "@/lib/canvas-nodes";
import { streamImage } from "@/lib/stream-image";
import { AssetLibraryDialog } from "@/components/asset-library-dialog";
import type { LibraryAsset } from "@/lib/asset-library";

type CanvasAsset = { id: string; name: string; kind: string; url: string };
const tools = [{ name: "放大", icon: Expand }, { name: "去背景", icon: ScanFace }, { name: "扩图", icon: SquareUserRound }, { name: "消除笔", icon: Eraser }, { name: "编辑元素", icon: Layers }, { name: "编辑文字", icon: Type }, { name: "裁剪", icon: Crop }, { name: "调效果", icon: WandSparkles }, { name: "多角度", icon: Box }, { name: "快速切分", icon: Grid2X2 }];

function ImageNode({ data, selected }: NodeProps<CanvasNode>) {
  return <div className="w-[260px]" aria-label={`画布素材：${data.name}`}>
    <div className="mb-2 flex items-center justify-between gap-2 text-xs text-muted-foreground"><span className="truncate">{data.name}</span><span className="shrink-0 text-[10px]">{data.kind}</span></div>
    <div className="relative">
      <Button variant="ghost" aria-label={`选择资产：${data.name}`} aria-pressed={selected} className={`block aspect-square h-auto w-full rounded-none p-0 hover:bg-transparent ${selected ? "outline-2 outline-build" : ""}`}>
        {data.url ? <img draggable={false} src={data.url} alt={data.name} className={`size-full select-none object-contain transition-[filter] ${data.partial ? "blur-2xl" : "blur-0"}`} onLoad={event => { const image = event.currentTarget; data.onDimensions?.(`${image.naturalWidth} × ${image.naturalHeight}`); }} /> : <div className="flex size-full items-center justify-center bg-card"><Loader2 className="animate-spin text-muted-foreground" /></div>}
      </Button>
      {selected && <>{data.dimensions && <span className="pointer-events-none absolute right-0 top-0 -translate-y-full rounded-t bg-build px-2 py-1 text-[11px] text-image-selection-foreground">{data.dimensions}</span>}{["-left-1.5 -top-1.5", "-right-1.5 -top-1.5", "-bottom-1.5 -left-1.5", "-bottom-1.5 -right-1.5"].map(position => <span key={position} className={`pointer-events-none absolute size-3 rounded-full border-2 border-build bg-popover ${position}`} />)}</>}
    </div>
  </div>;
}
function DocumentNode({ data, selected }: NodeProps<CanvasNode>) {
  return <div className={`w-[300px] rounded-lg border bg-card p-4 ${selected ? "border-build outline-1 outline-build" : "border-border"}`} aria-label={`画布文档：${data.name}`}>
    <div className="mb-3 flex items-center justify-between gap-2"><span className="flex min-w-0 items-center gap-2 text-sm font-medium"><FileText className="size-4 shrink-0 text-project-mint" /><span className="truncate">{data.name}</span></span><Button variant="ghost" size="icon" className="nodrag size-7" aria-label={`编辑文档：${data.name}`} title="编辑文档" onClick={data.onEdit}><Type /></Button></div>
    <p className="line-clamp-10 min-h-20 whitespace-pre-wrap text-xs leading-6 text-muted-foreground">{data.content || ""}</p>
  </div>;
}
const DesignContext = createContext<ReactNode>(null);
const DesignInteractionContext = createContext<(value: boolean) => void>(() => {});
function DesignNode() { return <div className="w-[300px]">{useContext(DesignContext)}</div>; }
const nodeTypes = { image: ImageNode, document: DocumentNode, design: DesignNode };

export function GameAssetCanvas(props: { gameId: string; assets: CanvasAsset[]; children?: ReactNode; filters?: ReactNode; visibleKind?: string }) {
  return <DesignContext.Provider value={props.children}><ReactFlowProvider><CanvasWorkspace {...props} /></ReactFlowProvider></DesignContext.Provider>;
}
function CanvasWorkspace({ gameId, assets, children, filters, visibleKind = "全部" }: { gameId: string; assets: CanvasAsset[]; children?: ReactNode; filters?: ReactNode; visibleKind?: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CanvasNode>([]);
  const { fitView, screenToFlowPosition } = useReactFlow<CanvasNode>();
  const [hand, setHand] = useState(false);
  const [ready, setReady] = useState(false);
  const [editor, setEditor] = useState<"image" | "document" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef(nodes);
  const removedIds = useRef<string[]>([]);
  latest.current = nodes;
  const storageKey = `artrail-canvas:${gameId}`;

  useEffect(() => {
    let active = true;
    void get<CanvasNode[] | CanvasSnapshot>(storageKey).then(saved => {
      if (!active) return;
      const initial = Array.isArray(saved) ? saved : saved?.nodes ?? [];
      removedIds.current = Array.isArray(saved) ? [] : saved?.removedIds ?? [];
      const withDesign: CanvasNode[] = children && !removedIds.current.includes("design") && !initial.some(n => n.id === "design") ? [{ id: "design", type: "design", position: { x: 0, y: 0 }, data: { name: gameId, kind: "设计" } }, ...initial] : initial;
      setNodes(mergeCanvasAssets(withDesign, assets, !!children, removedIds.current));
      setReady(true);
    }).catch(() => { if (active) { setNodes(mergeCanvasAssets([], assets, !!children)); setReady(true); setStorageError("本机保存不可用，刷新后将无法保留新内容。"); } });
    return () => { active = false; };
  }, [storageKey]);
  useEffect(() => { if (ready) setNodes(current => mergeCanvasAssets(current, assets, !!children, removedIds.current)); }, [assets.map(a => a.id).join(","), ready]);
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => { void set(storageKey, { nodes: storedCanvasNodes(nodes), removedIds: removedIds.current }).catch(() => setStorageError("本机保存失败，请勿刷新页面。")); }, 250);
    return () => window.clearTimeout(timer);
  }, [nodes, ready, storageKey]);

  const openEditor = (kind: "image" | "document", id?: string) => {
    const node = nodes.find(n => n.id === id);
    setEditingId(id ?? null); setTitle(node?.data.name ?? ""); setContent(node?.data.content ?? ""); setError(""); setEditor(kind);
  };
  const position = () => {
    const bounds = host.current?.getBoundingClientRect();
    const center = bounds ? screenToFlowPosition({ x: bounds.x + bounds.width / 2 - 100, y: bounds.y + bounds.height / 2 - 100 }) : { x: 100, y: 100 };
    let candidate = center;
    for (let i = 0; i < 100; i++) {
      if (!nodes.some(n => Math.abs(n.position.x - candidate.x) < 310 && Math.abs(n.position.y - candidate.y) < 340)) return candidate;
      candidate = { x: center.x + (i % 3) * 340, y: center.y + (Math.floor(i / 3) + 1) * 370 };
    }
    return candidate;
  };
  const submit = async () => {
    if (!content.trim() || working) return;
    if (editor === "document") {
      const data = { name: title.trim() || "未命名文档", kind: "文档", content };
      if (editingId) setNodes(current => current.map(node => node.id === editingId ? { ...node, data } : node));
      else setNodes(current => [...current, { id: crypto.randomUUID(), type: "document", position: position(), data, selected: true }]);
      setEditor(null); return;
    }
    const id = crypto.randomUUID();
    const node: CanvasNode = { id, type: "image", position: position(), data: { name: title.trim() || content.trim().slice(0, 30), kind: "生成图片", partial: true }, selected: true };
    setNodes(current => [...current.map(n => ({ ...n, selected: false })), node]);
    setWorking(true); setError("");
    try {
      await streamImage("/api/public/canvas-image", { gameId, prompt: content }, (url, final) => setNodes(current => current.map(n => n.id === id ? { ...n, data: { ...n.data, url, partial: !final } } : n)));
      setEditor(null);
      void fitView({ padding: 0.25, maxZoom: 1 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "图片生成失败。");
      setNodes(current => current.filter(n => n.id !== id));
    } finally { setWorking(false); }
  };
  const selected = nodes.find(node => node.selected && node.type === "image");
  const localAssets: LibraryAsset[] = nodes.filter(node => node.type === "image" && node.data.url && !node.data.partial && !assets.some(asset => asset.id === node.id)).map(node => ({ id: node.id, name: node.data.name, kind: node.data.kind, url: node.data.url ?? "", gameId, project: "当前画布", createdAt: new Date().toISOString(), source: "device" }));
  const addLibraryAssets = (chosen: LibraryAsset[]) => {
    const start = position();
    setNodes(current => [...current.map(node => ({ ...node, selected: false })), ...chosen.map((asset, index): CanvasNode => ({ id: crypto.randomUUID(), type: "image", position: { x: start.x + index % 3 * 320, y: start.y + Math.floor(index / 3) * 350 }, data: { name: asset.name, kind: asset.kind, url: asset.url }, selected: true }))]);
    setHand(false);
  };
  const displayNodes = nodes.map(node => ({ ...node, hidden: (node.type === "design" && !children) || (visibleKind !== "全部" && node.data.kind !== visibleKind), data: { ...node.data, onEdit: () => openEditor("document", node.id), onDimensions: (value: string) => { if (latest.current.find(n => n.id === node.id)?.data.dimensions !== value) setNodes(current => current.map(n => n.id === node.id ? { ...n, data: { ...n.data, dimensions: value } } : n)); } } }));

  return <div ref={host} className="game-flow relative flex min-h-0 flex-1 flex-col overflow-hidden bg-surface-deep" aria-label="游戏资产画布">
    {filters && <div className="z-10 flex shrink-0 flex-wrap gap-1 border-b border-border bg-background px-4 py-2">{filters}</div>}
    {storageError && <p role="alert" className="absolute inset-x-4 top-20 z-30 bg-popover p-2 text-xs text-destructive">{storageError}</p>}
    {selected && <div role="toolbar" aria-label="图片工具" className={`absolute inset-x-3 z-20 flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg ${filters ? "top-16" : "top-3"}`}>
      {tools.map(tool => <Button key={tool.name} variant="ghost" size="sm" aria-disabled="true" title={`${tool.name}（仅展示）`} className="h-10 shrink-0 gap-2 px-3"><tool.icon />{tool.name}</Button>)}<span className="mx-1 h-7 shrink-0 border-l border-border" /><Button variant="ghost" size="icon" aria-label="下载图片" aria-disabled="true" title="下载图片（仅展示）" className="shrink-0"><Download /></Button><Button variant="ghost" size="icon" aria-label="删除图片" aria-disabled="true" title="删除图片（仅展示）" className="shrink-0 text-destructive"><Trash2 /></Button>
    </div>}
    <div className="min-h-0 flex-1">{ready && <ReactFlow nodes={displayNodes} edges={[]} nodeTypes={nodeTypes} onNodesChange={onNodesChange} nodesDraggable={!hand} panOnDrag={hand ? true : [1, 2]} selectionOnDrag={!hand} deleteKeyCode={editor || libraryOpen ? null : ["Delete", "Backspace"]} onBeforeDelete={async ({ nodes: deleting }) => ({ nodes: deleting.filter(node => !node.hidden && !node.data.partial), edges: [] })} onNodesDelete={deleting => {
      const ids = deleting.map(node => node.id);
      removedIds.current = Array.from(new Set([...removedIds.current, ...ids]));
      void set(storageKey, { nodes: storedCanvasNodes(latest.current.filter(node => !ids.includes(node.id))), removedIds: removedIds.current }).catch(() => setStorageError("本机保存失败，请勿刷新页面。"));
    }} fitView fitViewOptions={{ padding: 0.25, maxZoom: 1 }} minZoom={0.15} maxZoom={2.5} proOptions={{ hideAttribution: true }}><Background variant={BackgroundVariant.Dots} gap={22} size={1} /></ReactFlow>}</div>
    <CanvasAddMenu onCreate={kind => { if (kind === "library") setLibraryOpen(true); else openEditor(kind); }} hand={hand} onHand={setHand} onFit={() => void fitView({ padding: 0.25, maxZoom: 1 })} />
    <AssetLibraryDialog open={libraryOpen} onOpenChange={setLibraryOpen} localAssets={localAssets} onAdd={addLibraryAssets} />
    <Dialog open={editor !== null} onOpenChange={value => { if (!value && !working) setEditor(null); }}><DialogContent className="max-w-[calc(100vw-24px)] sm:max-w-lg">
      <DialogTitle>{editor === "image" ? "创建图片" : editingId ? "编辑文档" : "创建文档"}</DialogTitle><DialogDescription className="sr-only">{editor === "image" ? "输入图片描述" : "编辑 Markdown 文档"}</DialogDescription>
      <form onSubmit={event => { event.preventDefault(); void submit(); }} className="space-y-4">
        <label className="block space-y-2 text-sm"><span>名称</span><Input aria-label="素材名称" value={title} onChange={event => setTitle(event.target.value)} disabled={working} /></label>
        <label className="block space-y-2 text-sm"><span>{editor === "image" ? "图片描述" : "文档内容"}</span><Textarea aria-label={editor === "image" ? "图片描述" : "文档内容"} value={content} onChange={event => setContent(event.target.value)} maxLength={editor === "image" ? 4000 : undefined} className="min-h-44 resize-y" disabled={working} required /></label>
        {editor === "image" && <p className="text-xs text-muted-foreground">使用工作区 AI 积分 · 图片及画布内容保存到本机</p>}
        {error && <p role="alert" className="break-words text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2"><Button type="button" variant="ghost" disabled={working} onClick={() => setEditor(null)}>取消</Button><Button type="submit" disabled={working || !content.trim()}>{working && <Loader2 className="animate-spin" />}{working ? "正在生成…" : editor === "image" ? "生成图片" : "保存文档"}</Button></div>
      </form>
    </DialogContent></Dialog>
  </div>;
}
