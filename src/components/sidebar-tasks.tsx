import { Component, Suspense, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { FileText, Gamepad2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gameListKey, gameListOptions } from "@/lib/game-list";
import { statusLabel } from "@/lib/game-pipeline";

class TaskErrorBoundary extends Component<{ children: ReactNode; onRetry: () => Promise<void> }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div className="px-2.5 text-xs text-muted-foreground"><p>任务加载失败</p><Button variant="ghost" size="sm" onClick={() => { void this.props.onRetry().then(() => this.setState({ failed: false })); }}>重试</Button></div>;
  }
}

function SavedTasks() {
  const { data: games } = useSuspenseQuery(gameListOptions());
  if (!games.length) return <p className="px-2.5 py-2 text-xs text-muted-foreground">还没有游戏任务</p>;
  return <>{games.map(game => {
    const pending = ["designing", "assets", "coding", "revising"].includes(game.status);
    const Icon = pending ? Loader2 : Gamepad2;
    return <Button key={game.id} asChild variant="ghost" className="h-9 w-full justify-start gap-2.5 rounded-lg px-2.5 text-[15px] font-normal text-sidebar-foreground hover:bg-sidebar-accent">
      <Link to="/game" search={{ id: game.id, tab: "canvas", prompt: "", project: "ArTrail" }} title={`${game.title} · ${statusLabel[game.status] ?? game.status}`}>
        <Icon className={`size-[18px] shrink-0 ${pending ? "animate-spin text-create motion-reduce:animate-none" : ""}`} /><span className="truncate">{game.title}</span>
      </Link>
    </Button>;
  })}</>;
}

export function SidebarTasks() {
  const queryClient = useQueryClient();
  return <div className="min-h-0 space-y-[5px] overflow-y-auto" aria-label="游戏任务列表">
    <Button asChild variant="ghost" className="h-9 w-full justify-start gap-2.5 rounded-lg px-2.5 text-[15px] font-normal text-sidebar-foreground hover:bg-sidebar-accent">
      <Link to="/build" search={{ mode: "build" }}><FileText className="size-[18px] shrink-0" /><span>新建任务</span></Link>
    </Button>
    <TaskErrorBoundary onRetry={() => queryClient.resetQueries({ queryKey: gameListKey })}>
      <Suspense fallback={<div role="status" className="flex items-center gap-2 px-2.5 py-2 text-xs text-muted-foreground"><Loader2 className="size-4 animate-spin" />正在加载任务…</div>}><SavedTasks /></Suspense>
    </TaskErrorBoundary>
  </div>;
}