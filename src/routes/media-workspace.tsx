import { createFileRoute } from "@tanstack/react-router";
import { MediaCreationWorkspace } from "@/components/media-creation-workspace";
import { validateMediaWorkspaceSearch } from "@/lib/media-workspace";

export const Route = createFileRoute("/media-workspace")({
  validateSearch: validateMediaWorkspaceSearch,
  head: () => ({ meta: [
    { title: "媒体创作画布 — ArTrail" },
    { name: "description", content: "在 ArTrail 画布中整理游戏宣传图片、视频与音频的创作需求和参考素材。" },
    { property: "og:title", content: "媒体创作画布 — ArTrail" },
    { property: "og:description", content: "游戏媒体创作工作区：画布素材、创作助手与需求文档。" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MediaWorkspacePage,
});
function MediaWorkspacePage() { const search = Route.useSearch(); return <MediaCreationWorkspace {...search} />; }