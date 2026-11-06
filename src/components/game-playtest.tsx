import { useEffect, useRef, useState } from "react";
import { Maximize, RotateCcw, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gameTarget, hasWon, starPositions } from "@/lib/game-workspace";
import cover from "@/assets/build-explore-1.jpg";

export function GamePlaytest() {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [muted, setMuted] = useState(true);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const controls = useRef({ left: false, right: false, jump: false });
  useEffect(() => {
    if (!started) return;
    let disposed = false;
    let game: { destroy: (removeCanvas: boolean) => void } | undefined;
    setReady(false);
    setScore(0);
    setError("");
    void import("phaser").then(({ default: Phaser }) => {
      if (disposed || !host.current) return;
      const color = (name: string) => {
        const probe = document.createElement("span");
        probe.style.color = `var(${name})`;
        host.current?.appendChild(probe);
        const rgb = getComputedStyle(probe).color;
        probe.remove();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return 0;
        ctx.fillStyle = rgb;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        return ((data[0] ?? 0) << 16) + ((data[1] ?? 0) << 8) + (data[2] ?? 0);
      };
      const palette = { bg: color("--surface-deep"), ground: color("--project-mint"), player: color("--link"), star: color("--create"), text: color("--foreground") };
      class PlayScene extends Phaser.Scene {
        player?: Phaser.GameObjects.Rectangle;
        keys?: Phaser.Types.Input.Keyboard.CursorKeys;
        collected = 0;
        create() {
          const g = this.add.graphics();
          g.lineStyle(1, palette.ground, 0.12);
          for (let x = 0; x < 800; x += 40) g.lineBetween(x, 0, x, 450);
          for (let y = 0; y < 450; y += 40) g.lineBetween(0, y, 800, y);
          const platforms = this.physics.add.staticGroup();
          for (const [x, y, w] of [[400, 425, 800], [280, 325, 130], [500, 300, 125], [650, 370, 130]]) {
            if (x === undefined || y === undefined || w === undefined) continue;
            const platform = this.add.rectangle(x, y, w, 16, palette.ground);
            platforms.add(platform);
          }
          this.player = this.add.rectangle(65, 385, 26, 34, palette.player);
          this.physics.add.existing(this.player);
          const body = this.player.body as Phaser.Physics.Arcade.Body;
          body.setCollideWorldBounds(true);
          this.physics.add.collider(this.player, platforms);
          const stars = this.physics.add.staticGroup();
          for (const pos of starPositions) {
            const star = this.add.star(pos.x, pos.y, 5, 7, 15, palette.star);
            stars.add(star);
          }
          this.physics.add.overlap(this.player, stars, (_player, star) => {
            const object = star as Phaser.GameObjects.Star;
            if (!object.active) return;
            object.destroy();
            this.collected += 1;
            if (!disposed) setScore(this.collected);
          });
          this.keys = this.input.keyboard?.createCursorKeys();
          this.input.keyboard?.addCapture(["UP", "LEFT", "RIGHT", "SPACE"]);
          this.add.text(22, 20, "ARTRAIL / PLAYTEST", { fontFamily: "sans-serif", fontSize: "14px", color: `#${palette.text.toString(16).padStart(6, "0")}` });
          if (!disposed) setReady(true);
        }
        update() {
          if (!this.player || hasWon(this.collected)) return;
          const body = this.player.body as Phaser.Physics.Arcade.Body;
          body.setVelocityX((this.keys?.left.isDown || controls.current.left) ? -220 : (this.keys?.right.isDown || controls.current.right) ? 220 : 0);
          if ((this.keys?.up.isDown || this.keys?.space.isDown || controls.current.jump) && body.blocked.down) body.setVelocityY(-390);
        }
      }
      game = new Phaser.Game({ type: Phaser.AUTO, parent: host.current, width: 800, height: 450, backgroundColor: palette.bg, scene: PlayScene, physics: { default: "arcade", arcade: { gravity: { x: 0, y: 850 } } }, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, audio: { noAudio: true } });
    }).catch(() => { if (!disposed) setError("示例加载失败，请重新开始。"); });
    return () => { disposed = true; game?.destroy(true); controls.current = { left: false, right: false, jump: false }; };
  }, [started, round]);
  return <div className="flex h-full flex-col">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3 text-sm"><div><span className="font-medium">星光收集 · 示例试玩</span><span className="ml-3 text-muted-foreground">Web Game</span></div><span className="text-create">{score} / {gameTarget} 星星</span></div>
    <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-4 sm:p-8">
      <div ref={frame} className="relative aspect-video w-full max-w-[1000px] overflow-hidden rounded-lg border border-border bg-surface-deep">
        {!started ? <><img src={cover} alt="游戏示例封面" className="size-full object-cover opacity-60" /><div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-background/30"><h2 className="text-2xl font-semibold sm:text-3xl">星光收集</h2><Button onClick={() => setStarted(true)} size="lg"><Play />开始示例试玩</Button></div></> : <div ref={host} className="size-full" aria-label="游戏试玩区域" />}
        {started && !ready && !error && <div role="status" className="absolute inset-0 grid place-items-center bg-surface-deep">加载试玩…</div>}
        {error && <div role="alert" className="absolute inset-0 grid place-items-center bg-surface-deep">{error}</div>}
        {hasWon(score) && <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80"><h2 className="text-3xl font-semibold">全部收集！</h2><p>已收集 {gameTarget} 颗星星</p><Button onClick={() => setRound(n => n + 1)}><RotateCcw />再玩一次</Button></div>}
      </div>
      <div className="flex w-full max-w-[1000px] flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted-foreground">← → 移动 · ↑ / 空格跳跃</p><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label="重新开始" title="重新开始" onClick={() => { setStarted(true); setRound(n => n + 1); }}><RotateCcw /></Button><Button variant="ghost" size="icon" aria-label={muted ? "打开声音" : "关闭声音"} title="此示例无音轨" onClick={() => setMuted(v => !v)}>{muted ? <VolumeX /> : <Volume2 />}</Button><Button variant="ghost" size="icon" aria-label="全屏试玩" title="全屏试玩" onClick={() => void frame.current?.requestFullscreen().catch(() => setError("当前浏览器不支持全屏。"))}><Maximize /></Button></div></div>
      {started && <div className="flex gap-3 sm:hidden">{([['left', '←'], ['right', '→'], ['jump', '↑']] as const).map(([key, label]) => <Button key={key} variant="secondary" size="lg" aria-label={key === 'jump' ? '跳跃' : key === 'left' ? '向左移动' : '向右移动'} className="touch-none" onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); controls.current[key] = true; }} onPointerUp={() => { controls.current[key] = false; }} onPointerCancel={() => { controls.current[key] = false; }}>{label}</Button>)}</div>}
    </div>
  </div>;
}