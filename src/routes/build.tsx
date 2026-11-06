import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowLeft, Globe, Image, Gamepad2, Umbrella, Moon, Ghost } from "lucide-react";
import { Sidebar } from "@/components/app-sidebar";
import { HomeComposer } from "@/components/home-composer";
import { Button } from "@/components/ui/button";
import explore1 from "@/assets/build-explore-1.jpg";
import explore2 from "@/assets/build-explore-2.jpg";
import explore3 from "@/assets/build-explore-3.jpg";
import explore4 from "@/assets/build-explore-4.jpg";
import explore5 from "@/assets/build-explore-5.jpg";
import template1 from "@/assets/build-templates-1.jpg";
import template2 from "@/assets/build-templates-2.jpg";
import template3 from "@/assets/build-templates-3.jpg";
import template4 from "@/assets/build-templates-4.jpg";
import template5 from "@/assets/build-templates-5.jpg";
import template6 from "@/assets/build-templates-6.jpg";
import template7 from "@/assets/build-templates-7.jpg";
import template8 from "@/assets/build-templates-8.jpg";

export const Route = createFileRoute("/build")({
  head: () => ({ meta: [
    { title: "构建网站、应用和游戏 — ArTrail" },
    { name: "description", content: "在 ArTrail 开始构建，浏览近期项目、游戏作品和资产模板。" },
    { property: "og:title", content: "构建网站、应用和游戏 — ArTrail" },
    { property: "og:description", content: "开始创作，探索游戏作品与人物、地图、场景等资产模板。" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: BuildPage,
});

const recent = [
  { name: "游戏官网首页", time: "50 分钟前", icon: Umbrella, type: Globe },
  { name: "测试", time: "1 小时前", icon: Moon, type: Globe },
  { name: "小猫钓鱼图", time: "1 小时前", icon: Ghost, type: Image },
  { name: "超级马里奥", time: "18 小时前", icon: Moon, type: Gamepad2 },
];
const works = [
  { name: "电路工匠", image: explore1, type: "网页游戏" },
  { name: "潮汐研讨会", image: explore2, type: "网页游戏" },
  { name: "余烬之路", image: explore3, type: "网页游戏" },
  { name: "湿地观鸟", image: explore4, type: "网页游戏" },
  { name: "末班车", image: explore5, type: "互动故事" },
];
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
  const mainRef = useRef<HTMLElement>(null);
  return <div className="flex min-h-screen bg-background text-foreground">
    <Sidebar />
    <main ref={mainRef} className="h-screen min-w-0 flex-1 overflow-y-auto">
      <header className="flex h-[52px] items-center px-5">
        <Button asChild variant="ghost" size="icon"><Link to="/" aria-label="返回创作" title="返回创作"><ArrowLeft /></Link></Button>
      </header>
      <div className="mx-auto max-w-[1240px] px-5 pb-14 sm:px-8">
        <section className="mx-auto max-w-[800px] pt-3">
          <h1 className="text-center text-2xl font-semibold sm:text-[28px]">我们今天要做什么？</h1>
          <HomeComposer scrollRoot={mainRef} />
        </section>
        <section aria-labelledby="recent-projects" className="mt-3">
          <h2 id="recent-projects" className="mb-4 text-base font-semibold">近期项目</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 xl:grid-cols-4">
            {recent.map((p, i) => <div key={p.name}>
              <div className={`grid aspect-[1.8] place-items-center rounded-lg ${i === 3 ? "bg-project-mint" : "bg-project-lilac"}`}><p.icon className="size-10 text-foreground/80" strokeWidth={1.5} /></div>
              <div className="mt-3 flex gap-2"><p.type className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><div><p className="text-sm font-medium">{p.name}</p><p className="mt-0.5 text-xs text-muted-foreground">编辑于 {p.time}</p></div></div>
            </div>)}
          </div>
        </section>
        <section aria-labelledby="explore-works" className="mt-9">
          <h2 id="explore-works" className="mb-4 text-base font-semibold">探索</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 xl:grid-cols-4">
            {works.map(w => <div key={w.name}><img src={w.image} alt={w.name} width={512} height={320} loading="lazy" className="aspect-[1.6] w-full rounded-lg object-cover" /><h3 className="mt-2 text-sm font-medium">{w.name}</h3><p className="mt-0.5 text-xs text-muted-foreground">{w.type}</p></div>)}
          </div>
        </section>
        <section aria-labelledby="asset-templates" className="mt-10 border-t border-border pt-8">
          <h2 id="asset-templates" className="mb-5 text-xl font-semibold">资产模板</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 xl:grid-cols-4">
            {templates.map(t => <div key={t.name}><img src={t.image} alt={t.name} width={400} height={504} loading="lazy" className="aspect-[1.6] w-full rounded-lg object-cover" /><h3 className="mt-3 text-base font-medium">{t.name}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.desc}</p></div>)}
          </div>
        </section>
      </div>
    </main>
  </div>;
}