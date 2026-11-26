export type CanvasReference = { id: string; name: string; kind: string; url?: string; content?: string };
export function addCanvasReference(current: CanvasReference[], reference: CanvasReference): CanvasReference[] {
  return current.some(item => item.id === reference.id) ? current.map(item => item.id === reference.id ? reference : item) : [...current, reference];
}
