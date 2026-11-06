export type Pt = { x: number; y: number };
export type Dir = "up" | "down" | "left" | "right";
export const POINTS_PER_CHAR = 10;

const delta: Record<Dir, Pt> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const opposite: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };

export function turn(cur: Dir, next: Dir): Dir {
  return opposite[cur] === next ? cur : next;
}

/** Advance snake one cell. Returns null when it hits a wall or itself. */
export function step(snake: Pt[], dir: Dir, cols: number, rows: number, grow: boolean): Pt[] | null {
  const h = snake[0]!;
  const n = { x: h.x + delta[dir].x, y: h.y + delta[dir].y };
  if (n.x < 0 || n.y < 0 || n.x >= cols || n.y >= rows) return null;
  const body = grow ? snake : snake.slice(0, -1);
  if (body.some(p => p.x === n.x && p.y === n.y)) return null;
  return [n, ...body];
}

export const formatScore = (s: number) => String(s).padStart(4, "0");
