import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { WorkDetail } from "@/components/work-detail";
import { findWork } from "@/lib/works";

export const Route = createFileRoute("/works/$workId")({
  loader: ({ params }) => {
    const work = findWork(params.workId);
    if (!work) throw notFound();
    return { work };
  },
  head: ({ loaderData }) => {
    const work = loaderData?.work;
    const title = work ? `${work.title} — ArTrail` : "作品 — ArTrail";
    const description = work
      ? `${work.title}：${work.description}`
      : "在 ArTrail 查看精选作品详情。";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: WorkPage,
});

function WorkPage() {
  const { work } = Route.useLoaderData();
  const navigate = useNavigate();
  return <WorkDetail work={work} onBack={() => navigate({ to: "/" })} />;
}
