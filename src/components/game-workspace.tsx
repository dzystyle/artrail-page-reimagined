import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowUp, Code2, Download, FileText, Gamepad2, Image, Layers, Loader2, MessageSquare, PanelLeftClose, PanelLeftOpen, Play, RotateCcw, Sparkles, Swords, Settings, AlertCircle, Check } from "lucide-react";
import { CreationModelPicker } from "@/components/creation-model-picker";
import { GameSettings } from "@/components/game-settings";
import { MultiplayerPanel } from "@/components/multiplayer-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type WorkspaceTab } from "@/lib/game-workspace";
import { nextStep, statusLabel } from "@/lib/game-pipeline";
import { generateAsset, generateCode, generateDesign, getGame, listGames, retryGame, reviseGame } from "@/lib/games.functions";
import { gameListKey, gameListOptions } from "@/lib/game-list";

const tabs = [{ id: "game", label: "Game", icon: Gamepad2 }, { id: "design", label: "Design", icon: FileText }, { id: "canvas", label: "Canvas", icon: Layers }, { id: "assets", label: "Assets", icon: Image }, { id: "code", label: "Code", icon: Code2 }, { id: "multiplayer", label: "多人游戏", icon: Swords }] as const;

const busy = (s?: string) => s === "designing" || s === "assets" || s === "coding" || s === "revising";

export function GameWorkspace({ id, tab, onTab }: { id?: string | undefined; tab: WorkspaceTab; onTab: (tab: WorkspaceTab) => void }) {
  const fetchGame = useServerFn(getGame);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["game", id], enabled: !!id, queryFn: () => fetchGame({ data: { id: id! } }),
    refetchInterval: q => (busy(q.state.data?.game.status) ? 3000 : false),
  });
  const game = data?.game;
  const assets = data?.assets ?? [];
  const planned = game?.design?.assets.length ?? 0;

  const design = useServerFn(generateDesign), asset = useServerFn(generateAsset), code = useServerFn(generateCode), revise = useServerFn(reviseGame), retry = useServerFn(retryGame);
  const running = useRef<string | null>(null);
  const refresh = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["game", id] }),
      qc.invalidateQueries({ queryKey: gameListKey }),
    ]);
  };

  // Drive the generation pipeline one step at a time from the browser.
  useEffect(() => {
    if (!game || !id) return;
    const step = nextStep(game.status, assets.length, planned);
    if (!step) return;
    const key = `${game.status}-${step.step}-${"index" in step ? step.index : ""}`;
    if (running.current === key) return;
    running.current = key;
    const call = step.step === "design" ? design({ data: { id } }) : step.step === "asset" ? asset({ data: { id, index: step.index } }) : code({ data: { id } });
    void call.finally(() => { void refresh(); });
  }, [game?.status, assets.length, planned, id]);

  const [chatOpen, setChatOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState("deepseek-v4-pro");
  const [depth, setDepth] = useState("High");
  const [assetKind, setAssetKind] = useState("全部");
  const reviseM = useMutation({ mutationFn: (message: string) => revise({ data: { id: id!, message } }), onSettled: () => refresh() });
  const retryM = useMutation({ mutationFn: () => { running.current = null; return retry({ data: { id: id! } }); }, onSettled: () => refresh() });

  const download = (text: string, name: string) => { const url = URL.createObjectURL(new Blob([text], { type: "text/plain" })); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); };
  const designMd = useMemo(() => game?.design ? `# ${game.design.title}\n\n${game.design.summary}\n\n${game.design.sections.map(s => `## ${s.heading}\n${s.body}`).join("\n\n")}` : "", [game?.design]);

  if (!id) return <RecentGames />;
  if (isLoading) return <div className="flex h-dvh items-center justify-center bg-surface-deep text-muted-foreground"><Loader2 className="animate-spin" /></div>;
  if (!game) return <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-surface-deep"><p>找不到这个游戏。</p><Button asChild><Link to="/build" search={{ mode: "build" }}>去创建游戏</Link></Button></div>;

  const status = <StatusBadge status={game.status} done={assets.length} planned={planned} />;
  const pending = (label: string) => <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-sm text-muted-foreground">{game.status === "error" ? <><AlertCircle className="text-destructive" /><p>{game.error}</p><Button size="sm" onClick={() => retryM.mutate()} disabled={retryM.isPending}><RotateCcw />重试</Button></> : <><Loader2 className="animate-spin" /><p>{label}</p></>}</div>;
  const filtered = assets.filter(a => assetKind === "全部" || a.kind === assetKind);

  return <div className="flex h-dvh flex-col overflow-hidden bg-surface-deep text-foreground">
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-3"><div className="flex min-w-0 items-center gap-2"><Button asChild size="icon" variant="ghost"><Link to="/build" search={{ mode: "build" }} aria-label="返回构建"><ArrowLeft /></Link></Button><span className="truncate text-sm font-medium">{game.title} · 游戏创作</span><span className="hidden sm:inline">{status}</span></div><Button size="sm" variant="secondary" disabled={!game.code} onClick={() => onTab("game")}><Play />试玩</Button></header>
    <div className="flex min-h-0 flex-1 gap-1.5 p-1.5 pt-0">
      <aside className="hidden w-11 shrink-0 flex-col items-center gap-3 py-3 md:flex"><Button asChild size="icon" variant="ghost"><Link to="/" aria-label="返回首页"><Gamepad2 /></Link></Button>{assets.slice(0, 4).map(a => <Button key={a.id} variant="ghost" size="icon" title={a.kind} aria-label={`查看${a.kind}资产`} className="overflow-hidden p-0" onClick={() => { setAssetKind(a.kind); onTab("assets"); }}><img src={a.url} alt={a.kind} className="size-full object-cover" /></Button>)}<div className="mt-auto text-[10px] text-muted-foreground">ArTrail</div></aside>
      {chatOpen && <aside className="hidden w-[280px] shrink-0 flex-col rounded-lg bg-background lg:flex xl:w-[310px]">
        <div className="flex h-11 items-center justify-between px-4 text-xs"><span className="flex items-center gap-2"><MessageSquare className="size-4" />Chat</span><Button variant="ghost" size="icon" className="size-7" title="收起会话" aria-label="收起会话" onClick={() => setChatOpen(false)}><PanelLeftClose /></Button></div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
          {data.messages.map(m => m.role === "user" ? <p key={m.id} className="rounded-lg bg-secondary p-3 leading-relaxed">{m.content}</p> : <div key={m.id} className="flex gap-2"><Sparkles className="mt-0.5 size-4 shrink-0 text-project-mint" /><p className="leading-relaxed">{m.content}</p></div>)}
          {(busy(game.status) || game.status === "error") && <div className="space-y-2 border-l border-border pl-3 text-xs text-muted-foreground">
            <Step done={!!game.design} active={game.status === "designing"}>设计文档</Step>
            <Step done={planned > 0 && assets.length >= planned} active={game.status === "assets"}>美术资产 {planned ? `${assets.length}/${planned}` : ""}</Step>
            <Step done={!!game.code} active={game.status === "coding" || game.status === "revising"}>游戏代码</Step>
            {game.status === "error" && <p className="text-destructive">{game.error}</p>}
          </div>}
        </div>
        <form className="m-3 rounded-lg bg-card p-3" onSubmit={e => { e.preventDefault(); const m = draft.trim(); if (!m) return; reviseM.mutate(m); setDraft(""); }}>
          <Textarea aria-label="游戏修改需求" placeholder={game.code ? "描述你想修改的内容…" : "游戏生成完成后可继续修改"} value={draft} onChange={e => setDraft(e.target.value)} className="h-20 resize-none border-0 p-0 shadow-none focus-visible:ring-0" />
          <div className="flex min-w-0 items-center justify-between gap-1"><CreationModelPicker compact model={model} depth={depth} onModelChange={setModel} onDepthChange={setDepth} /><Button type="submit" size="icon" aria-label="发送修改需求" disabled={!draft.trim() || game.status !== "ready"} className="size-7 rounded-full"><ArrowUp /></Button></div>
        </form>
      </aside>}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-background">
        <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border px-2">{!chatOpen && <Button variant="ghost" size="icon" className="hidden size-7 lg:flex" aria-label="展开会话" title="展开会话" onClick={() => setChatOpen(true)}><PanelLeftOpen /></Button>}<nav aria-label="游戏工作区视图" className="flex min-w-0 overflow-x-auto">{tabs.map(t => <Button key={t.id} variant={tab === t.id ? "secondary" : "ghost"} size="sm" className="h-7 shrink-0 gap-1.5 px-2 text-xs" aria-current={tab === t.id ? "page" : undefined} onClick={() => onTab(t.id)}><t.icon className="size-3.5" />{t.label}</Button>)}</nav><Button variant={tab === "settings" ? "secondary" : "outline"} size="icon" className="size-8 shrink-0" aria-label="游戏设置" title="设置" onClick={() => onTab("settings")}><Settings className="size-4" /></Button></div>
        {tab === "game" && (game.code ? <iframe key={game.updated_at} title={`${game.title} 试玩`} sandbox="allow-scripts allow-pointer-lock" srcDoc={game.code} className="min-h-0 w-full flex-1 border-0 bg-black" /> : pending(statusLabel[game.status] ?? ""))}
        {tab === "canvas" && <div className="workspace-canvas flex min-h-0 flex-1 items-center justify-center overflow-auto p-6"><div className="flex w-full max-w-[900px] flex-col items-start gap-10 md:flex-row">
          <div className="w-full max-w-[320px] rounded-lg border border-border bg-card p-3"><Button variant="ghost" className="mb-2 h-7 px-0 text-xs text-muted-foreground" onClick={() => onTab("design")}><FileText />游戏设计文档</Button><div className="space-y-2 rounded bg-surface-deep p-4 text-xs leading-relaxed">{game.design ? <><p className="font-semibold">{game.design.title}</p><p className="line-clamp-6">{game.design.summary}</p></> : <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-3 animate-spin" />撰写中…</p>}</div></div>
          <div className="w-full max-w-[480px]"><Button variant="ghost" className="mb-2 h-7 px-0 text-xs text-muted-foreground" onClick={() => onTab("assets")}><Image />游戏资产</Button><div className="grid grid-cols-2 gap-2">{assets.map(a => <img key={a.id} src={a.url} alt={a.name} className="aspect-square w-full rounded-lg object-cover" />)}{Array.from({ length: Math.max(0, planned - assets.length) }).map((_, i) => <div key={i} className="flex aspect-square items-center justify-center rounded-lg bg-card text-muted-foreground"><Loader2 className="size-4 animate-spin" /></div>)}</div></div>
        </div></div>}
        {tab === "design" && (game.design ? <div className="min-h-0 flex-1 overflow-y-auto"><div className="sticky top-0 flex justify-end bg-background p-3"><Button variant="ghost" size="icon" aria-label="下载设计文档" title="下载设计文档" onClick={() => download(designMd, "game-design.md")}><Download /></Button></div><article className="mx-auto max-w-[760px] px-6 pb-12"><h1 className="mb-3 text-2xl font-semibold">{game.design.title}</h1><p className="mb-8 text-sm text-muted-foreground">{game.design.summary}</p>{game.design.sections.map((s, i) => <section key={i} className="mb-8"><h2 className="mb-3 text-lg font-semibold">{i + 1}. {s.heading}</h2><p className="whitespace-pre-wrap text-sm leading-7 text-foreground/80">{s.body}</p></section>)}</article></div> : pending(statusLabel["designing"] ?? ""))}
        {tab === "assets" && (assets.length ? <div className="flex-1 overflow-y-auto p-4 sm:p-6"><div className="mb-5 flex flex-wrap gap-1">{["全部", ...new Set(assets.map(a => a.kind))].map(k => <Button key={k} size="sm" variant={assetKind === k ? "secondary" : "ghost"} onClick={() => setAssetKind(k)}>{k}</Button>)}</div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{filtered.map(a => <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-border bg-card"><img src={a.url} alt={a.name} className="aspect-square w-full object-cover" /><div className="flex justify-between p-2 text-xs"><span className="truncate">{a.name}</span><span className="text-muted-foreground">{a.kind}</span></div></a>)}</div></div> : pending(statusLabel["assets"] ?? ""))}
        {tab === "code" && (game.code ? <div className="flex min-h-0 flex-1 flex-col"><div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs"><span>index.html</span><Button variant="ghost" size="sm" onClick={() => download(game.code!, "index.html")}><Download />下载</Button></div><pre className="min-h-0 flex-1 overflow-auto p-4 text-xs leading-5"><code>{game.code}</code></pre></div> : pending(statusLabel["coding"] ?? ""))}
        {tab === "multiplayer" && <MultiplayerPanel />}
        {tab === "settings" && <GameSettings initialName={game.title} />}
      </main>
    </div>
  </div>;
}

function Step({ done, active, children }: { done: boolean; active: boolean; children: React.ReactNode }) {
  return <p className={`flex items-center gap-2 ${active ? "text-foreground" : ""}`}>{done ? <Check className="size-3" /> : active ? <Loader2 className="size-3 animate-spin" /> : <span className="size-3" />}{children}</p>;
}

function StatusBadge({ status, done, planned }: { status: string; done: number; planned: number }) {
  return <span className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{busy(status) && <Loader2 className="size-3 animate-spin" />}{statusLabel[status]}{status === "assets" && planned ? ` ${done}/${planned}` : ""}</span>;
}

function RecentGames() {
  const { data, isLoading } = useQuery(gameListOptions());
  return <div className="min-h-dvh bg-surface-deep p-6 text-foreground"><div className="mx-auto max-w-3xl"><div className="mb-6 flex items-center justify-between"><h1 className="text-xl font-semibold">我的游戏</h1><Button asChild><Link to="/build" search={{ mode: "build" }}>创建新游戏</Link></Button></div>
    {isLoading ? <Loader2 className="animate-spin" /> : !data?.length ? <p className="text-sm text-muted-foreground">还没有游戏，去构建页描述你的想法吧。</p> : <ul className="space-y-2">{data.map(g => <li key={g.id}><Link to="/game" search={{ id: g.id, tab: "game", prompt: "", project: "ArTrail" }} className="flex items-center justify-between rounded-lg bg-card p-4 hover:bg-secondary"><span>{g.title}</span><span className="text-xs text-muted-foreground">{statusLabel[g.status]}</span></Link></li>)}</ul>}
  </div></div>;
}
