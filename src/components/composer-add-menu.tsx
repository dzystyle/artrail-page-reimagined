import { useRef, useState } from "react";
import { AudioLines, FileText, Image, LayoutGrid, Plus, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AssetLibraryDialog } from "@/components/asset-library-dialog";
import type { LibraryAsset } from "@/lib/asset-library";

const uploadKinds = [
  { label: "图片上传", icon: Image, accept: "image/*" },
  { label: "视频上传", icon: Video, accept: "video/*" },
  { label: "音频上传", icon: AudioLines, accept: "audio/*" },
  { label: "文档上传", icon: FileText, accept: ".pdf,.doc,.docx,.txt,.md,.csv,.json" },
];

export function ComposerAddMenu({ onFiles, onLibrary, compact = false, side = "bottom" }: {
  onFiles: (files: File[]) => void;
  onLibrary: (assets: LibraryAsset[]) => void;
  compact?: boolean;
  side?: "top" | "bottom";
}) {
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  return <>
    <input ref={input} type="file" multiple className="hidden" aria-label="添加附件" onChange={event => { onFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button type="button" variant="ghost" size="icon" title="添加附件" aria-label="添加附件" className={compact ? "size-7 shrink-0" : "shrink-0"}><Plus className={compact ? "size-4" : "size-5"} /></Button></PopoverTrigger>
      <PopoverContent align="start" side={side} className="w-[min(230px,calc(100vw-32px))] rounded-xl p-1.5">
        {uploadKinds.map(item => <Button type="button" key={item.label} variant="ghost" className="h-10 w-full justify-start gap-3 px-3 font-normal" onClick={() => { setOpen(false); const element = input.current; if (element) { element.accept = item.accept; element.click(); } }}><item.icon className="size-4 text-muted-foreground" />{item.label}</Button>)}
        <div className="my-1 h-px bg-border" />
        <Button type="button" variant="ghost" className="h-10 w-full justify-start gap-3 px-3 font-normal" onClick={() => { setOpen(false); setLibraryOpen(true); }}><LayoutGrid className="size-4 text-muted-foreground" />资产库</Button>
      </PopoverContent>
    </Popover>
    {libraryOpen && <AssetLibraryDialog open onOpenChange={setLibraryOpen} localAssets={[]} actionLabel="添加到输入框" onAdd={onLibrary} />}
  </>;
}