import { useEffect, useState } from "react";
import { BrickBash } from "@/components/brick-bash";
import { SkeetHero } from "@/components/skeet-hero";
import { WordRaid } from "@/components/word-raid";
import { pickHeroGame, type HeroGame } from "@/lib/hero-game";

export function RandomHeroGame() {
  const [game, setGame] = useState<HeroGame | null>(null);
  useEffect(() => { setGame(pickHeroGame()); }, []);
  if (game === "skeet") return <SkeetHero />;
  if (game === "brick") return <BrickBash />;
  if (game === "raid") return <WordRaid />;
  return <div className="h-[380px] w-full" aria-busy="true" />;
}