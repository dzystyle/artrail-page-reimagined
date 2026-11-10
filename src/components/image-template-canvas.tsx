import { useState } from "react";
import { Background, BackgroundVariant, ReactFlow, ReactFlowProvider, useNodesState, useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { Hand, Maximize, Minus, MousePointer2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ImageTemplate } from "@/lib/image-templates";

type ImageNode = Node<{ image: string; title: string }, "templateImage">;

function TemplateImage({ data, selected }: NodeProps<ImageNode>) {
  return <div className={`w-[260px] overflow-hidden rounded-lg border bg-card ${selected ? "border-build ring-2 ring-build" : "border-border"}`}>
    <div className="flex h-9 items-center border-b border-border px-3 text-xs font-medium">{data.title}</div>
    <img src={data.image} alt={data.title} draggable={false} className="h-[340px] w-full object-contain" />
  </div>;
}

const nodeTypes = { templateImage: TemplateImage };

function Canvas({ template, samples }: { template: ImageTemplate; samples: ImageTemplate[] }) {
  const [hand, setHand] = useState(false);
  const [nodes, , onNodesChange] = useNodesState<ImageNode>([
    ...samples.map((sample, index): ImageNode => ({ id: `sample-${index}`, type: "templateImage", position: { x: index * 310, y: 0 }, data: { image: sample.image, title: `图${index + 1} · 参考图` } })),
    { id: "template", type: "templateImage", position: { x: 155, y: 440 }, data: { image: template.image, title: `${template.title} · 模板示例` } },
  ]);
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  return <div aria-label="图片模板画布" className="game-flow relative h-full min-h-[480px] bg-surface-deep">
    <ReactFlow nodes={nodes} nodeTypes={nodeTypes} onNodesChange={onNodesChange} nodesDraggable={!hand} panOnDrag={hand ? true : [1, 2]} fitView fitViewOptions={{ padding: 0.15, maxZoom: 0.85 }} minZoom={0.15} maxZoom={2} deleteKeyCode={null} proOptions={{ hideAttribution: true }}>
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
    </ReactFlow>
    <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-lg border border-border bg-popover p-1 shadow-lg">
      <Button size="icon" variant={hand ? "ghost" : "secondary"} aria-label="选择素材" title="选择素材" onClick={() => setHand(false)}><MousePointer2 /></Button>
      <Button size="icon" variant={hand ? "secondary" : "ghost"} aria-label="移动画布" title="移动画布" onClick={() => setHand(true)}><Hand /></Button>
      <Button size="icon" variant="ghost" aria-label="适应画布" title="适应画布" onClick={() => void fitView({ padding: 0.15, maxZoom: 0.85 })}><Maximize /></Button>
      <Button size="icon" variant="ghost" aria-label="缩小画布" title="缩小画布" onClick={() => void zoomOut()}><Minus /></Button>
      <Button size="icon" variant="ghost" aria-label="放大画布" title="放大画布" onClick={() => void zoomIn()}><Plus /></Button>
    </div>
  </div>;
}

export function ImageTemplateCanvas(props: { template: ImageTemplate; samples: ImageTemplate[] }) {
  return <ReactFlowProvider><Canvas {...props} /></ReactFlowProvider>;
}