import { Gamepad2, GitBranch, LayoutTemplate, MousePointerClick, Network, Sparkles } from "lucide-react";

const features = [
  { icon: Sparkles, title: "灵感成画面", hint: "AI 剧本 · 分镜 · 视频生成" },
  { icon: GitBranch, title: "剧情分支", hint: "节点画布 · 变量条件 · 多结局" },
  { icon: MousePointerClick, title: "观众互动", hint: "画面按钮 · 热区 · 分享" },
  { icon: Gamepad2, title: "小游戏插件", hint: "嵌入关卡挑战" },
  { icon: LayoutTemplate, title: "主题封装", hint: "首页尾页 · 逻辑树" },
  { icon: Network, title: "影游逻辑图", hint: "关卡关系 · 剧情路径" },
];

export function StoryFeatures() {
  return (
    <section aria-label="完整的创作工具" className="pb-7 pt-6">
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 xl:grid-cols-6">
        {features.map(f => (
          <div key={f.title} className="group flex flex-col items-center text-center">
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted/60 text-muted-foreground transition-colors group-hover:border-foreground/25 group-hover:text-foreground">
              <f.icon className="size-4" />
            </div>
            <p className="mt-2 text-xs font-medium">{f.title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{f.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
