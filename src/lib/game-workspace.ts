export const workspaceTabs = ["game", "design", "canvas", "assets", "code", "multiplayer", "settings"] as const;
export type WorkspaceTab = typeof workspaceTabs[number];
export const defaultWorkspaceTab: WorkspaceTab = "canvas";
export function parseWorkspaceTab(value: unknown): WorkspaceTab {
  return workspaceTabs.find(tab => tab === value) ?? defaultWorkspaceTab;
}
export type CreationRequest = { prompt: string; type: string; project: string; model: string; depth: string };
export function isGameCreation(type: string) {
  return ["Web Game", "Godot", "General Game", "TapTap Maker game"].includes(type);
}
export const starPositions = [
  { x: 190, y: 330 }, { x: 285, y: 260 }, { x: 390, y: 330 },
  { x: 505, y: 240 }, { x: 615, y: 310 },
];
export const gameTarget = starPositions.length;
export function hasWon(collected: number) { return collected >= gameTarget; }