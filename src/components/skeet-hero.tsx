import { useEffect, useRef } from "react";

const TITLE = "把你的想法，一键开玩。";
const SUB = "ArTrail 来构建它——世界、规则、美术和音效。";
const ICONS = ["◯", "▢", "♥", "✚", "△", "✕", "▣", "⬆"];

type Char = { ch: string; hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; vr: number; state: "idle" | "fall" | "dead"; aim: number };
type Shot = { x: number; y: number; vx: number; vy: number; life: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

export function SkeetHero() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const css = getComputedStyle(cv);
    const fg = css.color;
    const muted = getComputedStyle(cv.parentElement!).getPropertyValue("--muted-foreground") || fg;
    let w = 0, h = 0, raf = 0;
    let chars: Char[] = [];
    const shots: Shot[] = [];
    const sparks: Spark[] = [];
    const st = { score: 0, lives: 3, mx: -99, my: -99, cx: 0, tx: 0, angle: -Math.PI / 2, over: false };
    const layout = () => {
      const dpr = window.devicePixelRatio || 1;
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const size = Math.min(64, w / 13);
      ctx.font = `600 ${size}px "Noto Serif SC", serif`;
      const total = [...TITLE].reduce((s, c) => s + ctx.measureText(c).width, 0);
      let x = (w - total) / 2;
      chars = [...TITLE].map(ch => { const cw = ctx.measureText(ch).width; const c: Char = { ch, hx: x + cw / 2, hy: h * 0.32, x: x + cw / 2, y: h * 0.32, vx: 0, vy: 0, r: 0, vr: 0, state: "idle", aim: 0 }; x += cw; return c; });
      st.cx = st.tx = w / 2;
    };
    const reset = () => { st.score = 0; st.lives = 3; st.over = false; layout(); };
    layout();
    const pos = (e: PointerEvent) => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    const move = (e: PointerEvent) => { [st.mx, st.my] = pos(e); };
    const down = (e: PointerEvent) => {
      const [x, y] = pos(e); st.mx = x; st.my = y;
      if (st.over) return reset();
      if (y > h - 70) { st.tx = x; return; }
      const a = Math.atan2(y - (h - 20), x - st.cx);
      shots.push({ x: st.cx + Math.cos(a) * 44, y: h - 20 + Math.sin(a) * 44, vx: Math.cos(a) * 14, vy: Math.sin(a) * 14, life: 90 });
    };
    const leave = () => { st.mx = st.my = -99; };
    cv.addEventListener("pointermove", move); cv.addEventListener("pointerdown", down); cv.addEventListener("pointerleave", leave);
    const ro = new ResizeObserver(layout); ro.observe(cv);
    const size = () => Math.min(64, w / 13);
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      // background icons
      ctx.globalAlpha = 0.07; ctx.fillStyle = fg; ctx.font = "18px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (let gx = 30, i = 0; gx < w; gx += 60) for (let gy = 20; gy < h; gy += 60, i++) if ((i * 7) % 5 < 2) ctx.fillText(ICONS[i % ICONS.length], gx, gy);
      ctx.globalAlpha = 1;
      if (!st.over) {
        st.cx += (st.tx - st.cx) * 0.12;
        st.angle = Math.atan2(Math.min(st.my, h - 40) - (h - 20), (st.mx < 0 ? st.cx : st.mx) - st.cx);
        if (st.angle > -0.15) st.angle = -0.15; if (st.angle < -Math.PI + 0.15) st.angle = -Math.PI + 0.15;
      }
      const s = size();
      // chars
      ctx.font = `600 ${s}px "Noto Serif SC", serif`;
      for (const c of chars) {
        if (c.state === "dead") continue;
        if (c.state === "idle") {
          if (Math.abs(st.mx - c.x) < s / 2 && Math.abs(st.my - c.y) < s / 2) { c.aim++; c.x = c.hx + Math.sin(c.aim) * 2; if (c.aim > 25) { c.state = "fall"; c.vx = (Math.random() - 0.5) * 2; c.vy = -2; c.vr = (Math.random() - 0.5) * 0.06; } }
          else { c.aim = Math.max(0, c.aim - 1); c.x = c.hx; }
        } else if (!st.over) {
          c.vy += 0.06; c.x += c.vx; c.y += c.vy; c.r += c.vr;
          if (c.y > h + s) { c.state = "dead"; st.lives--; if (st.lives <= 0) st.over = true; }
        }
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.r); ctx.globalAlpha = c.state === "fall" ? 0.65 : 1; ctx.fillStyle = fg; ctx.fillText(c.ch, 0, 0); ctx.restore();
      }
      ctx.globalAlpha = 1;
      // subtitle + hud
      ctx.fillStyle = muted; ctx.font = `15px system-ui, sans-serif`; ctx.fillText(SUB, w / 2, h * 0.32 + s * 0.95);
      ctx.font = `600 15px system-ui, sans-serif`; ctx.textAlign = "left";
      ctx.fillText(`SKEET SHOT  得分 ${String(st.score).padStart(4, "0")}  ${"♥".repeat(Math.max(0, st.lives))}`, Math.max(16, (chars[0]?.hx ?? 40) - s / 2), h * 0.32 - s * 0.9);
      ctx.textAlign = "center";
      // shots
      ctx.fillStyle = fg;
      for (let i = shots.length - 1; i >= 0; i--) {
        const b = shots[i]; b.x += b.vx; b.y += b.vy; b.life--;
        ctx.fillRect(b.x - 3, b.y - 3, 6, 6);
        const hit = chars.find(c => c.state === "fall" && Math.hypot(c.x - b.x, c.y - b.y) < s * 0.55);
        if (hit) { hit.state = "dead"; st.score += 10; for (let k = 0; k < 14; k++) sparks.push({ x: hit.x, y: hit.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 30 }); shots.splice(i, 1); continue; }
        if (b.life <= 0 || b.y < 0 || b.x < 0 || b.x > w) shots.splice(i, 1);
      }
      for (let i = sparks.length - 1; i >= 0; i--) { const p = sparks[i]; p.x += p.vx; p.y += p.vy; p.life--; ctx.globalAlpha = p.life / 30; ctx.fillRect(p.x, p.y, 3, 3); if (p.life <= 0) sparks.splice(i, 1); }
      ctx.globalAlpha = 1;
      // aim line + crosshair
      if (st.mx > 0 && st.my < h - 70 && !st.over) {
        const bx = st.cx + Math.cos(st.angle) * 44, by = h - 20 + Math.sin(st.angle) * 44;
        const d = Math.hypot(st.mx - bx, st.my - by);
        for (let t = 0; t < d - 30; t += 12) ctx.fillRect(bx + (st.mx - bx) * t / d - 1, by + (st.my - by) * t / d - 1, 2, 2);
        ctx.strokeStyle = fg; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.arc(st.mx, st.my, 30, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(st.mx - 14, st.my); ctx.lineTo(st.mx + 14, st.my); ctx.moveTo(st.mx, st.my - 14); ctx.lineTo(st.mx, st.my + 14); ctx.stroke();
      }
      // cannon
      ctx.fillRect(st.cx - 36, h - 10, 72, 8);
      ctx.save(); ctx.translate(st.cx, h - 20); ctx.rotate(st.angle); ctx.fillRect(0, -6, 48, 12); ctx.restore();
      ctx.beginPath(); ctx.arc(st.cx, h - 18, 12, Math.PI, 0); ctx.fill();
      if (st.over || chars.every(c => c.state === "dead")) {
        st.over = true;
        ctx.font = "600 20px system-ui, sans-serif"; ctx.fillText(st.lives > 0 ? `全部击中！得分 ${st.score} · 点击重新开始` : `游戏结束 · 得分 ${st.score} · 点击重新开始`, w / 2, h * 0.62);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener("pointermove", move); cv.removeEventListener("pointerdown", down); cv.removeEventListener("pointerleave", leave); };
  }, []);
  return <div className="relative">
    <h2 className="sr-only">把你的想法，一键开玩。</h2>
    <canvas ref={ref} aria-label="文字射击小游戏：瞄准文字让它掉落，点击开炮击中它，点击底部移动炮台" className="block h-[380px] w-full cursor-none touch-none text-foreground" />
  </div>;
}
