import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GameWorkspace } from "@/components/game-workspace";
import { parseWorkspaceTab } from "@/lib/game-workspace";
export const Route = createFileRoute("/game")({
  validateSearch: (search: Record<string, unknown>) => ({ tab: parseWorkspaceTab(search['tab']), prompt: typeof search['prompt'] === 'string' ? search['prompt'] : '', project: typeof search['project'] === 'string' ? search['project'] : 'ArTrail' }),
  head: () => ({ meta: [{ title: "游戏创作工作区 — ArTrail" }, { name: "description", content: "在 ArTrail 画布中整理游戏需求、查看设计与资产、阅读代码并试玩游戏示例。" }, { property: "og:title", content: "游戏创作工作区 — ArTrail" }, { property: "og:description", content: "画布、设计、资产、代码与 Game 试玩的统一创作工作区。" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: GamePage,
});
function GamePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: '/game' });
  return <GameWorkspace tab={search.tab} prompt={search.prompt} project={search.project} onTab={tab => { void navigate({ search: prev => ({ ...prev, tab }), replace: true }); }} />;
}
