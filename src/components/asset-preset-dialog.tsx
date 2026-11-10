import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PixelPreview } from "./pixel-preview";
import { getAssetPreset, pixelStyles, type PixelStyle } from "@/lib/asset-presets";
import { assetPresetImages } from "@/lib/asset-preset-images";
export function AssetPresetDialog({ template, onClose }: { template: string | null; onClose: () => void }) {
  const [density, setDensity] = useState<PixelStyle>("classic");
  const navigate = useNavigate();
  const preset = getAssetPreset(template);
  return <Dialog open={!!preset} onOpenChange={open => !open && onClose()}><DialogContent className="w-[calc(100vw-32px)] max-w-[1000px] max-h-[90dvh] overflow-y-auto rounded-lg p-6 sm:p-8">
    <DialogTitle className="text-2xl">创建{preset?.name}模板</DialogTitle>
    <DialogDescription className="mt-3">选择像素风格</DialogDescription>
    <div className="my-5 grid grid-cols-1 gap-4 sm:grid-cols-3">{pixelStyles.map(style => <Button key={style.id} variant="outline" aria-label={`选择${style.name}`} aria-pressed={density === style.id} onClick={() => setDensity(style.id)} className={`relative block h-auto whitespace-normal rounded-lg p-3 text-left ${density === style.id ? "border-foreground ring-1 ring-foreground" : "border-border bg-secondary/30"}`}>
      <PixelPreview src={assetPresetImages[preset?.id ?? "characters"] ?? ""} resolution={style.resolution} label={style.name} />
      <span className="mt-3 flex items-center justify-between text-lg font-semibold">{style.name}{density === style.id && <Check />}</span>
      <span className="mt-1 block text-xs text-muted-foreground">{style.english}</span><span className="mt-2 block text-sm font-normal leading-relaxed text-muted-foreground">{style.detail}</span>
    </Button>)}</div>
    <footer className="flex justify-end gap-3"><Button variant="ghost" onClick={onClose}>取消</Button><Button onClick={() => { if (!preset) return; void navigate({ to: "/asset-template", search: { template: preset.id, density } }); }}>创建画布</Button></footer>
  </DialogContent></Dialog>;
}