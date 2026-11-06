export type CreationMode = "build" | "story";
export function parseCreationMode(value: unknown): CreationMode {
  return value === "story" ? "story" : "build";
}
export function worksForMode<T extends { type: string }>(works: T[], mode: CreationMode): T[] {
  return works.filter(work => mode === "story" ? work.type === "互动故事" : work.type !== "互动故事");
}