export type LibraryAsset = { id: string; name: string; kind: string; url: string; gameId: string; project: string; createdAt: string; source: "cloud" | "device" };
export type LibraryFilters = { search: string; project: string; kind: string; source: string; days: string; sort: string };
export function filterLibraryAssets(assets: LibraryAsset[], filters: LibraryFilters, now = Date.now()) {
  const search = filters.search.trim().toLocaleLowerCase();
  return assets.filter(asset =>
    (!search || `${asset.name} ${asset.kind} ${asset.project}`.toLocaleLowerCase().includes(search)) &&
    (filters.project === "all" || asset.gameId === filters.project) &&
    (filters.kind === "all" || asset.kind === filters.kind) &&
    (filters.source === "all" || asset.source === filters.source) &&
    (filters.days === "all" || Date.parse(asset.createdAt) >= now - Number(filters.days) * 86400000)
  ).sort((a, b) => filters.sort === "name" ? a.name.localeCompare(b.name) : filters.sort === "oldest" ? Date.parse(a.createdAt) - Date.parse(b.createdAt) : Date.parse(b.createdAt) - Date.parse(a.createdAt));
}