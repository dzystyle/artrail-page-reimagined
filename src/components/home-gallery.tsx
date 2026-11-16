import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { homeGameRows, moreHomeGames, type HomeGamePreview } from "@/lib/home-game-previews";

function GameCard({ game, onSelect }: { game: HomeGamePreview; onSelect: (game: HomeGamePreview) => void }) {
  return (
    <Button variant="ghost" aria-label={`预览${game.title}`} onClick={() => onSelect(game)} className="group relative h-auto w-full overflow-hidden rounded-lg border border-border p-0 hover:bg-transparent">
      <img src={game.image} alt={game.title} loading="lazy" width={357} height={200} className="aspect-video w-full object-cover" />
      <span aria-hidden className="home-game-play pointer-events-none absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><Play className="fill-current" /></span>
    </Button>
  );
}

export function RecentCanvases() {
  const [preview, setPreview] = useState<HomeGamePreview | null>(null);
  const [collection, setCollection] = useState<(typeof homeGameRows)[number] | null>(null);
  const [remix, setRemix] = useState("Colossus Gauntlet, but in the Wild West");
  return (
    <div className="home-game-gallery space-y-10 pb-12 sm:space-y-12">
      {homeGameRows.map(row => (
        <section key={row.title} aria-label={row.title}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold"><span aria-hidden className="text-xl">{row.icon}</span>{row.title}</h2>
            <Button variant="secondary" size="sm" className="h-7 rounded-full px-3 font-normal" aria-label={`查看全部${row.title}`} onClick={() => setCollection(row)}>查看全部</Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-5">
            {row.games.map(game => <GameCard key={game.id} game={game} onSelect={setPreview} />)}
          </div>
        </section>
      ))}
      <section aria-label="更多游戏">
        <h2 className="mb-5 flex items-center gap-2.5 text-lg font-semibold"><span aria-hidden className="text-xl">📚</span>更多游戏</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7 xl:grid-cols-5">
          {moreHomeGames.map((game, index) => (
            <div key={game.id} className="contents">
              {index === 13 && <div className="home-game-remix flex aspect-video min-w-0 flex-col justify-between gap-2 rounded-lg border border-border p-3 sm:p-4">
                <h3 className="text-xs font-semibold sm:text-sm">🧬 混音：创建你自己的游戏</h3>
                <div className="space-y-2">
                  <input aria-label="游戏混音创意" value={remix} onChange={event => setRemix(event.target.value)} className="home-game-play h-9 w-full min-w-0 rounded-lg border border-border px-3 text-xs outline-none focus:border-ring sm:text-sm" />
                  <Button asChild className="h-8 w-full rounded-full sm:h-9"><Link to="/build" search={{ mode: "build" }}>创造</Link></Button>
                </div>
              </div>}
              <GameCard game={game} onSelect={setPreview} />
            </div>
          ))}
        </div>
      </section>
      <Dialog open={collection !== null} onOpenChange={open => { if (!open) setCollection(null); }}>
        <DialogContent className="max-h-[85dvh] w-[calc(100%-32px)] max-w-5xl overflow-y-auto">
          <DialogTitle>{collection?.icon} {collection?.title}</DialogTitle>
          <DialogDescription className="sr-only">游戏封面展示</DialogDescription>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{collection?.games.map(game => <GameCard key={game.id} game={game} onSelect={game => { setCollection(null); setPreview(game); }} />)}</div>
        </DialogContent>
      </Dialog>
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