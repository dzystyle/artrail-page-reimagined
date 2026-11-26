import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CanvasReference } from "@/lib/canvas-references";

export function CanvasReferenceChips({ references, onRemove }: { references: CanvasReference[]; onRemove: (id: string) => void }) {
  if (!references.length) return null;
  return <div aria-label="画布引用" className="mb-2 max-h-32 space-y-1.5 overflow-y-auto">
    <p className="text-[11px] text-muted-foreground">画布引用 · {references.length}</p>
    <div className="flex flex-wrap gap-1.5">{references.map(item => <div key={item.id} className="flex max-w-full min-w-0 items-center gap-1.5 rounded-md border border-border bg-secondary py-1 pl-1 pr-0.5 text-xs" title={item.name}>
      {item.url ? <img src={item.url} alt="" className="size-7 shrink-0 rounded object-contain" /> : <FileText className="mx-1 size-5 shrink-0 text-muted-foreground" />}
      <span className="min-w-0 truncate">@{item.name}</span>
      <Button type="button" variant="ghost" size="icon" className="size-6 shrink-0" aria-label={`移除画布引用：${item.name}`} onClick={() => onRemove(item.id)}><X /></Button>
    </div>)}</div>
  </div>;
}
