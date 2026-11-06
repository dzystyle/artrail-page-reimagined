import { Link } from "@tanstack/react-router";
import { Clock, Box, Link2, User, Server } from "lucide-react";

export function MultiplayerPanel() {
  return <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
    <div className="flex max-w-[560px] flex-col items-center text-center">
      <div className="relative mb-8 h-[110px] w-[170px]" aria-hidden>
        <span className="absolute left-0 top-0 grid size-[62px] -rotate-12 place-items-center rounded-xl border border-border bg-gradient-to-br from-secondary to-surface-deep shadow-lg"><User className="size-7 text-muted-foreground" /></span>
        <span className="absolute right-0 top-0 grid size-[62px] rotate-12 place-items-center rounded-xl border border-border bg-gradient-to-br from-secondary to-surface-deep shadow-lg"><User className="size-7 text-muted-foreground" /></span>
        <span className="absolute bottom-0 left-1/2 grid size-[72px] -translate-x-1/2 place-items-center rounded-xl border border-border bg-gradient-to-br from-secondary to-surface-deep shadow-xl"><Server className="size-9 text-muted-foreground" /></span>
      </div>
      <h2 className="text-lg font-semibold">启用多人连接功能</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">使用云端计算机让游戏服务器持续运行。部署完成后，玩家可以随时通过邀请链接加入。</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {[[Clock, "始终在线"], [Box, "自动部署"], [Link2, "邀请链接"]].map(([Icon, t]) => { const I = Icon as typeof Clock; return <span key={t as string} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-muted-foreground"><I className="size-4" />{t as string}</span>; })}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">在 ArTrail 中打开<Link to="/settings" className="mx-0.5 text-foreground/80 underline underline-offset-4 hover:text-foreground">设置</Link>&gt; 我的电脑来创建或管理云电脑。</p>
    </div>
  </div>;
}
