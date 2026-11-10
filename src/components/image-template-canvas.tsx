import { useEffect, useState } from "react";
import { Background, BackgroundVariant, ReactFlow, ReactFlowProvider, useNodesInitialized, useNodesState, useReactFlow, useViewport, type Node, type NodeProps } from "@xyflow/react";
import { ArrowUp, ArrowUpRight, Bell, ChevronDown, Copy, Gem, Hand, ImagePlus, Layers, Link2, Lock, Maximize, MessageSquare, Minus, MousePointer2, PanelRightClose, Pencil, Plus, RotateCw, Search, Share2, Shapes, Sparkles, Type, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ImageTemplate } from "@/lib/image-templates";

type ImageNode = Node<{ image: string; title: string; size: string }, "templateImage">;
type Props = { template: ImageTemplate; samples: ImageTemplate[]; editingImage?: { id: string; image: string; title: string } | null; description: string; onDescriptionChange: (value: string) => void; onWorkspace: () => void; onClose: () => void };

function TemplateImage({ data, selected }: NodeProps<ImageNode>) {
  return <div className="w-[360px]">
    <div className="mb-2 flex items-center justify-between gap-3 text-[10px] text-muted-foreground"><span className="truncate">{data.title}</span><span className="flex shrink-0 items-center gap-2">{data.size}<Pencil className="size-3" /></span></div>
    <img src={data.image} alt={data.title} draggable={false} className={`aspect-square w-full rounded-lg bg-card object-contain ${selected ? "ring-2 ring-build" : ""}`} />
  </div>;
}
const nodeTypes = { templateImage: TemplateImage };
const soon = () => toast("该工具暂未接入");

function Canvas({ template, samples, editingImage, description, onDescriptionChange, onWorkspace, onClose }: Props) {
  const [hand, setHand] = useState(false);
  const [panel, setPanel] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setPanel(false); }, []);
  const [tab, setTab] = useState("图像");
  const [transparent, setTransparent] = useState(false);
  const [gif, setGif] = useState(false);
  const reference = samples[0] ?? template;
  const [nodes, setNodes, onNodesChange] = useNodesState<ImageNode>([
    { id: "reference", type: "templateImage", position: { x: 0, y: 0 }, data: { image: reference.image, title: `${reference.id}.webp`, size: "参考图" } },
    { id: "template", type: "templateImage", position: { x: 455, y: 0 }, data: { image: template.image, title: `模板创作 · ${template.title}`, size: "模板示例" } },
  ]);
  const { fitView, getNode, zoomIn, zoomOut } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  useEffect(() => {
    if (!editingImage) return;
    const id = `recent-${editingImage.id}`;
    setNodes(current => {
      const existing = current.some(node => node.id === id);
      const updated = current.map(node => ({ ...node, selected: node.id === id }));
      return existing ? updated : [...updated, {
        id, type: "templateImage", selected: true,
        position: { x: 455 * current.length, y: 0 },
        data: { image: editingImage.image, title: editingImage.title, size: "素材" },
      }];
    });
    setHand(false);
  }, [editingImage, setNodes]);
  useEffect(() => {
    if (!editingImage || !nodesInitialized) return;
    const id = `recent-${editingImage.id}`;
    if (!getNode(id)?.measured?.width) return;
    void fitView({ nodes: [{ id }], padding: 0.3, maxZoom: 1 });
  }, [editingImage, nodesInitialized, getNode, fitView]);
  const { zoom } = useViewport();
  const tools = [[ImagePlus, "添加图片"], [Sparkles, "智能工具"], [Shapes, "形状"], [ArrowUpRight, "箭头"], [Pencil, "画笔"], [Type, "文字"], [MessageSquare, "注释"], [Lock, "锁定"], [Copy, "复制"], [RotateCw, "历史记录"], [Upload, "导出"]] as const;
  return <div aria-label="图片模板画布" className="flex h-full min-h-0 w-full bg-background">
    <section className="game-flow relative min-w-0 flex-1 bg-surface-deep">
      <ReactFlow nodes={nodes} nodeTypes={nodeTypes} onNodesChange={onNodesChange} nodesDraggable={!hand} panOnDrag={hand ? true : [1, 2]} fitView fitViewOptions={{ padding: 0.16, maxZoom: 1 }} minZoom={0.15} maxZoom={3} deleteKeyCode={null} proOptions={{ hideAttribution: true }}>
        <Background variant={BackgroundVariant.Dots} gap={9} size={0.6} />
      </ReactFlow>
      <header className="absolute inset-x-0 top-0 z-10 flex h-16 items-center justify-between gap-3 bg-surface-deep/90 px-4">
        <div className="flex min-w-0 items-center gap-3"><Shapes className="hidden size-5 shrink-0 sm:block" /><div className="flex shrink-0 rounded-full border border-border bg-secondary p-1"><Button variant="ghost" className="h-6 rounded-full px-3 text-[10px]" onClick={onWorkspace}>工作台</Button><Button className="h-6 rounded-full px-3 text-[10px]" aria-pressed>画布</Button></div><span className="hidden truncate text-xs font-medium xl:block">{template.title}</span></div>
        <div className="flex shrink-0 items-center gap-1"><Button size="icon" variant="ghost" className="hidden size-8 lg:flex" aria-label="通知" title="通知" onClick={soon}><Bell className="size-4" /></Button><Button size="icon" variant="ghost" className="hidden size-8 lg:flex" aria-label="搜索画布" title="搜索" onClick={soon}><Search className="size-4" /></Button><span className="hidden items-center gap-1 rounded-full border border-border px-3 py-2 text-[10px] md:flex"><Gem className="size-3" />6<span className="ml-2 text-muted-foreground">开通会员</span></span><Button variant="outline" className="hidden h-8 rounded-full text-[10px] xl:flex" onClick={soon}><Share2 className="size-3" />分享</Button><Button size="icon" variant="ghost" className="size-8" aria-label="切换图像面板" title="图像面板" onClick={() => setPanel(value => !value)}><PanelRightClose className="size-4" /></Button><Button size="icon" variant="ghost" className="size-8" aria-label="关闭模板工作台" title="关闭" onClick={onClose}><X className="size-4" /></Button></div>
      </header>
      <div className="absolute bottom-3 left-3 z-10 hidden items-center gap-1 rounded-lg bg-background/90 p-1 lg:flex"><Button size="icon" variant={hand ? "secondary" : "ghost"} className="size-7" aria-label="移动画布" title="移动画布" onClick={() => setHand(value => !value)}><Hand className="size-3" /></Button><Button size="icon" variant="ghost" className="size-7" aria-label="适应画布" title="适应画布" onClick={() => void fitView({ padding: 0.16, maxZoom: 1 })}><Maximize className="size-3" /></Button><Button size="icon" variant="ghost" className="size-7" aria-label="缩小画布" title="缩小" onClick={() => void zoomOut()}><Minus className="size-3" /></Button><span className="w-10 text-center text-[10px]">{Math.round(zoom * 100)}%</span><Button size="icon" variant="ghost" className="size-7" aria-label="放大画布" title="放大" onClick={() => void zoomIn()}><Plus className="size-3" /></Button></div>
      <div className="absolute bottom-3 left-1/2 z-10 flex max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-popover px-2 py-1 shadow-lg"><Button size="icon" variant={hand ? "ghost" : "default"} className="size-7 shrink-0 rounded-full" aria-label="选择素材" title="选择素材" onClick={() => setHand(false)}><MousePointer2 className="size-4" /></Button>{tools.map(([Icon, title]) => <Button key={title} size="icon" variant="ghost" className="size-7 shrink-0" aria-label={title} title={title} onClick={soon}><Icon className="size-3.5" /></Button>)}</div>
    </section>
    {panel && <aside aria-label="画布图像面板" className="absolute inset-y-0 right-0 z-20 flex w-[min(340px,85%)] flex-col border-l border-border bg-background p-3 shadow-lg md:static md:z-auto md:w-[28%] md:min-w-[280px] md:max-w-[380px] md:shadow-none">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border pb-3"><div className="flex rounded-full bg-secondary p-1">{["对话", "图像", "图层"].map(value => <Button key={value} variant={tab === value ? "outline" : "ghost"} onClick={() => setTab(value)} className="h-6 rounded-full px-3 text-[10px]">{value}</Button>)}</div><Button size="icon" variant="ghost" className="size-7" aria-label="收起图像面板" title="收起" onClick={() => setPanel(false)}><PanelRightClose className="size-3.5" /></Button></div>
      <div className="min-h-0 flex-1 overflow-y-auto py-4">{tab === "图层" ? <div className="space-y-2">{nodes.map(node => <Button key={node.id} variant="secondary" className="h-auto w-full justify-start whitespace-normal p-2 text-xs" onClick={() => void fitView({ nodes: [{ id: node.id }], padding: 0.2 })}><Layers className="size-4 shrink-0" />{node.data.title}</Button>)}</div> : <><p className="ml-auto max-w-[90%] rounded-lg border border-border bg-secondary p-3 text-xs leading-5">{description || `使用参考图片创作${template.title}，保留主体与构图。`}</p><Button variant="ghost" className="mt-8 block h-auto w-[70%] overflow-hidden rounded-lg p-0" onClick={() => void fitView({ nodes: [{ id: "template" }], padding: 0.25 })}><img src={template.image} alt={`${template.title}预览`} className="aspect-square w-full bg-card object-contain" /></Button><div className="mt-2 flex gap-2"><Button size="icon" variant="ghost" className="size-6" aria-label="复制图片" title="复制图片" onClick={soon}><Copy className="size-3" /></Button><Button size="icon" variant="ghost" className="size-6" aria-label="重新生成" title="重新生成" onClick={soon}><RotateCw className="size-3" /></Button></div></>}</div>
      <div className="shrink-0 rounded-lg border border-input bg-card p-2"><div className="flex gap-2"><textarea aria-label="画布修改描述" value={description} onChange={event => onDescriptionChange(event.target.value)} placeholder="描述你想创作的游戏素材…" className="min-h-14 min-w-0 flex-1 resize-none bg-transparent text-xs leading-5 outline-none" /><div className="w-16 shrink-0 rounded-lg border border-border bg-secondary p-1 text-center"><img src={template.image} alt="当前模板" className="mx-auto h-6 w-10 rounded object-cover" /><span className="mt-1 block truncate text-[8px]">{template.title}</span></div></div><div className="mt-2 flex flex-wrap items-center gap-2 text-[9px] text-muted-foreground"><Button size="icon" variant="secondary" className="size-6 rounded-full" aria-label="添加参考图" title="添加参考图" onClick={soon}><Plus className="size-3" /></Button><Button size="icon" variant="ghost" className="size-5" aria-label="模型设置" title="模型设置" onClick={soon}><Shapes className="size-3" /></Button><Button size="icon" variant="ghost" className="size-5" aria-label="链接" title="链接" onClick={soon}><Link2 className="size-3" /></Button><label className="flex items-center gap-1"><Switch checked={transparent} onCheckedChange={setTransparent} className="h-3 w-6" />透明背景</label><label className="flex items-center gap-1"><Switch checked={gif} onCheckedChange={setGif} className="h-3 w-6" />GIF</label><Button size="sm" className="ml-auto h-6 gap-1 rounded-full px-2 text-[9px]" onClick={() => toast("生成服务暂未接入，已保留当前描述")}><Gem className="size-3" />80<ArrowUp className="size-3" /></Button></div></div>
    </aside>}
  </div>;
}
export function ImageTemplateCanvas(props: Props) { return <ReactFlowProvider><Canvas {...props} /></ReactFlowProvider>; }
