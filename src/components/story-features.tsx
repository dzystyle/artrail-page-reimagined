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
    <section aria-label="完整的创作工具" className="mx-auto max-w-[860px] py-7 sm:py-8">
      <div className="grid grid-cols-3 gap-x-3 gap-y-4 lg:grid-cols-6">
        {features.map(f => (
          <div key={f.title} title={f.hint} className="flex items-center justify-center gap-2 text-muted-foreground">
            <f.icon className="size-3.5 shrink-0 text-project-mint" aria-hidden="true" />
            <p className="text-[11px] font-medium sm:text-xs">{f.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
