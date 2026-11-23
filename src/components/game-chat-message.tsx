import { useMemo, useState } from "react";
import { marked } from "marked";
import { Check, Copy, History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = { id: string; role: string; content: string; code?: string | null; created_at?: string };

const time = (iso?: string) => iso ? new Date(iso).toLocaleString("zh-CN", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }) : "";

export function GameChatMessage({ m, current, canRestore, restoring, onRestore }: { m: Msg; current: boolean; canRestore: boolean; restoring: boolean; onRestore: () => void }) {
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => marked.parse(m.content, { async: false, breaks: true }), [m.content]);
  if (m.role === "user") return <div className="flex justify-end"><p className="max-w-[88%] whitespace-pre-wrap rounded-2xl bg-secondary px-3.5 py-2.5 leading-relaxed">{m.content}</p></div>;
  const copy = () => { void navigator.clipboard.writeText(m.content); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return <div className="group">
    <div className="chat-md" dangerouslySetInnerHTML={{ __html: html }} />
    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
      <Button variant="ghost" size="icon" className="size-7" aria-label="复制" title="复制" onClick={copy}>{copied ? <Check /> : <Copy />}</Button>
      {m.code && <Button title="把游戏恢复为这条回复时的代码" variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs" aria-label="回退到此版本" disabled={current || !canRestore || restoring} onClick={onRestore}>{restoring ? <Loader2 className="animate-spin" /> : <History />}{current ? "当前版本" : "回退到此版本"}</Button>}
      <span className="ml-1">{time(m.created_at)}</span>
    </div>
  </div>;
}
