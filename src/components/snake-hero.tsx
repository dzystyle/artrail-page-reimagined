import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, Skull, Key, Star, Gamepad2, Ghost, Diamond, Circle, X, Plus, Dice5, Triangle } from "lucide-react";
import { formatScore, POINTS_PER_CHAR, step, turn, type Dir, type Pt } from "@/lib/snake";

const CELL = 20;
const TITLE = "任何想法，一键开玩。";
const SUB = "ArTrail 来构建它——世界、规则、美术和音效。";
const ICONS = [Heart, Skull, Key, Star, Gamepad2, Ghost, Diamond, Circle, X, Plus, Dice5, Triangle];
const START: Pt[] = [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }];
const keyDir: Record<string, Dir> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" };

type Hit = { dx: number; dy: number; r: number };

export function SnakeHero() {
  const box = useRef<HTMLDivElement>(null);
  const chars = useRef<(HTMLSpanElement | null)[]>([]);
  const [grid, setGrid] = useState({ cols: 40, rows: 18 });
  const [snake, setSnake] = useState<Pt[]>([]);
  const [state, setState] = useState<"idle" | "run" | "over">("idle");
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState<Record<number, Hit>>({});
  const dir = useRef<Dir>("right");
  const pending = useRef<Dir>("right");
  const snakeRef = useRef<Pt[]>([]);
  const hitsRef = useRef<Record<number, Hit>>({});

  const reset = useCallback((g = grid) => {
    const cx = Math.floor(g.cols / 2), cy = g.rows - 4;
    const s = START.map(p => ({ x: cx + p.x, y: cy + p.y }));
    snakeRef.current = s; setSnake(s);
    dir.current = pending.current = "up";
  }, [grid]);

  useEffect(() => {
    const el = box.current; if (!el) return;
    const measure = () => { const g = { cols: Math.floor(el.clientWidth / CELL), rows: Math.floor(el.clientHeight / CELL) }; setGrid(g); if (state === "idle") reset(g); };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    if (state === "run") return;
    hitsRef.current = {}; setHits({}); setScore(0); reset(); setState("run");
    box.current?.focus();
  };

  useEffect(() => {
    if (state !== "run") return;
    const id = window.setInterval(() => {
      dir.current = turn(dir.current, pending.current);
      const base = box.current!.getBoundingClientRect();
      const h = snakeRef.current[0]!;
      const nx = h.x + (dir.current === "right" ? 1 : dir.current === "left" ? -1 : 0);
      const ny = h.y + (dir.current === "down" ? 1 : dir.current === "up" ? -1 : 0);
      const px = nx * CELL + CELL / 2, py = ny * CELL + CELL / 2;
      let ate = -1;
      chars.current.forEach((c, i) => {
        if (!c || hitsRef.current[i] || ate >= 0 || !c.textContent?.trim()) return;
        const r = c.getBoundingClientRect();
        if (px >= r.left - base.left - 4 && px <= r.right - base.left + 4 && py >= r.top - base.top - 4 && py <= r.bottom - base.top + 4) ate = i;
      });
      const next = step(snakeRef.current, dir.current, grid.cols, grid.rows, ate >= 0);
      if (!next) { setState("over"); return; }
      if (ate >= 0) {
        const hit = { dx: (Math.random() - 0.5) * 160, dy: (Math.random() - 0.7) * 120, r: (Math.random() - 0.5) * 120 };
        hitsRef.current = { ...hitsRef.current, [ate]: hit }; setHits(hitsRef.current);
        setScore(s => s + POINTS_PER_CHAR);
      }
      snakeRef.current = next; setSnake(next);
    }, 110);
    return () => window.clearInterval(id);
  }, [state, grid]);

  const onKey = (e: React.KeyboardEvent) => {
    const d = keyDir[e.key] ?? keyDir[e.key.toLowerCase()];
    if (!d) return;
    e.preventDefault();
    if (state !== "run") start();
    pending.current = d;
  };

  const touch = useRef<Pt | null>(null);
  const onTouchEnd = (e: React.TouchEvent) => {
    const t0 = touch.current, t = e.changedTouches[0]; if (!t0 || !t) return;
    const dx = t.clientX - t0.x, dy = t.clientY - t0.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    pending.current = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
  };

  let idx = 0;
  const renderText = (text: string, cls: string) => <span className={cls}>{Array.from(text).map(ch => {
    const i = idx++; const h = hits[i];
    return <span key={i} ref={el => { chars.current[i] = el; }} className="inline-block transition-transform duration-500 ease-out"
      style={h ? { transform: `translate(${h.dx}px, ${h.dy}px) rotate(${h.r}deg)` } : undefined}>{ch}</span>;
  })}</span>;

  const head = snake[0];
  return <section aria-label="贪吃蛇小游戏" className="relative -mx-5 overflow-hidden sm:-mx-8">
    <div ref={box} tabIndex={0} role="application" aria-label="点击开始贪吃蛇，方向键控制"
      onClick={start} onKeyDown={onKey}
      onTouchStart={e => { touch.current = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY }; if (state !== "run") start(); }}
      onTouchEnd={onTouchEnd}
      className="relative h-[340px] cursor-pointer select-none outline-none sm:h-[380px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-[repeat(auto-fill,60px)] content-start justify-center gap-0 text-foreground/[0.07]">
        {Array.from({ length: 240 }, (_, i) => { const I = ICONS[(i * 7 + (i >> 3)) % ICONS.length]!; return <div key={i} className="flex size-[60px] items-center justify-center"><I className="size-5" fill={i % 3 ? "none" : "currentColor"} /></div>; })}
      </div>
      <div className="pointer-events-none relative flex flex-col items-center pt-8 text-center">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground">
          SNAKE {state === "idle" ? "- 点击开始" : `得分 ${formatScore(score)}`}{state === "over" && " · 点击重新开始"}
        </p>
        <h2 className="mt-4 font-serif text-4xl tracking-tight text-foreground sm:text-6xl">{renderText(TITLE, "")}</h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-lg">{renderText(SUB, "")}</p>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {snake.map((p, i) => <div key={i} className="absolute rounded-[2px] bg-foreground/90" style={{ left: p.x * CELL + 1, top: p.y * CELL + 1, width: CELL - 2, height: CELL - 2 }} />)}
        {head && state === "run" && <div className="absolute text-[11px] font-medium text-muted-foreground transition-all duration-100" style={{ left: head.x * CELL + 22, top: head.y * CELL - 16 }}>ArTrail ✱</div>}
      </div>
    </div>
  </section>;
}
