import { Gamepad2, GitBranch, LayoutTemplate, MousePointerClick, Network, Sparkles } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "让灵感成为画面",
    desc: "从故事构思、角色设定到分镜，AI 助手逐步引导；连接参考素材，生成图片与视频。",
    tags: ["AI 剧本", "角色与分镜", "视频生成"],
  },
  {
    icon: GitBranch,
    title: "让剧情拥有分支",
    desc: "在可视化画布上连接视频与互动节点，用选项、变量与条件，构建不同的故事走向。",
    tags: ["节点画布", "变量条件", "多结局"],
  },
  {
    icon: MousePointerClick,
    title: "让观众走进故事",
    desc: "配置画面按钮与点击热区，加入点击、长按等互动。试玩检查后，以链接或二维码分享。",
    tags: ["画面内按钮", "多种互动", "发布分享"],
  },
  {
    icon: Gamepad2,
    title: "小游戏插件",
    desc: "直接在互动影游中添加小游戏，将关卡挑战与观看剧情衔接起来，为故事加入更多可玩的内容。",
    tags: ["嵌入小游戏", "关卡体验", "影游融合"],
  },
  {
    icon: LayoutTemplate,
    title: "页面主题封装",
    desc: "为完成的影游封装首页、尾页与逻辑树页面，统一作品的视觉主题，让进入、探索和结束形成完整体验。",
    tags: ["首页与尾页", "逻辑树页面", "主题包装"],
  },
  {
    icon: Network,
    title: "影游内逻辑图",
    desc: "在影游内快速呈现关卡与剧情观看的逻辑图，让观众直观理解关卡关系、故事分支与剧情走向。",
    tags: ["关卡关系", "剧情路径", "影游内查看"],
  },
];

export function StoryFeatures() {
  return (
    <section aria-labelledby="story-features" className="pt-6">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Create without limits</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id="story-features" className="max-w-[560px] text-3xl font-semibold leading-tight sm:text-4xl">
          你的想象力，
          <br />
          有了完整的创作工具。
        </h2>
        <p className="max-w-[320px] text-sm leading-relaxed text-muted-foreground lg:pb-1 lg:text-right">
          从内容生成、互动设计到作品封装。
          <br />
          让每一个故事，都拥有完整的可玩体验。
        </p>
      </div>
      <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
        {features.map((f, index) => (
          <article key={f.title} className="relative bg-card p-6 transition-colors hover:bg-accent/40">
            <span aria-hidden className="absolute right-6 top-6 text-xs tabular-nums text-muted-foreground/60">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
              <f.icon className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {f.tags.map(tag => (
                <span key={tag} className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
