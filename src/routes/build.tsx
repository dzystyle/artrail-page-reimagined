import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Clapperboard, Gamepad2 } from "lucide-react";
import { Sidebar } from "@/components/app-sidebar";
import { HomeComposer } from "@/components/home-composer";
import { ExploreGames, type ExploreGame } from "@/components/explore-games";
import { RandomHeroGame } from "@/components/random-hero-game";
import { StoryFeatures } from "@/components/story-features";
import { Button } from "@/components/ui/button";
import { AssetPresetDialog } from "@/components/asset-preset-dialog";
import { assetPresets } from "@/lib/asset-presets";
import { buildWorks } from "@/lib/build-works";
import { parseCreationMode, worksForMode } from "@/lib/creation-mode";
import template1 from "@/assets/build-templates-1.jpg";
import template2 from "@/assets/build-templates-2.jpg";
import template3 from "@/assets/build-templates-3.jpg";
import template4 from "@/assets/build-templates-4.jpg";
import template5 from "@/assets/build-templates-5.jpg";
import template6 from "@/assets/build-templates-6.jpg";
import template7 from "@/assets/build-templates-7.jpg";
import template8 from "@/assets/build-templates-8.jpg";

export const Route = createFileRoute("/build")({
  validateSearch: (search: Record<string, unknown>) => ({ mode: parseCreationMode(search['mode']) }),
  head: ({ match }) => {
    const story = match.search.mode === "story";
    const title = story ? "互动故事创作 — ArTrail" : "构建游戏 — ArTrail";
    const description = story ? "在 ArTrail 创作互动故事，探索场景、选择和分支故事案例。" : "在 ArTrail 从玩法开始构建游戏，探索动作、街机、策略与模拟游戏案例和游戏资产模板。";
    return { meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }; },
  component: BuildPage,
});

const templates = [
  { name: "人物", desc: "角色设定图、精灵图和头像", image: template1 },
  { name: "帧动画", desc: "空闲、行走、奔跑、攻击和受伤帧", image: template2 },
  { name: "地图", desc: "地形、图块集和建筑物", image: template3 },
  { name: "项目和用户界面", desc: "道具、设备和用户界面图标", image: template4 },
  { name: "生物", desc: "怪物和动物", image: template5 },
  { name: "场景", desc: "游戏背景和环境", image: template6 },
  { name: "服装", desc: "给角色换装", image: template7 },
  { name: "效果", desc: "打击、爆发、斩击和轨迹", image: template8 },
];

function BuildPage() {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  const { mode } = Route.useSearch();
  const story = mode === "story";
  const visibleWorks = worksForMode(buildWorks, mode);
  const [baseGame, setBaseGame] = useState<ExploreGame | null>(null);
  const [assetTemplate, setAssetTemplate] = useState<string | null>(null);
  const [seed, setSeed] = useState<{ text: string; n: number } | null>(null);
  const toComposer = () => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  return <div className="flex min-h-screen bg-background text-foreground">
    <Sidebar />
    <main ref={mainRef} className="h-screen min-w-0 flex-1 overflow-y-auto">
      <header className="flex h-16 items-center gap-2 border-b border-border/50 px-5 sm:px-8">
        <Button asChild variant="ghost" size="icon"><Link to="/" aria-label="返回创作" title="返回创作"><ArrowLeft /></Link></Button>
        <Link to="/" className="text-xs text-muted-foreground transition-colors hover:text-foreground">创作</Link>
        <span aria-hidden="true" className="text-xs text-muted-foreground/50">/</span>
        <span className="text-xs font-medium">{story ? "互动影游" : "构建游戏"}</span>
      </header>
      <div className="mx-auto max-w-[1200px] px-5 pb-14 sm:px-10">
        <section className="mx-auto max-w-[900px] pb-10 pt-12 sm:pb-14 sm:pt-16">
          <div className="mb-5 flex items-center justify-center gap-2 text-project-mint">
            {story ? <Clapperboard className="size-4" /> : <Gamepad2 className="size-4" />}
            <span className="text-[11px] font-medium tracking-[0.12em]">ArTrail / {story ? "INTERACTIVE STORY" : "GAME STUDIO"}</span>
          </div>
          <h1 className="text-center text-[30px] font-semibold leading-tight sm:text-[40px]">{story ? "互动影游创作" : "构建游戏"}</h1>
          <p className="mt-4 text-center text-sm leading-6 text-muted-foreground sm:text-base">{story ? "描述你的故事，AI 帮你生成可玩的互动影游" : "从一个玩法开始，打造你的游戏世界"}</p>
          {story && <StoryFeatures />}
          <div className={`build-page-composer ${story ? "" : "mt-8"}`}>
          <HomeComposer key={mode} simple gameOnly={!story} scrollRoot={mainRef} baseGame={story ? null : baseGame} onRemoveBaseGame={() => setBaseGame(null)} seed={seed} initialType={story ? "Interactive Story" : "Web Game"} onCreate={story ? undefined : request => { void navigate({ to: "/game", search: { tab: "canvas", prompt: request.prompt, project: request.project } }); }} />
          </div>
        </section>
        {story ? <section aria-labelledby="explore-works" className="border-t border-border pt-7 sm:pt-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 id="explore-works" className="text-base font-semibold">互动故事案例</h2>
            <span className="text-[11px] text-muted-foreground">STORY SHOWCASE</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-x-5">
            {visibleWorks.map(w => {
              const card = <><div className="relative overflow-hidden rounded-lg"><img src={w.image} alt={w.name} width={512} height={320} loading="lazy" className="aspect-video w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]" />{w.url && <span className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-full border border-border bg-background/85 text-foreground"><ArrowUpRight className="size-3.5" aria-hidden="true" /></span>}</div><div className="pt-3"><h3 className="truncate text-sm font-medium sm:text-base">{w.name}</h3><p className="mt-1 text-xs text-muted-foreground">{w.type}</p></div></>;
              return w.url
                ? <a key={w.name} href={w.url} target="_blank" rel="noopener noreferrer" className="group block min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">{card}</a>
                : <div key={w.name} className="group min-w-0">{card}</div>;
            })}
          </div>
        </section> : <><section aria-label="随机小游戏" className="mb-10 overflow-hidden border-y border-border py-6"><RandomHeroGame /></section><ExploreGames onContinue={g => { setBaseGame(g); toComposer(); }} onUsePrompt={g => { setSeed({ text: g.prompt, n: Date.now() }); toComposer(); }} /></>}
        {!story && <section aria-labelledby="asset-templates" className="mt-10 border-t border-border pt-8">
          <h2 id="asset-templates" className="mb-5 text-xl font-semibold">资产模板</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 xl:grid-cols-4">
            {templates.map((t, index) => <Button key={t.name} variant="ghost" onClick={() => setAssetTemplate(assetPresets[index]?.id ?? "characters")} aria-label={`使用${t.name}资产模板`} className="block h-auto min-w-0 whitespace-normal p-0 text-left"><img src={t.image} alt={t.name} width={400} height={504} loading="lazy" className="aspect-[1.6] w-full rounded-lg object-cover" /><h3 className="mt-3 text-base font-medium">{t.name}</h3><p className="mt-1 text-sm font-normal leading-relaxed text-muted-foreground">{t.desc}</p></Button>)}
          </div>
        </section>}
      </div>
    </main>
    <AssetPresetDialog template={assetTemplate} onClose={() => setAssetTemplate(null)} />
  </div>;
}