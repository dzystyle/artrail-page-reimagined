import { Box, FileText, Folder, Hand, Image, Maximize2, MousePointer2, Music2, Plus, Sparkles, Table2, Type, Upload, Video, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

const documents = [{ name: "Document", detail: "Markdown document", icon: FileText, action: "document" }, { name: "Existing document", detail: "Add a document reference", icon: FileText }, { name: "Table", detail: "Editable game data", icon: Table2 }];
const assets = [{ name: "Text", detail: "Write a reusable prompt", icon: Type }, { name: "Image", detail: "Generate an image on canvas", icon: Image, action: "image" }, { name: "Video", detail: "Generate a video on canvas", icon: Video }, { name: "Sound effect", detail: "Generate a sound effect on canvas", icon: Volume2 }, { name: "Music", detail: "Generate a music track on canvas", icon: Music2 }, { name: "Model 3D", detail: "Generate a 3D model on canvas", icon: Box }, { name: "Animate 3D", detail: "Rig a 3D character and add moves", icon: Sparkles }, { name: "Upload", detail: "Add files from this device", icon: Upload }, { name: "From Library", detail: "Use an existing asset", icon: Folder, action: "library" }];

export function CanvasAddMenu({ onCreate, hand, onHand, onFit }: { onCreate: (kind: "image" | "document" | "library") => void; hand: boolean; onHand: (value: boolean) => void; onFit: () => void }) {
  const [open, setOpen] = useState(false);
  return <div role="toolbar" aria-label="画布操作" className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-1 rounded-lg border border-border bg-popover p-1.5 shadow-lg">
    <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button variant="secondary" size="icon" className="size-12" aria-label="添加素材" title="添加素材"><Plus className="size-6" /></Button></PopoverTrigger>
      <PopoverContent side="top" align="start" sideOffset={12} className="max-h-[min(720px,65dvh)] w-[330px] max-w-[calc(100vw-24px)] overflow-y-auto p-2">
        {[{ title: "DOCUMENTS", entries: documents }, { title: "ASSETS", entries: assets }].map(group => <section key={group.title} className="border-b border-border py-2 last:border-0"><h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground">{group.title}</h3>{group.entries.map(item => <Button key={item.name} variant="ghost" className="h-auto w-full justify-start gap-3 px-3 py-3 text-left" aria-disabled={!item.action} title={!item.action ? "暂未开放" : undefined} onClick={() => { if (item.action === "image" || item.action === "document" || item.action === "library") { setOpen(false); onCreate(item.action); } }}><item.icon className="size-5 text-muted-foreground" /><span className="min-w-0"><span className="block text-sm">{item.name}</span><span className="block whitespace-normal text-xs font-normal text-muted-foreground">{item.detail}</span></span></Button>)}</section>)}
      </PopoverContent>
    </Popover>
    <Button variant={!hand ? "secondary" : "ghost"} size="icon" className="size-12" aria-label="选择素材" aria-pressed={!hand} title="选择素材" onClick={() => onHand(false)}><MousePointer2 /></Button>
    <Button variant={hand ? "secondary" : "ghost"} size="icon" className="size-12" aria-label="移动画布" aria-pressed={hand} title="移动画布" onClick={() => onHand(true)}><Hand /></Button>
    <Button variant="ghost" size="icon" className="size-12" aria-label="适应画布" title="适应画布" onClick={onFit}><Maximize2 /></Button>
  </div>;
}