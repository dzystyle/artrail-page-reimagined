import { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";
import { HERO_SUBTITLE, HERO_TITLE } from "@/lib/hero-game";
import { useTheme } from "@/components/theme-provider";

export function BrickBash() {
  const host = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [status, setStatus] = useState("BRICK BASH 得分 0000 · 3条生命");
  useEffect(() => {
    const parent = host.current;
    if (!parent) return;
    let disposed = false;
    let game: Phaser.Game | undefined;
    let observer: ResizeObserver | undefined;
    void import("phaser").then(({ default: P }) => {
      if (disposed) return;
      const color = getComputedStyle(parent).color;
      const muted = getComputedStyle(parent).getPropertyValue("--muted-foreground").trim();
      // Canvas APIs resolve the same semantic tokens used by the surrounding page.
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      const fg = ((pixel[0] ?? 0) << 16) | ((pixel[1] ?? 0) << 8) | (pixel[2] ?? 0);
      class BrickScene extends P.Scene {
        declare paddle: Phaser.GameObjects.Rectangle;
        declare ball: Phaser.GameObjects.Rectangle;
        bricks: { text: Phaser.GameObjects.Text; body: Phaser.GameObjects.Zone }[] = [];
        declare hud: Phaser.GameObjects.Text;
        declare message: Phaser.GameObjects.Text;
        score = 0;
        lives = 3;
        ended = false;
        cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
        trail: { x: number; y: number }[] = [];
        declare trailGraphics: Phaser.GameObjects.Graphics;
        create() {
          const w = this.scale.width, h = this.scale.height;
          const icons = ["◯", "▢", "♥", "✚", "△", "✕", "▣", "⬆"];
          for (let x = 30, i = 0; x < w; x += 60) for (let y = 20; y < h; y += 60, i++) {
            if ((i * 7) % 5 < 2) this.add.text(x, y, icons[i % icons.length] ?? "◯", { fontSize: "18px", color }).setAlpha(0.07);
          }
          this.hud = this.add.text(w / 2, 65, "", { fontFamily: "system-ui", fontSize: "15px", fontStyle: "bold", color: muted }).setOrigin(0.5);
          const fontSize = Math.min(64, w / 13);
          const widths = [...HERO_TITLE].map(ch => {
            const text = this.add.text(0, 0, ch, { fontFamily: "serif", fontSize: `${fontSize}px`, color });
            return text;
          });
          let x = (w - widths.reduce((sum, t) => sum + t.width, 0)) / 2;
          widths.forEach(text => {
            text.setPosition(x + text.width / 2, 121).setOrigin(0.5);
            const zone = this.add.zone(text.x, text.y, text.width, text.height * 0.8);
            this.physics.add.existing(zone, true);
            this.bricks.push({ text, body: zone });
            x += text.width;
          });
          this.add.text(w / 2, 121 + fontSize * 0.95, HERO_SUBTITLE, { fontFamily: "system-ui", fontSize: `${w < 500 ? 11 : 15}px`, color: muted }).setOrigin(0.5);
          this.paddle = this.add.rectangle(w / 2, h - 20, Math.min(130, w * 0.24), 9, fg);
          this.physics.add.existing(this.paddle, true);
          this.trailGraphics = this.add.graphics();
          this.ball = this.add.rectangle(w / 2, h - 36, 9, 9, fg);
          this.physics.add.existing(this.ball);
          const body = this.ball.body as Phaser.Physics.Arcade.Body;
          body.setBounce(1).setCollideWorldBounds(true);
          this.physics.world.setBoundsCollision(true, true, true, false);
          this.physics.add.collider(this.ball, this.paddle, () => {
            const offset = P.Math.Clamp((this.ball.x - this.paddle.x) / (this.paddle.width / 2), -1, 1);
            body.setVelocity(260 * offset, -Math.sqrt(320 ** 2 - (260 * offset) ** 2));
          });
          this.bricks.forEach(brick => this.physics.add.collider(this.ball, brick.body, () => {
            if (!brick.body.active) return;
            brick.body.destroy();
            this.tweens.add({ targets: brick.text, alpha: 0, y: brick.text.y - 16, duration: 180, onComplete: () => brick.text.destroy() });
            this.score += 10;
            this.updateHud();
            if (this.bricks.every(b => !b.body.active)) this.finish(true);
          }));
          this.message = this.add.text(w / 2, h * 0.65, "", { fontFamily: "system-ui", fontSize: "18px", color, align: "center" }).setOrigin(0.5);
          this.cursor = this.input.keyboard?.createCursorKeys();
          this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => this.movePaddle(pointer.x));
          this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (this.ended) this.scene.restart();
            else this.movePaddle(pointer.x);
          });
          this.input.keyboard?.on("keydown-SPACE", () => { if (this.ended) this.scene.restart(); });
          this.launch();
          this.updateHud();
        }
        init() { this.score = 0; this.lives = 3; this.ended = false; this.bricks = []; this.trail = []; }
        updateHud() {
          const text = `BRICK BASH  得分 ${String(this.score).padStart(4, "0")}  ${"♥".repeat(Math.max(0, this.lives))}`;
          this.hud.setText(text);
          setStatus(`${text} · ${this.lives}条生命${this.ended ? " · 点击重新开始" : ""}`);
        }
        movePaddle(x: number) {
          this.paddle.x = P.Math.Clamp(x, this.paddle.width / 2, this.scale.width - this.paddle.width / 2);
          (this.paddle.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
        }
        launch() {
          this.trail = [];
          this.ball.setPosition(this.paddle.x, this.scale.height - 36);
          const body = this.ball.body as Phaser.Physics.Arcade.Body;
          body.reset(this.ball.x, this.ball.y);
          body.setVelocity(100, -300);
        }
        finish(won: boolean) {
          this.ended = true;
          (this.ball.body as Phaser.Physics.Arcade.Body).stop();
          this.message.setText(`${won ? "全部击碎！" : "游戏结束"}\n点击重新开始`);
          this.updateHud();
        }
        update(_time: number, delta: number) {
          if (this.ended) return;
          if (this.cursor?.left.isDown) this.movePaddle(this.paddle.x - delta * 0.5);
          if (this.cursor?.right.isDown) this.movePaddle(this.paddle.x + delta * 0.5);
          this.trail.unshift({ x: this.ball.x, y: this.ball.y });
          this.trail.length = Math.min(7, this.trail.length);
          this.trailGraphics.clear();
          this.trail.forEach((p, i) => this.trailGraphics.fillStyle(fg, (1 - i / 7) * 0.15).fillRect(p.x - 4, p.y - 4, 8, 8));
          if (this.ball.y > this.scale.height + 12) {
            this.lives--;
            if (this.lives <= 0) this.finish(false);
            else { this.launch(); this.updateHud(); }
          }
        }
      }
      game = new P.Game({ type: P.CANVAS, parent, width: parent.clientWidth, height: 380, transparent: true, scene: BrickScene, physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } }, audio: { noAudio: true } });
      let width = parent.clientWidth;
      observer = new ResizeObserver(() => {
        if (!game || width === parent.clientWidth) return;
        width = parent.clientWidth;
        game.scale.resize(width, 380);
        game.scene.scenes.forEach(scene => scene.scene.restart());
      });
      observer.observe(parent);
    });
    return () => { disposed = true; observer?.disconnect(); game?.destroy(true); };
  }, [theme]);
  return <div className="relative">
    <h2 className="sr-only">BRICK BASH 文字打砖块</h2>
    <p role="status" className="sr-only">{status}</p>
    <div ref={host} role="application" aria-label="文字打砖块：移动鼠标或滑动控制挡板，左右方向键移动，结束后点击重玩" className="h-[380px] w-full touch-none text-foreground [&_canvas]:block" />
  </div>;
}