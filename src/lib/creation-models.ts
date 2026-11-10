export const gameGenerationModel = {
  name: "Laya IdeaAPI",
  description: "专业游戏生成 API",
  connected: false,
} as const;

export const languageModelNames = ["deepseek-flash", "deepseek-v4-flash", "deepseek-v4-pro", "gemini-3.5-flash", "gemini-3.8-flash", "gemini-4-argon", "gpt-5.5", "gpt-5.6-luna", "gpt-5.6-sol"];

export function matchingCreationModels(search: string) {
  const query = search.trim().toLowerCase();
  return [gameGenerationModel.name, ...languageModelNames].filter(name => {
    const keywords = name === gameGenerationModel.name ? `${name} ${gameGenerationModel.description} laya 游戏` : name;
    return keywords.toLowerCase().includes(query);
  });
}