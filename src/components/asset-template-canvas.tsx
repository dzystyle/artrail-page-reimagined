import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ReactFlow, ReactFlowProvider, Background, BackgroundVariant, Handle, Position, useNodesState, useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { get, set } from "idb-keyval";
import { Download, FolderOpen, Hand, Loader2, Maximize, MousePointer2, Upload, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AssetLibraryDialog } from "@/components/asset-library-dialog";
import { assetPresetImages } from "@/lib/asset-preset-images";
import { getAssetPreset, getPixelStyle } from "@/lib/asset-presets";
import { streamImage } from "@/lib/stream-image";

type Frame = { src: string; final: boolean; reference: string };
type CanvasState = { reference: string; results: Record<string, Frame>; positions: Record<string, { x: number; y: number }> };
type Tile = Node<{ title: string; src: string; reference: boolean; sample: boolean; busy: boolean; partial: boolean; stale: boolean; output: number }, "assetTile">;
const Actions = createContext({ upload: () => {}, library: () => {}, generate: (_index: number) => {} });
function AssetTile({ data, selected }: NodeProps<Tile>) {
  const actions = useContext(Actions);
  return <div className={`w-[300px] rounded-lg border bg-card p-3 ${selected ? "border-build ring-1 ring-build" : "border-border"}`}>
    {!data.reference && <Handle type="target" position={Position.Left} />}
    <div className="mb-2 flex items-center justify-between gap-2"><span className="text-xs font-medium">{data.title}</span><span className="text-[10px] text-muted-foreground">{data.reference ? "参考图" : data.busy ? "生成中" : data.sample ? "示例" : data.stale ? "旧参考图" : "已生成"}</span></div>
    <img src={data.src} alt={data.reference ? "参考图片" : data.title} draggable={false} className={`aspect-square w-full rounded-md bg-secondary object-contain transition-[filter] ${data.partial ? "blur-2xl" : "blur-0"}`} />
    <div className="nodrag mt-3 flex gap-2">{data.reference ? <><Button variant="secondary" size="sm" onClick={actions.upload}><Upload />更换图片</Button><Button variant="ghost" size="sm" aria-label="从资产库选择参考图" title="从资产库选择参考图" onClick={actions.library}><FolderOpen /></Button></> : <><Button variant="secondary" size="sm" disabled={data.busy} onClick={() => actions.generate(data.output)}>{data.busy ? <Loader2 className="animate-spin" /> : <WandSparkles />}{data.sample ? "生成" : "重新生成"}</Button>{!data.sample && !data.partial && <Button asChild variant="ghost" size="sm"><a href={data.src} download={`${data.title}.png`} aria-label={`下载${data.title}`} title="下载"><Download /></a></Button>}</>}</div>
    {data.reference && <Handle type="source" position={Position.Right} />}
  </div>;
}
const nodeTypes = { assetTile: AssetTile };
export function AssetTemplateCanvas({ template, density }: { template: string; density: string }) {
  return <ReactFlowProvider><Workspace key={`${template}-${density}`} template={template} density={density} /></ReactFlowProvider>;
}
function Workspace({ template, density }: { template: string; density: string }) {
  const preset = getAssetPreset(template);
  const style = getPixelStyle(density);
  const sample = assetPresetImages[template] ?? "";
  const key = `artrail-asset-template-${template}-${density}`;
  const [snapshot, setSnapshot] = useState<CanvasState>({ reference: sample, results: {}, positions: {} });
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const running = useRef(false);
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [library, setLibrary] = useState(false);
  const [hand, setHand] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Tile>([]);
  useEffect(() => { let active = true; void get<CanvasState>(key).then(saved => { if (!active) return; if (saved) setSnapshot(saved); setReady(true); }).catch(() => { if (active) { setError("无法读取本机画布。"); setReady(true); } }); return () => { active = false; }; }, [key]);
  useEffect(() => { if (!ready) return; void set(key, snapshot).catch(() => setError("本机保存失败，请下载生成图片。")); }, [snapshot, key, ready]);
  useEffect(() => {
    if (!ready || !preset) return;
    const tiles: Tile[] = [{ id: "reference", type: "assetTile", position: snapshot.positions["reference"] ?? { x: 0, y: 160 }, data: { title: `${preset.name} · ${style?.name}`, src: snapshot.reference, reference: true, sample: false, busy: false, partial: false, stale: false, output: -1 } }, ...preset.outputs.map((title, index): Tile => {
      const result = snapshot.results[String(index)];
      return { id: String(index), type: "assetTile", position: snapshot.positions[String(index)] ?? { x: 410 + (index % 2) * 390, y: Math.floor(index / 2) * 440 }, data: { title, src: result?.src ?? sample, reference: false, sample: !result, busy: busy === index, partial: !!result && !result.final, stale: !!result && result.reference !== snapshot.reference, output: index } };
    })];
    setNodes(current => tiles.map(tile => ({ ...tile, selected: current.find(node => node.id === tile.id)?.selected })));
  }, [snapshot, busy, ready, preset, style, sample, setNodes]);
  const replace = (src: string) => { setSnapshot(current => ({ ...current, reference: src })); setError(""); };
  async function generate(index: number) {
    if (running.current) return;
    running.current = true; setBusy(index); setError("");
    const reference = snapshot.reference;
    const prior = snapshot.results[String(index)];
    try {
      const response = await fetch(reference);
      if (!response.ok) throw new Error("无法读取参考图片，请重新上传。");
      const blob = await response.blob();
      const form = new FormData(); form.set("image", blob, "reference.png"); form.set("template", template); form.set("density", density); form.set("output", String(index)); form.set("description", description);
      await streamImage("/api/public/asset-template-image", form, (src, final) => setSnapshot(current => ({ ...current, results: { ...current.results, [String(index)]: { src, final, reference } } })));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "生成失败，请重试。");
      setSnapshot(current => { const results = { ...current.results }; if (prior) results[String(index)] = prior; else delete results[String(index)]; return { ...current, results }; });
    } finally { running.current = false; setBusy(null); }
  }
  return <Actions.Provider value={{ upload: () => file.current?.click(), library: () => setLibrary(true), generate: index => { void generate(index); } }}>
    <div className="game-flow relative flex min-h-0 flex-1 flex-col bg-surface-deep" aria-label="资产模板画布">
      <div className="z-10 flex shrink-0 flex-wrap items-center gap-3 border-b border-border bg-background px-5 py-3"><span className="text-sm font-medium">{preset?.name} / {style?.name}</span><Textarea aria-label="资产描述" placeholder="描述角色、服装、颜色或需要调整的细节…" value={description} onChange={event => setDescription(event.target.value)} maxLength={2000} className="min-h-10 flex-1 resize-none text-sm sm:max-w-[540px]" rows={1} /><span className="text-xs text-muted-foreground">{busy !== null ? "正在生成…" : "示例画布"}</span></div>
      {error && <p role="alert" className="z-10 border-b border-border bg-card px-5 py-3 text-sm text-destructive">{error}</p>}
      <div className="min-h-0 flex-1">{ready && <ReactFlow nodes={nodes} edges={(preset?.outputs ?? []).map((_, index) => ({ id: `edge-${index}`, source: "reference", target: String(index), type: "default" }))} nodeTypes={nodeTypes} onNodesChange={onNodesChange} onNodeDragStop={(_, node) => setSnapshot(current => ({ ...current, positions: { ...current.positions, [node.id]: node.position } }))} nodesDraggable={!hand} panOnDrag={hand ? true : [1, 2]} fitView fitViewOptions={{ padding: 0.12, maxZoom: 0.85 }} minZoom={0.15} maxZoom={2} deleteKeyCode={null} proOptions={{ hideAttribution: true }}><Background variant={BackgroundVariant.Dots} gap={22} size={1} /></ReactFlow>}</div>
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-border bg-popover p-1 shadow-lg"><Button size="icon" variant={!hand ? "secondary" : "ghost"} title="选择" aria-label="选择" onClick={() => setHand(false)}><MousePointer2 /></Button><Button size="icon" variant={hand ? "secondary" : "ghost"} title="移动画布" aria-label="移动画布" onClick={() => setHand(true)}><Hand /></Button><Button size="icon" variant="ghost" title="适应画布" aria-label="适应画布" onClick={() => void fitView({ padding: 0.12 })}><Maximize /></Button><Button size="icon" variant="ghost" title="缩小" aria-label="缩小" onClick={() => void zoomOut()}>−</Button><Button size="icon" variant="ghost" title="放大" aria-label="放大" onClick={() => void zoomIn()}>+</Button></div>
      <input ref={file} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" aria-label="上传参考图片" onChange={event => { const chosen = event.target.files?.[0]; event.target.value = ""; if (!chosen) return; if (chosen.size > 20 * 1024 * 1024) { setError("请选择不超过 20 MB 的图片。"); return; } const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === "string") replace(reader.result); }; reader.readAsDataURL(chosen); }} />
      <AssetLibraryDialog open={library} onOpenChange={setLibrary} localAssets={[]} onAdd={assets => { const selected = assets[0]; if (selected) replace(selected.url); }} />
    </div>
  </Actions.Provider>;
}