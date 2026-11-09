import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { GameWorkspace } from "@/components/game-workspace";
import { parseWorkspaceTab, type WorkspaceTab } from "@/lib/game-workspace";
import { createGame } from "@/lib/games.functions";

type GameSearch = { tab: WorkspaceTab; prompt: string; project: string; id?: string };

export const Route = createFileRoute("/game")({
  validateSearch: (search: Record<string, unknown>): GameSearch => {
    const id = typeof search["id"] === "string" ? search["id"] : undefined;
    return { tab: parseWorkspaceTab(search["tab"]), prompt: typeof search["prompt"] === "string" ? search["prompt"] : "", project: typeof search["project"] === "string" ? search["project"] : "ArTrail", ...(id ? { id } : {}) };
  },
  head: () => ({ meta: [{ title: "游戏创作工作区 — ArTrail" }, { name: "description", content: "描述你的想法，ArTrail 用 AI 生成设计文档、美术资产和可试玩的网页游戏。" }, { property: "og:title", content: "游戏创作工作区 — ArTrail" }, { property: "og:description", content: "AI 生成设计、资产、代码，并直接试玩你的游戏。" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: GamePage,
});

function GamePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/game" });
  const create = useServerFn(createGame);
  const started = useRef(false);
  const [error, setError] = useState("");
  const creating = !search.id && !!search.prompt.trim();

  useEffect(() => {
    if (!creating || started.current) return;
    started.current = true;
    create({ data: { prompt: search.prompt } })
      .then(({ id }) => navigate({ search: { tab: "canvas", prompt: "", project: search.project, id }, replace: true }))
      .catch(() => setError("创建游戏失败，请返回重试。"));
  }, [creating]);

  if (creating) return <div className="flex h-dvh items-center justify-center gap-2 bg-surface-deep text-sm text-muted-foreground">{error || <><Loader2 className="animate-spin" />正在创建游戏…</>}</div>;
  return <GameWorkspace id={search.id} tab={search.tab} onTab={tab => { void navigate({ search: prev => ({ ...prev, tab }), replace: true }); }} />;
}
