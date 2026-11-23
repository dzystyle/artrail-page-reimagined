import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { marked } from "marked";
import { Sidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import prdMarkdown from "@/lib/build-prd.md?raw";

export const Route = createFileRoute("/build/prd")({
  head: () => {
    const title = "/build 产品需求文档 — ArTrail";
    const description = "ArTrail /build 构建游戏与互动影游页面的产品需求文档：功能清单、交互规则、数据边界、异常风险与迭代建议。";
    return { meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ] };
  },
  component: BuildPrdPage,
});

function BuildPrdPage() {
  const html = useMemo(() => marked.parse(prdMarkdown, { async: false }), []);
  return <div className="flex min-h-screen bg-background text-foreground">
    <Sidebar />
    <main className="h-screen min-w-0 flex-1 overflow-y-auto">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border/50 bg-background/90 px-5 backdrop-blur sm:px-8">
        <Button asChild variant="ghost" size="icon"><Link to="/build" search={{ mode: "build" }} aria-label="返回构建" title="返回构建"><ArrowLeft /></Link></Button>
        <FileText className="size-4 text-project-mint" aria-hidden="true" />
        <span className="text-sm font-medium">产品需求文档</span>
        <span className="text-xs text-muted-foreground">/build · v1.0</span>
      </header>
      <article className="prd-doc mx-auto max-w-[860px] px-5 pb-20 pt-8 sm:px-8" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  </div>;
}
