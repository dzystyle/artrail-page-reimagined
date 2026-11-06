import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, ChevronDown, Users, Workflow, Sparkles } from "lucide-react";
import { Sidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projects, canvasNames } from "@/lib/project-catalog";
import c1 from "@/assets/canvas-1.jpg";
import c2 from "@/assets/canvas-2.jpg";
import c3 from "@/assets/canvas-3.jpg";
import c4 from "@/assets/canvas-4.jpg";
import w1 from "@/assets/work-1.jpg";
import w2 from "@/assets/work-2.jpg";
import w3 from "@/assets/work-3.jpg";
import w4 from "@/assets/work-4.jpg";
import w5 from "@/assets/work-5.jpg";
import w6 from "@/assets/work-6.jpg";
import w7 from "@/assets/work-7.jpg";
import w8 from "@/assets/work-8.jpg";

const pool = [c1, c2, c3, c4, w1, w2, w3, w4, w5, w6, w7, w8];
const people = ["郭智妍", "杨宇轩", "胡有为", "宋扬", "zhanghua", "朱玉儿", "杜致阳", "陈柏元"];
const times = ["1 分钟前编辑", "13 分钟前编辑", "25 分钟前编辑", "14 小时前编辑", "1 天前编辑", "2 天前编辑"];

export const Route = createFileRoute("/projects/$projectId")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    view: typeof search["view"] === "string" ? search["view"] : "",
  }),
  loader: ({ params }) => {
    const name = projects[params.projectId];
    if (!name) throw notFound();
    return { name };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.name} 的画布 — ArTrail` : "项目不存在 — ArTrail";
    return { meta: [
      { title: t },
      { name: "description", content: "浏览项目中的所有画布，按分享状态、成员和风格筛选。" },
      { property: "og:title", content: t },
      { property: "og:description", content: "浏览项目中的所有画布。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ] };
  },
  notFoundComponent: () => <div className="p-10 text-muted-foreground">项目不存在</div>,
  component: ProjectPage,
});

function ProjectPage() {
  const { name } = Route.useLoaderData();
  const { projectId } = Route.useParams();
  const [tab, setTab] = useState("全部");
  const { q, view } = Route.useSearch();
  const assetView = view === "assets";
  const navigate = Route.useNavigate();
  const setQ = (value: string) => void navigate({ search: (prev) => ({ ...prev, q: value }), replace: true });
  const seed = projectId.length;
  const canvases = canvasNames.map((n, i) => ({
    name: n, count: ((i * 37 + seed * 11) % 200) + 1,
    meta: `${times[i % times.length]} · ${people[(i + seed) % people.length]}`,
    imgs: i === 7 ? [] : [0, 1, 2, 3].map((k) => pool[(i + k * 3 + seed) % pool.length]),
  })).filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="px-6 py-5">
          {assetView && (
            <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-border pb-5">
              <h2 className="mr-auto text-lg font-semibold">项目资产</h2>
              <span className="text-sm text-muted-foreground">项目筛选</span>
              <Select value={projectId} onValueChange={(id) => void navigate({ to: "/projects/$projectId", params: { projectId: id }, search: (prev) => ({ ...prev, view: "assets" }) })}>
                <SelectTrigger aria-label="项目筛选" className="w-44 bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(projects).map(([id, projectName]) => <SelectItem key={id} value={id}>{projectName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">{name} · 所有画布 <span className="font-normal text-muted-foreground">({canvases.length})</span></h1>
            <div className="flex gap-1">
              {["全部", "我分享的", "分享给我的", "我创建的"].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3.5 py-1.5 text-sm ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{t}</button>
              ))}
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm"><Workflow />临时项目<ChevronDown /></Button>
              <Button variant="secondary" size="sm"><Users />全部人员<ChevronDown /></Button>
              <Button variant="secondary" size="sm">全部风格<ChevronDown /></Button>
              <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索画布..." className="h-9 w-48 pl-9" /></div>
              <Button size="sm"><Plus />新建画布</Button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {canvases.map((c) => (
              <button key={c.name} className="group rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent">
                <div className="grid aspect-[16/9] grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-lg bg-secondary">
                  {c.imgs.length ? c.imgs.map((src, k) => <img key={k} src={src} alt="" loading="lazy" className="size-full object-cover" />)
                    : <div className="col-span-2 row-span-2 grid place-items-center"><Sparkles className="size-8 text-muted-foreground" /></div>}
                </div>
                <div className="mt-3 flex items-center gap-2 px-1">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium">{c.name} <span className="font-normal text-muted-foreground">({c.count})</span></p>
                    <p className="truncate text-xs text-muted-foreground">{c.meta}</p>
                  </div>
                  <Workflow className="size-5 shrink-0 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
