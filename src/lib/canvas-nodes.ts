import type { Node } from "@xyflow/react";

export type CanvasData = { name: string; kind: string; url?: string; content?: string; partial?: boolean; dimensions?: string; onEdit?: () => void; onDimensions?: (value: string) => void };
export type CanvasNode = Node<CanvasData, "image" | "document" | "design">;
export type CanvasSnapshot = { nodes: CanvasNode[]; removedIds: string[] };
export function mergeCanvasAssets(nodes: CanvasNode[], assets: { id: string; name: string; kind: string; url: string }[], hasDesign: boolean, removedIds: string[] = []): CanvasNode[] {
  const known = new Set(nodes.map(node => node.id));
  return [...nodes, ...assets.filter(asset => !known.has(asset.id) && !removedIds.includes(asset.id)).map((asset, index): CanvasNode => ({ id: asset.id, type: "image", position: { x: (hasDesign ? 360 : 0) + index % 2 * 320, y: Math.floor(index / 2) * 350 }, data: { ...asset } }))];
}
export function storedCanvasNodes(nodes: CanvasNode[]): CanvasNode[] {
  return nodes.map(({ data, ...node }) => ({ ...node, selected: false, data: { name: data.name, kind: data.kind, ...(data.url && !data.partial ? { url: data.url } : {}), ...(data.content !== undefined ? { content: data.content } : {}), ...(data.dimensions ? { dimensions: data.dimensions } : {}) } }));
}