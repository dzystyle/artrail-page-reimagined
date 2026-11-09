import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, FlaskConical, Play, Sparkles } from "lucide-react";
import { Sidebar } from "@/components/app-sidebar";
import { HomeComposer } from "@/components/home-composer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";
import work6 from "@/assets/work-6.jpg";
import work7 from "@/assets/work-7.jpg";
import work8 from "@/assets/work-8.jpg";
import template1 from "@/assets/build-templates-1.jpg";
import template2 from "@/assets/build-templates-2.jpg";
import template3 from "@/assets/build-templates-3.jpg";
import template4 from "@/assets/build-templates-4.jpg";
import template5 from "@/assets/build-templates-5.jpg";
import template6 from "@/assets/build-templates-6.jpg";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "创建图片和视频 — ArTrail" },
      { name: "description", content: "在 ArTrail 用模板和炼金模式创建图片与视频：短片、推广广告、讲解视频和产品展示。" },
      { property: "og:title", content: "创建图片和视频 — ArTrail" },
      { property: "og:description", content: "用模板和炼金模式创建图片与视频：短片、推广广告、讲解视频和产品展示。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePage,
});

const heroTemplates = [
  { name: "那只鹦鹉", kind: "短片", badge: "模板", image: work1, prompt: "用短片模板《那只鹦鹉》创作一支剧情短片" },
  { name: "Hush", kind: "推广广告", badge: "模板", image: work2, prompt: "用推广广告模板《Hush》创作一支产品广告" },
  { name: "太阳能发电解析", kind: "讲解视频", badge: "模板", image: work3, prompt: "用讲解视频模板《太阳能发电解析》创作一支科普讲解视频" },
  { name: "猫斯拉直播", kind: "炼金模式", badge: "炼金模式", image: work4, prompt: "用炼金模式创作一支《猫斯拉直播》风格的创意视频" },
];

const tabs = ["所有模板", "营销", "编辑你的素材", "AI 短片", "AI 短剧"];

const templates = [
  { name: "短片", desc: "剧情短片与预告", image: template1, tab: "AI 短片" },
  { name: "推广广告", desc: "产品与品牌广告", image: template2, tab: "营销" },
  { name: "讲解视频", desc: "科普与教学讲解", image: template3, tab: "AI 短片" },
  { name: "产品展示", desc: "3D 产品环游展示", image: template4, tab: "营销" },
  { name: "网站转发布视频", desc: "把网站变成发布视频", image: template5, tab: "编辑你的素材" },
  { name: "高光片段", desc: "直播与长视频切片", image: template6, tab: "编辑你的素材" },
];

const alchemyVideos = [
  { name: "突发新闻现场", image: work5 },
  { name: "雪人和小女孩", image: work6 },
  { name: "火焰特效转场", image: work7 },
  { name: "柯基试装", image: work8 },
  { name: "访谈高光", image: work1 },
  { name: "舞动时刻", image: work2 },
  { name: "美食特写", image: work3 },
  { name: "设计师日常", image: work4 },
];

const models = ["ArTrail 2.0 Lite", "ArTrail 2.0", "ArTrail 1.5"];

function ModelPicker() {
  const [model, setModel] = useState(models[0]!);
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" aria-label="选择模型" className="gap-1.5 px-2 text-[15px] font-medium">
          {model}<ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 rounded-xl p-1.5">
        {models.map(m => (
          <Button key={m} type="button" variant="ghost" className="h-10 w-full justify-between px-3 font-normal" onClick={() => { setModel(m); setOpen(false); }}>
            {m}{model === m && <Check className="size-4" />}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function CreatePage() {
  const mainRef = useRef<HTMLElement>(null);
  const templateRow = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(tabs[0]!);
  const [seed, setSeed] = useState<{ text: string; n: number } | null>(null);
  const visibleTemplates = templates.filter(t => tab === "所有模板" || t.tab === tab);
  const useTemplate = (prompt: string) => {
    setSeed(s => ({ text: prompt, n: (s?.n ?? 0) + 1 }));
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollTemplates = (dir: number) => templateRow.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main ref={mainRef} className="h-screen min-w-0 flex-1 overflow-y-auto">
        <header className="flex h-[52px] items-center justify-between px-5">
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" className="lg:hidden"><Link to="/" aria-label="返回首页" title="返回首页"><ArrowLeft /></Link></Button>
            <ModelPicker />
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-[15px]"><Sparkles className="size-4" />300</span>
            <ThemeToggle />
          </div>
        </header>

        <div className="mx-auto max-w-[1240px] px-5 pb-16 sm:px-8">
          <section className="mx-auto max-w-[800px] pt-2">
            <h1 className="sr-only">创建图片和视频</h1>
            <HomeComposer scrollRoot={mainRef} initialType="Asset Canvas" seed={seed} />
          </section>

          {/* 顶部模板大卡 */}
          <section aria-label="推荐模板" className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {heroTemplates.map(t => (
              <button key={t.name} type="button" onClick={() => useTemplate(t.prompt)} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60 text-left">
                <img src={t.image} alt={t.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3">
                  <span className="flex items-center gap-1.5 text-[13px] text-white/80">
                    {t.kind}
                    <span className={`rounded px-1.5 py-px text-[11px] ${t.badge === "炼金模式" ? "bg-primary text-primary-foreground" : "bg-white/20 backdrop-blur"}`}>{t.badge === "炼金模式" ? <span className="flex items-center gap-0.5"><FlaskConical className="size-3" />{t.badge}</span> : t.badge}</span>
                  </span>
                  <span className="mt-0.5 block text-[17px] font-semibold text-white">{t.name}</span>
                </span>
              </button>
            ))}
          </section>

          {/* 模板标签页 */}
          <section aria-label="模板分类" className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <div role="tablist" aria-label="模板分类" className="flex flex-wrap items-center gap-1">
                {tabs.map(t => (
                  <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                    className={`rounded-lg px-3 py-1.5 text-[15px] transition-colors ${tab === t ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
                ))}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" className="mr-1 text-sm text-muted-foreground hover:text-foreground">查看全部</button>
                <Button variant="ghost" size="icon" aria-label="向左滚动模板" onClick={() => scrollTemplates(-1)}><ChevronLeft /></Button>
                <Button variant="ghost" size="icon" aria-label="向右滚动模板" onClick={() => scrollTemplates(1)}><ChevronRight /></Button>
              </div>
            </div>
            <div ref={templateRow} className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleTemplates.map(t => (
                <button key={t.name} type="button" onClick={() => useTemplate(`用${t.name}模板创作一段视频`)} className="group w-[200px] shrink-0 text-left">
                  <span className="relative block aspect-video overflow-hidden rounded-xl border border-border/60">
                    <img src={t.image} alt={t.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-2 left-2.5 text-[15px] font-medium text-white">{t.name}</span>
                  </span>
                  <span className="mt-1.5 block truncate text-xs text-muted-foreground">{t.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 炼金模式作品 */}
          <section aria-labelledby="alchemy-title" className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="alchemy-title" className="flex items-center gap-1.5 text-[17px] font-semibold">
                使用 <span className="flex items-center gap-1 text-link">炼金模式<FlaskConical className="size-4" /></span> 制作
              </h2>
              <p className="rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-[13px] text-muted-foreground">
                使用 ArTrail 2.0 和 炼金模式 创作更好的视频。<button type="button" onClick={() => useTemplate("用炼金模式创作一支创意视频")} className="ml-1 text-link hover:underline">试用 炼金模式</button>
              </p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {alchemyVideos.map(v => (
                <button key={v.name} type="button" onClick={() => useTemplate(`参考《${v.name}》的风格创作一段视频`)} className="group relative aspect-video overflow-hidden rounded-xl border border-border/60 text-left">
                  <img src={v.image} alt={v.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <span className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[15px] font-medium text-white opacity-0 transition group-hover:opacity-100"><Play className="size-4 fill-current" />{v.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
