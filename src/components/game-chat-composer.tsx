import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUp, Box, Check, ChevronDown, ExternalLink, Folder, Plus, Search, Settings2, X } from "lucide-react";
import { CreationModelPicker } from "@/components/creation-model-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { gameSkills, type GameSkill } from "@/lib/game-skills";
import { projects } from "@/lib/project-catalog";

export function GameChatComposer({ ready, project, onProjectChange, onSubmit }: {
  ready: boolean; project: string; onProjectChange: (project: string) => void; onSubmit: (message: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState("deepseek-v4-pro");
  const [depth, setDepth] = useState("High");
  const [skill, setSkill] = useState<GameSkill | null>(null);
  const [skillOpen, setSkillOpen] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [preview, setPreview] = useState<GameSkill | null>(null);
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectQuery, setProjectQuery] = useState("");
  const [manageOpen, setManageOpen] = useState(false);
  const filtered = gameSkills.filter(item => item.name.toLowerCase().includes(skillQuery.toLowerCase()) && (category === "全部" || item.category === category));
  const currentPreview = filtered.find(item => item.name === preview?.name) ?? filtered[0];
  const filteredProjects = Object.entries(projects).filter(([, name]) => name.toLowerCase().includes(projectQuery.toLowerCase()));
  const chooseSkill = (item: GameSkill) => { setSkill(item); setSkillOpen(false); };
  const chooseProject = (name: string) => { onProjectChange(name); setProjectOpen(false); };

  return <>
    <form aria-label="Chat 创作输入框" className="m-3 rounded-lg bg-card p-3" onSubmit={event => {
      event.preventDefault();
      if (!ready || !draft.trim()) return;
      onSubmit(`${skill ? `使用 ${skill.name}：` : ""}${draft.trim()}`);
      setDraft("");
    }}>
      <Textarea aria-label="游戏修改需求" placeholder={ready ? "描述你想修改的内容…" : "游戏生成完成后可继续修改"} value={draft} onChange={event => setDraft(event.target.value)} className="h-20 resize-none border-0 p-0 shadow-none focus-visible:ring-0" />
      {skill && <div className="mb-2 flex min-w-0 items-center gap-1 rounded-md border border-border p-1 text-xs"><img src={skill.image} alt="" className="size-6 shrink-0 rounded object-cover" /><span className="min-w-0 flex-1 truncate" title={skill.name}>{skill.name}</span><Button type="button" variant="ghost" size="icon" className="size-6 shrink-0" aria-label={`移除 ${skill.name}`} onClick={() => setSkill(null)}><X /></Button></div>}
      <div className="mb-1 flex min-w-0 items-center gap-1">
        <Popover open={skillOpen} onOpenChange={setSkillOpen}>
          <PopoverTrigger asChild><Button type="button" variant="ghost" size="sm" aria-label="选择 Skill" className="h-8 shrink-0 gap-1 px-2 text-xs text-muted-foreground"><Box />Skill<ChevronDown /></Button></PopoverTrigger>
          <PopoverContent side="top" align="start" className="max-h-[min(560px,70vh)] w-[min(760px,calc(100vw-32px))] overflow-y-auto p-0">
            <div className="flex items-center gap-2 border-b border-border p-3"><Search className="size-4 text-muted-foreground" /><Input aria-label="搜索 Skill" placeholder="搜索 Skill" value={skillQuery} onChange={event => { setSkillQuery(event.target.value); setPreview(null); }} className="border-0 shadow-none focus-visible:ring-0" /></div>
            <div className="grid sm:grid-cols-[110px_1fr_1fr]">
              <div className="flex gap-1 overflow-x-auto border-b border-border p-2 sm:block sm:border-b-0 sm:border-r">{["全部", ...new Set(gameSkills.map(item => item.category))].map(item => <Button type="button" variant="ghost" key={item} aria-pressed={category === item} className={`shrink-0 justify-start sm:w-full ${category === item ? "bg-accent" : "text-muted-foreground"}`} onClick={() => { setCategory(item); setPreview(null); }}>{item}</Button>)}</div>
              <div className="max-h-[340px] overflow-y-auto p-2">{filtered.map(item => <Button type="button" variant="ghost" key={item.name} className={`h-auto min-h-12 w-full justify-between text-left ${currentPreview?.name === item.name ? "bg-accent" : ""}`} onMouseEnter={() => setPreview(item)} onFocus={() => setPreview(item)} onClick={() => chooseSkill(item)}><span className="min-w-0 truncate">{item.name}</span>{skill?.name === item.name ? <Check /> : <Plus />}</Button>)}{!filtered.length && <p className="p-4 text-sm text-muted-foreground">未找到 Skill</p>}</div>
              {currentPreview && <div className="hidden border-l border-border p-4 sm:block"><img src={currentPreview.image} alt={currentPreview.name} className="aspect-video w-full rounded-lg object-cover" /><p className="mt-3 text-sm font-semibold">{currentPreview.name}</p><p className="mt-2 text-xs text-muted-foreground">{currentPreview.category}</p><Button type="button" variant="secondary" className="mt-4" onClick={() => chooseSkill(currentPreview)}><Plus />使用这个 Skill</Button></div>}
            </div>
          </PopoverContent>
        </Popover>
        <Popover open={projectOpen} onOpenChange={open => { setProjectOpen(open); if (!open) setProjectQuery(""); }}>
          <PopoverTrigger asChild><Button type="button" variant="ghost" size="sm" aria-label="选择项目" className="h-8 min-w-0 flex-1 gap-1 px-2 text-xs text-muted-foreground"><Folder className="shrink-0" /><span className="min-w-0 truncate">项目：{project}</span><ChevronDown className="shrink-0" /></Button></PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-[min(300px,calc(100vw-32px))] p-2">
            <Input aria-label="搜索项目" placeholder="搜索项目…" value={projectQuery} onChange={event => setProjectQuery(event.target.value)} className="mb-2" />
            {filteredProjects.map(([id, name]) => <Button key={id} type="button" variant="ghost" className="w-full justify-start" onClick={() => chooseProject(name)}><Folder /><span className="flex-1 text-left">{name}</span>{name === project && <Check />}</Button>)}
            {!filteredProjects.length && <p className="p-3 text-sm text-muted-foreground">未找到项目</p>}
            <div className="mt-2 border-t border-border pt-2"><Button type="button" variant="ghost" className="w-full justify-start" onClick={() => { setProjectOpen(false); setManageOpen(true); }}><Settings2 />项目管理</Button></div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex min-w-0 items-center justify-between gap-1"><CreationModelPicker compact model={model} depth={depth} onModelChange={setModel} onDepthChange={setDepth} /><Button type="submit" size="icon" aria-label="发送修改需求" disabled={!draft.trim() || !ready} className="size-7 shrink-0 rounded-full"><ArrowUp /></Button></div>
    </form>
    <Dialog open={manageOpen} onOpenChange={setManageOpen}>
      <DialogContent className="max-h-[85vh] w-[calc(100vw-32px)] max-w-lg overflow-y-auto">
        <DialogTitle>项目管理</DialogTitle><DialogDescription className="sr-only">选择当前创作项目或查看项目画布与资产</DialogDescription>
        <div className="space-y-1">{Object.entries(projects).map(([id, name]) => <div key={id} className="flex flex-wrap items-center gap-2 border-b border-border py-3"><Folder className="size-5 text-link" /><span className="min-w-0 flex-1 truncate text-sm font-medium">{name}</span><Button type="button" size="sm" variant={project === name ? "secondary" : "ghost"} onClick={() => chooseProject(name)}>{project === name ? <><Check />已选择</> : "选择"}</Button><Button asChild variant="ghost" size="icon" className="size-8"><Link to="/projects/$projectId" params={{ projectId: id }} search={{ q: "", view: "" }} target="_blank" rel="noopener noreferrer" aria-label={`查看 ${name} 画布`} title="查看画布"><ExternalLink /></Link></Button><Button asChild variant="ghost" size="icon" className="size-8"><Link to="/projects/$projectId" params={{ projectId: id }} search={{ q: "", view: "assets" }} target="_blank" rel="noopener noreferrer" aria-label={`查看 ${name} 资产`} title="查看资产"><Box /></Link></Button></div>)}</div>
      </DialogContent>
    </Dialog>
  </>;
}