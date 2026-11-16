import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getGameCategory } from "@/lib/game-categories";
import type { HomeGamePreview } from "@/lib/home-game-previews";

export const Route = createFileRoute("/games/$category")({
  beforeLoad: ({ params }) => {
    if (!getGameCategory(params.category)) throw notFound();
  },
  head: ({ params }) => {
    const category = getGameCategory(params.category);
    const title = category ? `${category.title}游戏 · ArTrail` : "游戏分类 · ArTrail";
    const description = category?.description ?? "浏览该分类下的全部游戏。";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: GameCategoryPage,
});

function CategoryCard({ game, onSelect, className }: { game: HomeGamePreview; onSelect: (game: HomeGamePreview) => void; className?: string }) {
  return (
    <Button variant="ghost" aria-label={`预览${game.title}`} onClick={() => onSelect(game)} className={`group relative h-auto w-full overflow-hidden rounded-lg border border-border p-0 hover:bg-transparent ${className ?? ""}`}>
      <img src={game.image} alt={game.title} loading="lazy" className="aspect-video size-full object-cover" />
      <span aria-hidden className="home-game-play pointer-events-none absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><Play className="fill-current" /></span>
    </Button>
  );
}

function GameCategoryPage() {
  const { category: categoryId } = Route.useParams();
  const category = getGameCategory(categoryId);
  const [preview, setPreview] = useState<HomeGamePreview | null>(null);
  if (!category) return null;
  const [first, ...rest] = category.hero;
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 pb-16 pt-6 sm:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 gap-1.5 text-muted-foreground">
        <Link to="/" aria-label="返回首页"><ArrowLeft />返回</Link>
      </Button>
      <header className="mb-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl"><span aria-hidden>{category.icon}</span>{category.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
      </header>
      <section aria-label="本周排名" className="grid gap-3 sm:gap-5 lg:grid-cols-3">
        {first && <CategoryCard game={first} onSelect={setPreview} className="lg:col-span-2 lg:row-span-2" />}
        {rest.map(game => <CategoryCard key={game.id} game={game} onSelect={setPreview} />)}
      </section>
      <section aria-label={`${category.title}新品`} className="mt-10 sm:mt-12">
        <h2 className="mb-5 flex items-center gap-2.5 text-lg font-semibold"><span aria-hidden className="text-xl">⭐</span>{category.title}新品</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-5">
          {category.fresh.map(game => <CategoryCard key={game.id} game={game} onSelect={setPreview} />)}
        </div>
      </section>
      <section aria-label={`所有${category.title}游戏`} className="mt-10 sm:mt-12">
        <h2 className="mb-5 flex items-center gap-2.5 text-lg font-semibold"><span aria-hidden className="text-xl">🎮</span>所有{category.title}游戏</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7 xl:grid-cols-5">
          {category.all.map(game => <CategoryCard key={game.id} game={game} onSelect={setPreview} />)}
        </div>
      </section>
      <Dialog open={preview !== null} onOpenChange={open => { if (!open) setPreview(null); }}>
        <DialogContent className="w-[calc(100%-32px)] max-w-3xl">
          <DialogTitle>{preview?.title}</DialogTitle>
          <DialogDescription>游戏封面预览</DialogDescription>
          {preview && <img src={preview.image} alt={preview.title} className="aspect-video w-full rounded-lg object-cover" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
