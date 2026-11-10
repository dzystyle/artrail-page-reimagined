import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Grid2X2 } from "lucide-react";
import { AssetTemplateCanvas } from "@/components/asset-template-canvas";
import { Button } from "@/components/ui/button";
import { getAssetPreset, getPixelStyle } from "@/lib/asset-presets";

export const Route = createFileRoute("/asset-template")({
  validateSearch: (search: Record<string, unknown>) => ({ template: getAssetPreset(search["template"])?.id ?? "characters", density: getPixelStyle(search["density"])?.id ?? "classic" }),
  head: ({ match }) => {
    const title = `${getAssetPreset(match.search.template)?.name}资产画布 — ArTrail`;
    const description = "选择像素风格，替换参考图片，生成风格一致的游戏资产。";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: AssetTemplatePage,
});
function AssetTemplatePage() {
  const { template, density } = Route.useSearch();
  return <main className="flex h-dvh flex-col overflow-hidden bg-background text-foreground"><header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-5"><Button asChild variant="ghost" size="icon"><Link to="/build" search={{ mode: "build" }} aria-label="返回游戏首页" title="返回游戏首页"><ArrowLeft /></Link></Button><Grid2X2 className="size-4 text-muted-foreground" /><h1 className="text-sm font-semibold">{getAssetPreset(template)?.name}资产模板</h1><span className="ml-auto text-sm text-muted-foreground">ArTrail</span></header><AssetTemplateCanvas template={template} density={density} /></main>;
}