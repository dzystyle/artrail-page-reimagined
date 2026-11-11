import { useState } from "react";
import { Check, ChevronDown, Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { mediaModels, type MediaMode } from "@/lib/media-composer";

const modeLabels: Record<MediaMode, string> = { agent: "Agent", video: "视频", image: "图片", audio: "音频" };

/** Media model + generation settings popover, shared by the /create composer and the homepage composer. */
export function MediaModelPicker({ mode, buttonClassName }: { mode: MediaMode; buttonClassName?: string }) {
  const [model, setModel] = useState(mediaModels[mode][0] ?? "");
  const [open, setOpen] = useState(false);
  const [ratio, setRatio] = useState("16:9");
  const [reference, setReference] = useState("全能参考");
  const [duration, setDuration] = useState(10);
  const [customSeed, setCustomSeed] = useState(false);
  const [seedValue, setSeedValue] = useState("");
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild><Button type="button" variant="ghost" aria-label="选择媒体模型" className={buttonClassName}><Grid2X2 /><span className="truncate">{modeLabels[mode]}：{model}</span><ChevronDown className="text-muted-foreground" /></Button></PopoverTrigger>
    <PopoverContent side="top" align="start" className="max-h-[70vh] w-[min(820px,calc(100vw-32px))] overflow-y-auto p-4 sm:p-5">
      <div className={`grid gap-5 ${mode === "video" || mode === "image" ? "sm:grid-cols-2" : ""}`}>
        <div><p className="mb-3 text-sm text-muted-foreground">模型</p>{mediaModels[mode].map(item => <Button type="button" variant="ghost" key={item} aria-pressed={model === item} className="mb-1 h-auto min-h-12 w-full justify-between whitespace-normal text-left" onClick={() => setModel(item)}><span>{item}</span>{model === item && <Check />}</Button>)}</div>
        {(mode === "video" || mode === "image") && <div className="space-y-5 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          {mode === "video" && <div><p className="mb-2 text-sm text-muted-foreground">模式选择</p><div className="flex rounded-full bg-secondary p-1">{["全能参考", "首尾帧"].map(item => <Button type="button" variant={reference === item ? "outline" : "ghost"} aria-pressed={reference === item} className="flex-1 rounded-full" key={item} onClick={() => setReference(item)}>{item}</Button>)}</div></div>}
          <div><p className="mb-2 text-sm text-muted-foreground">画面比例</p><div className="flex flex-wrap gap-1">{["智能", "16:9", "21:9", "9:16", "4:3", "1:1"].map(item => <Button type="button" variant={ratio === item ? "secondary" : "ghost"} aria-pressed={ratio === item} key={item} className="px-2" onClick={() => setRatio(item)}>{item}</Button>)}</div></div>
          {mode === "video" && <div><p className="mb-3 flex justify-between text-sm text-muted-foreground"><span>时长</span><span>{duration} 秒</span></p><Slider aria-label="视频时长" min={4} max={15} step={1} value={[duration]} onValueChange={value => setDuration(value[0] ?? 10)} /><div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>4秒</span><span>15秒</span></div></div>}
          <div><p className="mb-2 text-sm text-muted-foreground">Seed</p><div className="flex gap-2">{[false, true].map(value => <Button type="button" key={String(value)} variant={customSeed === value ? "secondary" : "ghost"} aria-pressed={customSeed === value} className="flex-1 px-2" onClick={() => setCustomSeed(value)}>{value ? "自定义生成" : "随机生成"}</Button>)}</div>{customSeed && <Input aria-label="自定义 Seed" type="number" min={0} step={1} value={seedValue} onChange={event => setSeedValue(event.target.value)} className="mt-2" />}</div>
        </div>}
      </div>
    </PopoverContent>
  </Popover>;
}
