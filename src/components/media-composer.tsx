import { useEffect, useRef, useState } from "react";
import { ArrowUp, Box, Check, ChevronDown, Folder, Mic, Plus, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mediaModes, referenceMediaRate, type MediaMode, type MediaSkill } from "@/lib/media-composer";
import { MediaModelPicker } from "@/components/media-model-picker";

export type MediaSubmission = { text: string; mode: MediaMode; skill: MediaSkill | null; files: File[] };

export function MediaComposer({ skills, skill, onSkillChange, seed, initialMode = "video", compact = false, onSubmit }: {
  skills: MediaSkill[]; skill: MediaSkill | null; onSkillChange: (skill: MediaSkill | null) => void;
  seed?: { text: string; n: number } | null;
  initialMode?: MediaMode; compact?: boolean; onSubmit?: (submission: MediaSubmission) => void;
}) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<MediaMode>(initialMode);
  const [modeOpen, setModeOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [preview, setPreview] = useState<MediaSkill | null>(null);
  const [project, setProject] = useState("ArTrail");
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectQuery, setProjectQuery] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState("");
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => { if (seed) { setText(seed.text); textarea.current?.focus(); } }, [seed]);
  useEffect(() => { if (skill) textarea.current?.focus(); }, [skill]);
  const activeMode = mediaModes.find(item => item.id === mode);
  const filtered = skills.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) && (category === "全部" || item.category === category));
  const currentPreview = preview ?? filtered[0];
  const pill = compact ? "h-8 min-w-0 rounded-full border border-border bg-secondary/40 px-2 text-[11px] shadow-none [&_svg]:size-3" : "h-9 max-w-full rounded-full border border-border bg-secondary/40 px-3 text-foreground shadow-none sm:h-10";
  return <section aria-label="媒体创作输入框" className="w-full">
    <form className={compact ? "rounded-2xl border border-input bg-card p-3 shadow-lg" : "rounded-[24px] border border-input bg-card p-4 shadow-xl sm:p-5"} onSubmit={event => { event.preventDefault(); if (!text.trim()) return; if (onSubmit) { onSubmit({ text: text.trim(), mode, skill, files }); if (compact) { setText(""); setFiles([]); } } else setNotice("尚未连接创作服务，你的描述、Skill 和设置已保留。"); }}>
      <Textarea ref={textarea} aria-label="创作描述" placeholder="输入你的需求即可生成图片、视频；上传素材后可使用 @引用素材，例如：@Image 1 作首帧、@Video 1 生成宣发视频。" value={text} onChange={event => { setText(event.target.value); setNotice(""); }} className={compact ? "h-24 min-h-24 resize-none border-0 bg-transparent p-1 text-xs leading-6 shadow-none focus-visible:ring-0 md:text-xs" : "h-[108px] min-h-[108px] resize-none border-0 bg-transparent p-0 text-[15px] leading-7 shadow-none focus-visible:ring-0 md:text-[15px]"} />
      {(skill || files.length > 0) && <div className="mb-3 flex flex-wrap gap-2">
        {skill && <div className="flex max-w-full items-center gap-2 rounded-lg border border-border py-1 pl-1 pr-2 text-sm"><img src={skill.image} alt="" className="size-6 rounded object-cover" /><span className="truncate">{skill.name}</span><Button variant="ghost" type="button" size="icon" className="size-6" aria-label={`移除 ${skill.name}`} onClick={() => onSkillChange(null)}><X /></Button></div>}
        {files.map((file, index) => <div key={`${file.name}-${index}`} className="flex max-w-full items-center gap-1 rounded-md bg-secondary pl-2 text-xs"><span className="truncate">{file.name}</span><Button variant="ghost" type="button" size="icon" className="size-7" aria-label={`移除 ${file.name}`} onClick={() => setFiles(list => list.filter((_, i) => i !== index))}><X /></Button></div>)}
      </div>}
      <div className="flex flex-wrap items-center gap-2">
        <input ref={fileInput} type="file" multiple className="hidden" aria-label="添加素材" onChange={event => { setFiles(list => [...list, ...Array.from(event.target.files ?? [])]); event.target.value = ""; }} />
        <Button variant="outline" type="button" size="icon" className={compact ? "size-8 shrink-0 rounded-full" : "size-9 shrink-0 rounded-full sm:size-10"} aria-label="添加素材" title="添加素材" onClick={() => fileInput.current?.click()}><Plus /></Button>
        <Popover open={skillOpen} onOpenChange={setSkillOpen}>
          <PopoverTrigger asChild><Button type="button" variant="ghost" aria-label="选择 Skill" className={pill}><Box />Skill<ChevronDown className="text-muted-foreground" /></Button></PopoverTrigger>
          <PopoverContent side="top" align="start" className="max-h-[min(560px,70vh)] w-[min(850px,calc(100vw-32px))] overflow-y-auto p-0">
            <div className="flex items-center gap-2 border-b border-border p-3"><Search className="size-4 text-muted-foreground" /><Input aria-label="搜索 Skill" placeholder="搜索 skill" value={query} onChange={event => { setQuery(event.target.value); setPreview(null); }} className="border-0 shadow-none focus-visible:ring-0" /></div>
            <div className="grid sm:grid-cols-[110px_1fr_1fr]">
              <div className="flex gap-1 overflow-x-auto border-b border-border bg-secondary/20 p-2 sm:block sm:border-b-0 sm:border-r">{["全部", ...new Set(skills.map(item => item.category))].map(item => <Button type="button" variant="ghost" key={item} className={`shrink-0 justify-start sm:w-full ${category === item ? "bg-accent" : "text-muted-foreground"}`} onClick={() => { setCategory(item); setPreview(null); }}>{category === item && <Check className="size-3" />}{item}</Button>)}</div>
              <div className="max-h-[340px] overflow-y-auto p-2">{filtered.map(item => <Button type="button" variant="ghost" key={item.name} className={`h-auto min-h-12 w-full justify-between text-left ${currentPreview?.name === item.name ? "bg-accent" : ""}`} onMouseEnter={() => setPreview(item)} onFocus={() => setPreview(item)} onClick={() => { onSkillChange(item); setSkillOpen(false); }}><span className="min-w-0 truncate">{item.name}</span><Plus /></Button>)}{filtered.length === 0 && <p className="p-4 text-sm text-muted-foreground">未找到 Skill</p>}</div>
              {currentPreview && <div className="hidden border-l border-border p-4 sm:block"><img src={currentPreview.image} alt={currentPreview.name} className="aspect-video w-full rounded-lg object-cover" /><p className="mt-3 text-sm font-semibold">{currentPreview.name}</p><p className="mt-2 text-xs text-muted-foreground">{currentPreview.category}</p><Button type="button" variant="secondary" className="mt-4" onClick={() => { onSkillChange(currentPreview); setSkillOpen(false); }}><Plus />使用这个 Skill</Button></div>}
            </div>
          </PopoverContent>
        </Popover>
        {!compact && <Popover open={modeOpen} onOpenChange={setModeOpen}>
          <PopoverTrigger asChild><Button type="button" variant="secondary" aria-label="选择生成模式" className={pill}>{activeMode?.label}<ChevronDown /></Button></PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-[min(360px,calc(100vw-32px))] p-2">
            {mediaModes.map(item => <Button type="button" variant="ghost" key={item.id} aria-pressed={mode === item.id} className="h-auto min-h-14 w-full justify-start px-3 py-3 text-left" onClick={() => { setMode(item.id); setModeOpen(false); }}>
              <span className="flex-1"><span className="flex items-center gap-2 text-base">{item.label}{item.badge && <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-normal">{item.badge}</span>}</span>{item.id === "audio" && <span className="mt-1 block text-xs font-normal text-muted-foreground">选择音频模型，直接生成音频</span>}</span>{mode === item.id && <Check />}
            </Button>)}
          </PopoverContent>
        </Popover>}
        <MediaModelPicker key={mode} mode={mode} buttonClassName={`${pill} ${compact ? "max-w-[160px] flex-1" : "min-w-0 max-w-[220px]"}`} />
        {!compact && <Popover open={projectOpen} onOpenChange={setProjectOpen}>
          <PopoverTrigger asChild><Button type="button" variant="ghost" aria-label="选择项目" className={`${pill} max-w-[180px] border-link/30 bg-link/10 text-link`}><Folder /><span className="truncate">项目：{project}</span><ChevronDown /></Button></PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-[min(280px,calc(100vw-32px))] p-2"><Input aria-label="搜索项目" placeholder="搜索项目…" value={projectQuery} onChange={event => setProjectQuery(event.target.value)} className="mb-2" />{["NEW-HOPE", "F3/FX", "ArTrail"].filter(item => item.toLowerCase().includes(projectQuery.toLowerCase())).map(item => <Button type="button" variant="ghost" className="w-full justify-start" key={item} onClick={() => { setProject(item); setProjectOpen(false); }}><Folder /><span className="flex-1 text-left">{item}</span>{project === item && <Check />}</Button>)}</PopoverContent>
        </Popover>}
        <div className="ml-auto flex max-w-full items-center gap-2">
          <Button type="button" variant="outline" size="icon" className={compact ? "size-8 rounded-full" : "size-9 rounded-full sm:size-10"} title="语音输入" aria-label="语音输入" onClick={() => setNotice("语音输入尚未接入，请输入文字或添加素材。")}><Mic /></Button>
        {!compact && <div className="flex shrink-0 items-center gap-2 text-sm sm:gap-3">
          <span aria-label={`${referenceMediaRate.current} 积分/秒，原价 ${referenceMediaRate.previous} 积分/秒`} title="参考积分，尚未接入计费" className="flex items-center gap-1"><Sparkles className="size-4 text-create" /><span className="font-semibold">{referenceMediaRate.current}</span><span className="text-xs text-muted-foreground">积分/s</span><s className="ml-1 text-muted-foreground">{referenceMediaRate.previous}</s></span>
        </div>}
          <Button type="submit" size="icon" aria-label="发送创作内容" title="发送" className={compact ? "size-8 rounded-full" : "size-10 rounded-full"} disabled={!text.trim()}><ArrowUp /></Button>
        </div>
      </div>
      {notice && <p role="status" className="mt-3 text-sm text-muted-foreground">{notice}</p>}
    </form>
  </section>;
}