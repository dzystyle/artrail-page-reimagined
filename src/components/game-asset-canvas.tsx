import { useState, type ReactNode } from "react";
import { Box, Crop, Download, Eraser, Expand, Grid2X2, Layers, ScanFace, SquareUserRound, Trash2, Type, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type CanvasAsset = { id: string; name: string; kind: string; url: string };
const tools = [
  { name: "放大", icon: Expand },
  { name: "去背景", icon: ScanFace },
  { name: "扩图", icon: SquareUserRound },
  { name: "消除笔", icon: Eraser },
  { name: "编辑元素", icon: Layers },
  { name: "编辑文字", icon: Type },
  { name: "裁剪", icon: Crop },
  { name: "调效果", icon: WandSparkles },
  { name: "多角度", icon: Box },
  { name: "快速切分", icon: Grid2X2 },
];

export function GameAssetCanvas({ assets, children, filters }: { assets: CanvasAsset[]; children?: ReactNode; filters?: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<Record<string, string>>({});
  const selected = assets.find(asset => asset.id === selectedId);

  return <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-surface-deep" aria-label="游戏资产画布">
    {filters && <div className="flex shrink-0 flex-wrap gap-1 border-b border-border bg-background px-4 py-2">{filters}</div>}
    {selected && <div role="toolbar" aria-label="图片工具" className="absolute inset-x-3 top-3 z-20 flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg" style={undefined}>
      {tools.map(tool => <Button key={tool.name} variant="ghost" size="sm" aria-disabled="true" title={`${tool.name}（仅展示）`} className="h-10 shrink-0 gap-2 px-3"><tool.icon className="size-5" />{tool.name}</Button>)}
      <span className="mx-1 h-7 shrink-0 border-l border-border" />
      <Button variant="ghost" size="icon" aria-label="下载图片" aria-disabled="true" title="下载图片（仅展示）" className="shrink-0"><Download /></Button>
      <Button variant="ghost" size="icon" aria-label="删除图片" aria-disabled="true" title="删除图片（仅展示）" className="shrink-0 text-destructive"><Trash2 /></Button>
    </div>}
    <div className="workspace-canvas min-h-0 flex-1 overflow-auto px-6 pb-20 pt-28 sm:px-10" onClick={() => setSelectedId(null)}>
      <div className={`mx-auto flex w-full items-start justify-center gap-12 ${children ? "max-w-[1000px] flex-col xl:flex-row" : "max-w-[1100px]"}`}>
        {children}
        <div className={`grid w-full min-w-0 grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 ${children ? "max-w-[560px]" : "lg:grid-cols-3"}`}>
          {assets.map(asset => <div key={asset.id} className="min-w-0">
            <div className="mb-2 flex min-w-0 items-center justify-between gap-2 text-xs text-muted-foreground"><span className="truncate">{asset.name}</span><span className="shrink-0 text-[10px]">{asset.kind}</span></div>
            <div className="relative">
              <Button variant="ghost" aria-label={`选择资产：${asset.name}`} aria-pressed={selectedId === asset.id} className={`relative block aspect-square h-auto w-full rounded-none p-0 hover:bg-transparent ${selectedId === asset.id ? "outline-2 outline-build" : ""}`} onClick={event => { event.stopPropagation(); setSelectedId(asset.id); }}>
                <img src={asset.url} alt={asset.name} className="size-full object-contain" onLoad={event => { const image = event.currentTarget; setDimensions(current => ({ ...current, [asset.id]: `${image.naturalWidth} × ${image.naturalHeight}` })); }} />
              </Button>
              {selectedId === asset.id && <>
                {dimensions[asset.id] && <span className="pointer-events-none absolute right-0 top-0 -translate-y-full rounded-t bg-build px-2 py-1 text-[11px] text-image-selection-foreground">{dimensions[asset.id]}</span>}
                {["-left-1.5 -top-1.5", "-right-1.5 -top-1.5", "-bottom-1.5 -left-1.5", "-bottom-1.5 -right-1.5"].map(position => <span key={position} className={`pointer-events-none absolute size-3 rounded-full border-2 border-build bg-popover ${position}`} />)}
              </>}
            </div>
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}