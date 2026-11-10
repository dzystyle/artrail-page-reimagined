import { useState } from "react";
import { FileText, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GameDesign } from "@/lib/game-pipeline";

export function GameDesignEditor({ design, onSave, onClose }: { design: GameDesign; onSave: (design: GameDesign) => Promise<void>; onClose: () => void }) {
  const [draft, setDraft] = useState(() => ({ ...design, sections: design.sections.map(section => ({ ...section })) }));
  const [active, setActive] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [discard, setDiscard] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(design);
  const valid = !!draft.title.trim() && !!draft.summary.trim() && draft.sections.every(section => section.heading.trim() && section.body.trim());
  const close = () => { if (saving) return; if (dirty) setDiscard(true); else onClose(); };
  const save = async () => {
    if (!valid || saving) return;
    setSaving(true); setError("");
    try { await onSave(draft); onClose(); } catch { setError("保存失败，请重试；你的修改仍保留在此窗口。"); } finally { setSaving(false); }
  };
  const section = draft.sections[active];
  return <Dialog open onOpenChange={open => { if (!open) close(); }}><DialogContent className="flex h-[min(820px,90dvh)] w-[calc(100vw-24px)] max-w-[1020px] flex-col gap-0 overflow-hidden rounded-lg p-0" onEscapeKeyDown={event => { event.preventDefault(); close(); }} onInteractOutside={event => { event.preventDefault(); close(); }}>
    <header className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-4 pr-12"><FileText className="size-5 text-project-mint" /><div><DialogTitle>编辑游戏设计文档</DialogTitle><DialogDescription className="mt-1 text-xs">本机保存 · 不会自动改动已生成的游戏</DialogDescription></div><span className="ml-auto hidden text-xs text-muted-foreground sm:block">{dirty ? "未保存" : "无修改"}</span></header>
    <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
      <nav aria-label="文档章节" className="flex shrink-0 gap-1 overflow-x-auto border-b border-border bg-surface-deep p-2 sm:w-48 sm:flex-col sm:overflow-y-auto sm:border-b-0 sm:border-r sm:p-3">
        <Button size="sm" variant={active === -1 ? "secondary" : "ghost"} className="shrink-0 justify-start" onClick={() => setActive(-1)}>文档概览</Button>
        {draft.sections.map((item, index) => <Button key={index} size="sm" variant={active === index ? "secondary" : "ghost"} className="shrink-0 justify-start sm:w-full" onClick={() => setActive(index)}><span className="text-muted-foreground">{index + 1}.</span><span className="truncate">{item.heading}</span></Button>)}
      </nav>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
        {active === -1 ? <><label className="block space-y-2 text-sm"><span>文档标题</span><Input aria-label="设计文档标题" value={draft.title} disabled={saving} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} /></label><label className="block space-y-2 text-sm"><span>游戏概述</span><Textarea aria-label="设计文档概述" value={draft.summary} disabled={saving} className="min-h-64 resize-y leading-7" onChange={event => setDraft(current => ({ ...current, summary: event.target.value }))} /></label></> : section && <><label className="block space-y-2 text-sm"><span>章节标题</span><Input aria-label="章节标题" value={section.heading} disabled={saving} onChange={event => setDraft(current => ({ ...current, sections: current.sections.map((item, index) => index === active ? { ...item, heading: event.target.value } : item) }))} /></label><label className="block space-y-2 text-sm"><span>章节内容</span><Textarea aria-label="章节内容" value={section.body} disabled={saving} className="min-h-80 resize-y leading-7" onChange={event => setDraft(current => ({ ...current, sections: current.sections.map((item, index) => index === active ? { ...item, body: event.target.value } : item) }))} /></label></>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
    <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3">
      {discard ? <><p className="mr-auto text-xs text-muted-foreground">放弃未保存的修改？</p><Button size="sm" variant="ghost" onClick={() => setDiscard(false)}>继续编辑</Button><Button size="sm" variant="destructive" onClick={onClose}>放弃修改</Button></> : <><Button size="sm" variant="ghost" disabled={saving} onClick={close}>取消</Button><Button size="sm" disabled={!dirty || !valid || saving} onClick={() => void save()}>{saving ? <Loader2 className="animate-spin" /> : <Save />}{saving ? "保存中…" : "保存修改"}</Button></>}
    </footer>
  </DialogContent></Dialog>;
}