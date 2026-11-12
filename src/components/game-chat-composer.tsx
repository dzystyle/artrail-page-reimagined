import { useState } from "react";
import { ArrowUp, Box, Check, ChevronDown, Loader2, Mic, Plus, Search, X } from "lucide-react";
import { useVoiceInput } from "@/lib/use-voice-input";
import { CreationModelPicker } from "@/components/creation-model-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { gameSkills, type GameSkill } from "@/lib/game-skills";
import { ComposerAddMenu } from "@/components/composer-add-menu";
import type { LibraryAsset } from "@/lib/asset-library";

export function GameChatComposer({ ready, onSubmit }: {
  ready: boolean; onSubmit: (message: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [libraryAssets, setLibraryAssets] = useState<LibraryAsset[]>([]);
  const [model, setModel] = useState("deepseek-v4-pro");
  const [depth, setDepth] = useState("High");
  const [skill, setSkill] = useState<GameSkill | null>(null);
  const [skillOpen, setSkillOpen] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [preview, setPreview] = useState<GameSkill | null>(null);
  const filtered = gameSkills.filter(item => item.name.toLowerCase().includes(skillQuery.toLowerCase()) && (category === "全部" || item.category === category));
  const currentPreview = filtered.find(item => item.name === preview?.name) ?? filtered[0];
  const chooseSkill = (item: GameSkill) => { setSkill(item); setSkillOpen(false); };

  return <>
    <form aria-label="Chat 创作输入框" className="m-4 shrink-0 rounded-lg border border-border bg-card p-3 focus-within:border-ring" onSubmit={event => {
      event.preventDefault();
      if (!ready || !draft.trim()) return;
      onSubmit(`${skill ? `使用 ${skill.name}：` : ""}${draft.trim()}`);
      setDraft("");
    }}>
      <Textarea aria-label="游戏修改需求" placeholder={ready ? "描述你想修改的内容…" : "游戏生成完成后可继续修改"} value={draft} onChange={event => setDraft(event.target.value)} className="h-24 resize-none border-0 p-0 shadow-none focus-visible:ring-0" />
      {skill && <div className="mb-2 flex min-w-0 items-center gap-1 rounded-md border border-border p-1 text-xs"><img src={skill.image} alt="" className="size-6 shrink-0 rounded object-cover" /><span className="min-w-0 flex-1 truncate" title={skill.name}>{skill.name}</span><Button type="button" variant="ghost" size="icon" className="size-6 shrink-0" aria-label={`移除 ${skill.name}`} onClick={() => setSkill(null)}><X /></Button></div>}
      {(files.length > 0 || libraryAssets.length > 0) && <div className="mb-2 flex flex-wrap gap-1.5">
        {files.map((file, index) => <div key={`${file.name}-${index}`} className="flex max-w-full min-w-0 items-center gap-1 rounded-md bg-secondary pl-2 text-xs"><span className="min-w-0 truncate">{file.name}</span><Button type="button" variant="ghost" size="icon" className="size-6 shrink-0" aria-label={`移除 ${file.name}`} onClick={() => setFiles(list => list.filter((_, i) => i !== index))}><X /></Button></div>)}
        {libraryAssets.map(asset => <div key={asset.id} className="flex max-w-full min-w-0 items-center gap-1 rounded-md bg-secondary pl-1 text-xs"><img src={asset.url} alt="" className="size-5 shrink-0 rounded object-cover" /><span className="min-w-0 truncate">{asset.name}</span><Button type="button" variant="ghost" size="icon" className="size-6 shrink-0" aria-label={`移除 ${asset.name}`} onClick={() => setLibraryAssets(list => list.filter(item => item.id !== asset.id))}><X /></Button></div>)}
      </div>}
      <div className="flex min-w-0 items-center gap-1">
        <ComposerAddMenu compact side="top" onFiles={selected => setFiles(list => [...list, ...selected])} onLibrary={selected => setLibraryAssets(list => [...list, ...selected.filter(asset => !list.some(item => item.id === asset.id))])} />
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
        <div className="flex min-w-0 flex-1 items-center"><CreationModelPicker compact model={model} depth={depth} onModelChange={setModel} onDepthChange={setDepth} /></div>
        <Button type="submit" size="icon" aria-label="发送修改需求" disabled={!draft.trim() || !ready} className="size-7 shrink-0 rounded-full"><ArrowUp /></Button>
      </div>
    </form>
  </>;
}