export const HERO_TITLE = "把你的想法，一键开玩。";
export const HERO_SUBTITLE = "ArTrail 来构建它——世界、规则、美术和音效。";
export const SHOT_POINTS = 10;
export const HERO_GAMES = ["skeet", "brick", "raid"] as const;
export type HeroGame = typeof HERO_GAMES[number];
export function pickHeroGame(random = Math.random): HeroGame {
  return HERO_GAMES[Math.min(2, Math.max(0, Math.floor(random() * 3)))] ?? "skeet";
}