import { useEffect, useRef, useState } from "react";
import { ArrowUp, Box, Check, ChevronDown, Clapperboard, Folder, Gamepad2, Globe, Image, Lightbulb, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreationModelPicker, ProviderSettings } from "@/components/creation-model-picker";
import { isGameCreation, type CreationRequest } from "@/lib/game-workspace";
import { gameSkills, type GameSkill } from "@/lib/game-skills";

const types = [
  { name: "Web Game", desc: "在浏览器中运行，支持 HTML5、Phaser 或 Three.js", icon: Globe },
  { name: "Interactive Story", desc: "场景、选择和分支", icon: Clapperboard },
  { name: "Asset Canvas", desc: "在画布上创作图片、视频和 3D 资产", icon: Image },
  { name: "Godot", desc: "需要在此电脑上安装 Godot 4", icon: Gamepad2 },
  { name: "General Game", desc: "任意引擎，由智能体推荐", icon: Gamepad2 },
  { name: "TapTap Maker game", desc: "使用 UrhoX/Lua 创建 TapTap Maker 项目", icon: Box },
];
/** Keeps the composer in one instance so the draft survives docking/expanding. */
export function HomeComposer({ scrollRoot, initialType = "Asset Canvas", onCreate, baseGame, onRemoveBaseGame, seed, alwaysFloating = false, gameOnly = false }: { scrollRoot?: React.RefObject<HTMLElement | null>; initialType?: string; onCreate?: ((request: CreationRequest) => void) | undefined; baseGame?: { name: string; image: string } | null; onRemoveBaseGame?: () => void; seed?: { text: string; n: number } | null; alwaysFloating?: boolean; gameOnly?: boolean } = {}) {
  const anchor = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [anchorHeight, setAnchorHeight] = useState<number>();
  useEffect(() => {
    if (alwaysFloating) return;
    const el = anchor.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      const out = entry.intersectionRatio < 0.98 && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0) + 1;
      if (out && el.firstElementChild) setAnchorHeight(el.offsetHeight);
      setDocked(out);
      if (!out) setExpanded(false);
    }, { root: scrollRoot?.current ?? null, threshold: [0, 0.98, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, [scrollRoot, alwaysFloating]);
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);
  const [text, setText] = useState("");
  const availableTypes = gameOnly ? types.filter(t => isGameCreation(t.name)) : types;
  const [type, setType] = useState(availableTypes.find(t => t.name === initialType) ?? availableTypes[0]);
  const [typeOpen, setTypeOpen] = useState(false);
  const [project, setProject] = useState("ArTrail");
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectQuery, setProjectQuery] = useState("");
  const [model, setModel] = useState("deepseek-v4-pro");
  const [depth, setDepth] = useState("High");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [skill, setSkill] = useState<GameSkill | null>(null);
  const [skillOpen, setSkillOpen] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");
  const [skillCategory, setSkillCategory] = useState("全部");
  const [skillPreview, setSkillPreview] = useState<GameSkill | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (seed) { setText(seed.text); textarea.current?.focus(); } }, [seed]);
  useEffect(() => { if (baseGame) textarea.current?.focus(); }, [baseGame]);
  if (!type) return null;
  const TypeIcon = type.icon;
  const filteredSkills = gameSkills.filter(item => item.name.toLowerCase().includes(skillQuery.toLowerCase()) && (skillCategory === "全部" || item.category === skillCategory));
  const currentSkillPreview = skillPreview ?? filteredSkills[0];
  const floating = alwaysFloating || (docked && expanded);
  const hiddenFull = !alwaysFloating && docked && !expanded;
  return <div ref={anchor} style={docked && !alwaysFloating ? { height: anchorHeight } : undefined} className={alwaysFloating ? "" : "mb-10 mt-10"}>
    {floating && !alwaysFloating && <div aria-hidden className="fixed inset-0 z-40 bg-background/60 backdrop-blur-[2px] animate-in fade-in-0" onClick={() => setExpanded(false)} />}
    {hiddenFull && <button type="button" aria-label="展开创作输入框" onClick={() => { setExpanded(true); requestAnimationFrame(() => textarea.current?.focus()); }}
      className="fixed bottom-6 left-1/2 z-40 flex w-[min(540px,calc(100vw-32px))] -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-card/80 py-2.5 pl-6 pr-2.5 text-left shadow-2xl backdrop-blur-xl animate-in fade-in-0 slide-in-from-bottom-4 lg:ml-[166px]">
      <span className={`flex-1 truncate text-[15px] ${text ? "text-foreground" : "text-muted-foreground"}`}>{text || (gameOnly ? "描述你的游戏玩法…" : "输入你的需求即可生成图片、视频…")}</span>
      <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground"><ArrowUp className="size-4" /></span>
    </button>}
  <section aria-label="创作输入框" className={floating ? "fixed bottom-6 left-1/2 z-50 w-[min(885px,calc(100vw-32px))] -translate-x-1/2 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-6 lg:ml-[166px]" : hiddenFull ? "hidden" : ""}>
    <form className="rounded-2xl border border-input bg-card p-4 sm:p-5" onSubmit={e => { e.preventDefault(); if (!text.trim()) return; if (onCreate) onCreate({ prompt: `${skill ? `使用 ${skill.name}：` : ""}${baseGame ? `基于《${baseGame.name}》继续制作：` : ""}${text.trim()}`, type: type.name, project, model, depth }); else setNotice("尚未连接创作服务，你的输入已保留。"); }}>
      <Textarea ref={textarea} aria-label="创作描述" placeholder={gameOnly ? "我想做一款…游戏，玩家可以…，挑战是…" : "描述你想创作的内容…"} value={text} onChange={e => { setText(e.target.value); setNotice(""); }} className="h-[112px] resize-none border-0 p-0 text-base shadow-none focus-visible:ring-0 md:text-base" />
      {skill && <div className="mb-3 flex"><div className="flex max-w-full items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-2 text-sm"><img src={skill.image} alt="" className="size-6 rounded object-cover" /><span className="truncate">{skill.name}</span><Button variant="ghost" type="button" size="icon" className="size-6" aria-label={`移除 ${skill.name}`} onClick={() => setSkill(null)}><X /></Button></div></div>}
      {baseGame && <div className="mb-3 flex"><div className="flex items-center gap-2 rounded-xl border border-border py-1.5 pl-1.5 pr-2 text-[15px]"><img src={baseGame.image} alt="" className="size-6 rounded-md object-cover" /><span>{baseGame.name}</span><button type="button" aria-label={`移除 ${baseGame.name}`} onClick={onRemoveBaseGame} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button></div></div>}
      {files.length > 0 && <div className="mb-3 flex flex-wrap gap-2">{files.map((file, i) => <div key={`${file.name}-${i}`} className="flex max-w-full items-center gap-1 rounded-md bg-secondary pl-2 text-xs"><span className="truncate">{file.name}</span><Button type="button" size="icon" variant="ghost" className="size-7" aria-label={`移除 ${file.name}`} onClick={() => setFiles(list => list.filter((_, index) => index !== i))}><X /></Button></div>)}</div>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          <input ref={fileInput} type="file" multiple className="hidden" aria-label="添加附件" onChange={e => { setFiles(list => [...list, ...Array.from(e.target.files ?? [])]); e.target.value = ""; }} />
          <Button type="button" variant="ghost" size="icon" title="添加附件" aria-label="添加附件" onClick={() => fileInput.current?.click()}><Plus className="size-5" /></Button>
          <Popover open={skillOpen} onOpenChange={setSkillOpen}>
            <PopoverTrigger asChild><Button type="button" variant="ghost" aria-label="选择 Skill" className="text-muted-foreground"><Box />Skill<ChevronDown /></Button></PopoverTrigger>
            <PopoverContent align="start" side="bottom" className="max-h-[min(560px,70vh)] w-[min(850px,calc(100vw-32px))] overflow-y-auto p-0">
              <div className="flex items-center gap-2 border-b border-border p-3"><Search className="size-4 text-muted-foreground" /><Input aria-label="搜索 Skill" placeholder="搜索 skill" value={skillQuery} onChange={e => { setSkillQuery(e.target.value); setSkillPreview(null); }} className="border-0 shadow-none focus-visible:ring-0" /></div>
              <div className="grid sm:grid-cols-[110px_1fr_1fr]">
                <div className="flex gap-1 overflow-x-auto border-b border-border bg-secondary/20 p-2 sm:block sm:border-b-0 sm:border-r">{["全部", ...new Set(gameSkills.map(item => item.category))].map(item => <Button type="button" variant="ghost" key={item} className={`shrink-0 justify-start sm:w-full ${skillCategory === item ? "bg-accent" : "text-muted-foreground"}`} onClick={() => { setSkillCategory(item); setSkillPreview(null); }}>{skillCategory === item && <Check className="size-3" />}{item}</Button>)}</div>
                <div className="max-h-[340px] overflow-y-auto p-2">{filteredSkills.map(item => <Button type="button" variant="ghost" key={item.name} className={`h-auto min-h-12 w-full justify-between text-left ${currentSkillPreview?.name === item.name ? "bg-accent" : ""}`} onMouseEnter={() => setSkillPreview(item)} onFocus={() => setSkillPreview(item)} onClick={() => { setSkill(item); setSkillOpen(false); }}><span className="min-w-0 truncate">{item.name}</span><Plus /></Button>)}{filteredSkills.length === 0 && <p className="p-4 text-sm text-muted-foreground">未找到 Skill</p>}</div>
                {currentSkillPreview && <div className="hidden border-l border-border p-4 sm:block"><img src={currentSkillPreview.image} alt={currentSkillPreview.name} className="aspect-video w-full rounded-lg object-cover" /><p className="mt-3 text-sm font-semibold">{currentSkillPreview.name}</p><p className="mt-2 text-xs text-muted-foreground">{currentSkillPreview.category}</p><Button type="button" variant="secondary" className="mt-4" onClick={() => { setSkill(currentSkillPreview); setSkillOpen(false); }}><Plus />使用这个 Skill</Button></div>}
              </div>
            </PopoverContent>
          </Popover>
          <Popover open={typeOpen} onOpenChange={setTypeOpen}><PopoverTrigger asChild><Button type="button" variant="ghost" aria-label="选择创作类型" className="text-muted-foreground"><TypeIcon /><span>{type.name}</span><ChevronDown /></Button></PopoverTrigger>
            <PopoverContent align="start" side="bottom" className="w-[min(420px,calc(100vw-32px))] rounded-lg p-1.5">
              {availableTypes.map(t => <Button type="button" key={t.name} variant="ghost" onClick={() => { setType(t); setTypeOpen(false); }} className={`h-auto w-full justify-start whitespace-normal px-3 py-2 text-left ${type.name === t.name ? "bg-accent" : ""}`}><t.icon className="text-muted-foreground" /><span className="flex-1"><span className="block text-[15px] font-normal">{t.name}</span><span className="block text-[13px] font-normal leading-snug text-muted-foreground">{t.desc}</span></span>{t.name === type.name && <Check />}</Button>)}
              {!gameOnly && <Button type="button" variant="ghost" className="h-auto w-full justify-start px-3 py-2" onClick={() => { setTypeOpen(false); setSettingsOpen(true); }}><Plus /><span className="text-left"><span className="block">More types…</span><span className="text-xs font-normal text-muted-foreground">提供商设置</span></span></Button>}
            </PopoverContent>
          </Popover>
          <Popover open={projectOpen} onOpenChange={v => { setProjectOpen(v); if (!v) setProjectQuery(""); }}><PopoverTrigger asChild><Button type="button" variant="ghost" aria-label="选择项目" className="max-w-[180px] text-muted-foreground"><Folder /><span className="truncate">项目：{project}</span><ChevronDown /></Button></PopoverTrigger>
            <PopoverContent align="start" side="bottom" className="w-[min(300px,calc(100vw-32px))] rounded-xl p-0">
              <div className="border-b border-border p-2"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={projectQuery} onChange={e => setProjectQuery(e.target.value)} placeholder="搜索项目..." className="rounded-full pl-9" /></div></div>
              <div className="p-1.5">{["NEW-HOPE", "F3/FX", "ArTrail"].filter(n => n.toLowerCase().includes(projectQuery.toLowerCase())).map(n => <Button type="button" key={n} variant="ghost" onClick={() => { setProject(n); setProjectOpen(false); }} className={`h-11 w-full justify-start gap-3 px-2 font-normal ${n === project ? "bg-accent text-link" : ""}`}><span className="grid size-8 place-items-center rounded-full bg-secondary"><Folder className="size-4 text-link" /></span>{n}</Button>)}</div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="ml-auto flex min-w-0 items-center gap-2">
          <CreationModelPicker model={model} depth={depth} onModelChange={setModel} onDepthChange={setDepth} />
          <Button type="submit" size="icon" aria-label="发送创作内容" title="发送" disabled={!text.trim()} className="size-10 shrink-0 rounded-full"><ArrowUp /></Button>
        </div>
      </div>
    </form>
    {notice && <p role="status" className="mt-2 text-center text-sm text-muted-foreground">{notice}</p>}
  </section>
    <ProviderSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
  </div>;
}