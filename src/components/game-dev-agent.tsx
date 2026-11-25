import { useRef, useState } from "react";
import { AtSign, ChevronUp, Diamond, Film, Hash, Image, List, MessageSquareText, Paperclip, Plus, ScanLine, Send, Slash, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const skills = [
  { cmd: "goal", desc: "keep working until an objective is met [pause|resume|clear]", group: "命令" },
  { cmd: "aigc-image", tag: "图片生成", desc: "生成二维静态图片（含单张或成套 UI 位图）、参考图生成和已有图片去背", group: "技能" },
  { cmd: "aigc-model", tag: "3D 模型生成", desc: "根据文字或参考图生成独立模型并交付 GLB", group: "技能" },
  { cmd: "aigc-sprite-animation", tag: "序列帧动画生成", desc: "从描述、图片、视频、已有帧或 atlas 出发制作游戏序列帧动画", group: "技能" },
  { cmd: "aigc-video", tag: "视频生成", desc: "从已有首帧和可选尾帧生成独立视频文件，用于短片、过场或动态素材", group: "技能" },
];

export function GameDevAgent() {
  const [open, setOpen] = useState(true);
  const [need, setNeed] = useState("");
  const [text, setText] = useState("");
  const [ref, setRef] = useState<string>();
  const [video, setVideo] = useState<string>();
  const ta = useRef<HTMLTextAreaElement>(null);
  const showSlash = text.startsWith("/") && !text.includes(" ");
  const q = text.slice(1).toLowerCase();
  const list = skills.filter(s => s.cmd.includes(q));
  const pick = (cmd: string) => { setText(`/${cmd} `); ta.current?.focus(); };
  const notLive = () => toast("游戏开发 Agent 尚未接入生成服务");

  return <div className="flex min-h-0 flex-1 flex-col">
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
      <div className="text-center">
        <h2 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-bold text-transparent">LayaIdea</h2>
        <p className="mt-1 text-sm text-muted-foreground">AIGC 智能助手</p>
        <p className="mx-auto mt-4 w-fit border-b-2 border-primary pb-1 text-sm font-medium">功能指引</p>
        <p className="mt-3 text-sm">👋 欢迎使用 LayaIdea！</p>
        <p className="mt-2 text-xs text-muted-foreground">通过聊天即可生成游戏内容，输入 / 唤醒技能、@ 引用</p>
      </div>
      <section className="mt-6 rounded-2xl border border-border bg-card p-3 text-sm">
        <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary"><Sparkles className="size-4" /></span><b className="flex-1">首次生成准备</b><button className="flex items-center gap-1 text-xs text-muted-foreground" onClick={() => setOpen(!open)}><ChevronUp className={`size-3 transition ${open ? "" : "rotate-180"}`} />{open ? "收起" : "展开"}</button></div>
        {open && <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Upload icon={Image} title="参考图" label={ref ?? "上传参考图"} accept="image/*" onFile={setRef} />
            <Upload icon={Film} title="玩法视频" label={video ?? "上传 / 替换玩法视频"} accept="video/*" onFile={setVideo} />
          </div>
          <details className="text-xs text-muted-foreground"><summary className="cursor-pointer">支持格式与大小限制</summary><p className="mt-1">图片 PNG/JPG/WebP ≤ 10MB；视频 MP4/MOV ≤ 100MB。</p></details>
          <div className="rounded-xl border border-border p-2"><p className="mb-2 flex items-center gap-2 font-medium"><MessageSquareText className="size-4" />需求</p><textarea value={need} onChange={e => setNeed(e.target.value)} rows={2} placeholder="描述你想做的游戏，例如玩法、操作方式和画面风格…" className="w-full resize-y rounded-lg border border-input bg-background p-2 text-xs outline-none focus:ring-1 focus:ring-ring" /></div>
          <Button className="w-full" disabled={!need.trim()} onClick={notLive}>开始生成</Button>
          <p className="text-xs text-muted-foreground">使用平台积分，生成前按实际范围确认扣费。</p>
          <Button variant="outline" className="w-full" onClick={notLive}>先看游戏画面</Button>
        </div>}
      </section>
    </div>
    <div className="flex items-center gap-2 px-3 pb-2"><span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs text-primary">主话题</span><span className="flex-1" /><button aria-label="新话题" onClick={notLive}><Plus className="size-4 text-muted-foreground" /></button><button aria-label="话题列表" onClick={notLive}><List className="size-4 text-muted-foreground" /></button></div>
    <div className="relative mx-3 mb-3 rounded-xl border border-input bg-background focus-within:border-primary">
      {showSlash && list.length > 0 && <div className="absolute inset-x-0 bottom-full mb-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover py-1 text-popover-foreground shadow-lg">
        {["命令", "技能"].map(g => list.some(s => s.group === g) && <div key={g}><p className="px-3 py-1.5 text-xs text-muted-foreground">{g}</p>{list.filter(s => s.group === g).map(s => <button key={s.cmd} onClick={() => pick(s.cmd)} className="flex w-full gap-2 px-3 py-2 text-left hover:bg-accent/40">{g === "命令" ? <Zap className="mt-0.5 size-4 shrink-0 text-primary" /> : <Diamond className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}<span className="min-w-0"><span className="text-sm"><span className="text-primary">/</span>{s.cmd}{s.tag && <span className="text-primary">[{s.tag}]</span>}</span><span className="block truncate text-xs text-muted-foreground">{s.desc}</span></span></button>)}</div>)}
      </div>}
      <textarea ref={ta} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) { e.preventDefault(); if (text.trim()) { notLive(); } } }} rows={3} placeholder="Ask anything — Enter 发送, Shift/Ctrl+Enter 换行" className="w-full resize-none bg-transparent px-3 pt-3 text-sm outline-none" />
      <p className="flex items-center gap-1 px-3 text-xs text-primary"><Sparkles className="size-3.5" />DeepSeek V4.1 Flash</p>
      <div className="flex items-center gap-1 p-2 text-muted-foreground">
        {[[AtSign, "@ 引用", "@"], [Paperclip, "附件"], [ScanLine, "截图"], [Slash, "技能", "/"], [Image, "图片"], [Diamond, "素材"], [Hash, "话题", "#"]].map(([I, l, ins]) => { const Icon = I as typeof AtSign; return <button key={l as string} title={l as string} aria-label={l as string} onClick={() => { if (ins) { setText(ins as string); ta.current?.focus(); } else notLive(); }} className="grid size-7 place-items-center rounded-md hover:bg-muted"><Icon className="size-4" /></button>; })}
        <span className="flex-1" />
        <Button size="sm" variant="secondary" disabled={!text.trim()} onClick={notLive}><Send />发送</Button>
      </div>
    </div>
  </div>;
}

function Upload({ icon: Icon, title, label, accept, onFile }: { icon: typeof Image; title: string; label: string; accept: string; onFile: (n: string) => void }) {
  return <div className="rounded-xl border border-border p-2"><p className="mb-2 flex items-center gap-1.5 text-xs font-medium"><Icon className="size-4" />{title}<span className="ml-auto font-normal text-muted-foreground">可选</span></p><label className="block cursor-pointer truncate rounded-lg border border-input px-2 py-1.5 text-center text-xs hover:bg-muted">{label}<input type="file" accept={accept} hidden onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f.name); }} /></label></div>;
}
