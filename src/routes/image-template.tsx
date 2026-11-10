import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { imageTemplates } from "@/lib/image-templates";
import { ImageTemplateWorkspace } from "@/components/image-template-workspace";

type Search = { id: string };

export const Route = createFileRoute("/image-template")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s["id"] === "string" && imageTemplates.some(t => t.id === s["id"]) ? s["id"] : "style",
  }),
  head: () => ({
    meta: [
      { title: "图片模板工作台 — ArTrail" },
      { name: "description", content: "选择游戏图片模板，替换示例图并生成同类型游戏素材。" },
      { property: "og:title", content: "图片模板工作台 — ArTrail" },
      { property: "og:description", content: "选择游戏图片模板，替换示例图并生成同类型游戏素材。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImageTemplatePage,
});

function ImageTemplatePage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const template = imageTemplates.find(item => item.id === id);
  if (!template) return null;
  return <div className="h-dvh"><ImageTemplateWorkspace key={template.id} initialTemplate={template} onClose={() => void navigate({ to: "/" })} /></div>;
}
