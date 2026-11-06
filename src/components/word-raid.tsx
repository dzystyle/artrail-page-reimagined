import { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";
import { HERO_SUBTITLE, HERO_TITLE, SHOT_POINTS } from "@/lib/hero-game";
import { useTheme } from "@/components/theme-provider";

export function WordRaid() {
  const host = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [status, setStatus] = useState("WORD RAID 得分 0000 · 3条生命");
  useEffect(() => {
    const parent = host.current;
    if (!parent) return;
    let disposed = false;
    let game: Phaser.Game | undefined;
    let observer: ResizeObserver | undefined;
    void import("phaser").then(({ default: P }) => {
      if (disposed) return;
      const resolution = window.devicePixelRatio || 1;
      const color = getComputedStyle(parent).color;
      const muted = getComputedStyle(parent).getPropertyValue("--muted-foreground").trim();
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      const fg = ((pixel[0] ?? 0) << 16) | ((pixel[1] ?? 0) << 8) | (pixel[2] ?? 0);
      class RaidScene extends P.Scene {
        declare ship: Phaser.GameObjects.Container;
        declare bullets: Phaser.Physics.Arcade.Group;
        declare enemies: Phaser.Physics.Arcade.Group;
        declare hud: Phaser.GameObjects.Text;
        declare message: Phaser.GameObjects.Text;
        cursor: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
        score = 0;
        lives = 3;
        ended = false;
        remaining = 0;
        lastFire = 0;
        init() { this.score = 0; this.lives = 3; this.ended = false; this.lastFire = 0; this.remaining = [...HERO_TITLE].length; }
        create() {
          const w = this.scale.width / resolution, h = this.scale.height / resolution;
          this.cameras.main.setOrigin(0, 0).setZoom(resolution);
          const icons = ["◯", "▢", "♥", "✚", "△", "✕", "▣", "⬆"];
          for (let x = 30, i = 0; x < w; x += 60) for (let y = 20; y < h; y += 60, i++) {
            if ((i * 7) % 5 < 2) this.add.text(x, y, icons[i % icons.length] ?? "◯", { fontSize: "18px", color, resolution }).setAlpha(0.07);
          }
          this.hud = this.add.text(w / 2, 65, "", { fontFamily: "system-ui", fontSize: "15px", fontStyle: "600", color: muted, resolution }).setOrigin(0.5);
          this.enemies = this.physics.add.group({ allowGravity: false });
          const fontSize = Math.min(64, w / 13);
          const letters = [...HERO_TITLE].map(ch => this.add.text(0, 0, ch, { fontFamily: '"Noto Serif SC", serif', fontStyle: "600", fontSize: `${fontSize}px`, color, resolution }).setOrigin(0.5));
          let x = (w - letters.reduce((sum, text) => sum + text.width, 0)) / 2;
          letters.forEach(text => {
            text.setPosition(x + text.width / 2, 121);
            this.enemies.add(text);
            const body = text.body as Phaser.Physics.Arcade.Body;
            body.setSize(text.width * 0.85, text.height * 0.75);
            text.setData("homeX", text.x).setData("homeY", text.y).setData("diving", false);
            x += text.width;
          });
          this.add.text(w / 2, 121 + fontSize * 0.95, HERO_SUBTITLE, { fontFamily: "system-ui", fontSize: `${w < 500 ? 11 : 15}px`, color: muted, resolution }).setOrigin(0.5);
          const shape = this.add.graphics();
          shape.fillStyle(fg);
          shape.fillRect(-4, -15, 8, 6).fillRect(-11, -9, 22, 6).fillRect(-19, -3, 38, 10);
          this.ship = this.add.container(w / 2, h - 25, [shape]);
          this.ship.setSize(38, 24);
          this.physics.add.existing(this.ship);
          (this.ship.body as Phaser.Physics.Arcade.Body).setImmovable(true);
          this.bullets = this.physics.add.group({ allowGravity: false });
          this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
            const target = enemy as Phaser.GameObjects.Text;
            if (!target.active || this.ended) return;
            const ex = target.x, ey = target.y;
            bullet.destroy(); target.destroy(); this.remaining--; this.score += SHOT_POINTS;
            for (let i = 0; i < 9; i++) {
              const spark = this.add.rectangle(ex, ey, 3, 3, fg);
              this.tweens.add({ targets: spark, x: ex + P.Math.Between(-25, 25), y: ey + P.Math.Between(-25, 25), alpha: 0, duration: 240, onComplete: () => spark.destroy() });
            }
            this.updateHud();
            if (this.remaining === 0) this.finish(true);
          });
          this.physics.add.overlap(this.ship, this.enemies, (_ship, enemy) => { const target = enemy as Phaser.GameObjects.Text; if (target.active && !this.ended) { target.destroy(); this.remaining--; this.loseLife(); } });
          this.message = this.add.text(w / 2, h * 0.65, "", { fontFamily: "system-ui", fontSize: "18px", color, align: "center", resolution }).setOrigin(0.5);
          this.cursor = this.input.keyboard?.createCursorKeys();
          this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => this.moveShip(pointer.worldX));
          this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => { if (this.ended) this.scene.restart(); else { this.moveShip(pointer.worldX); this.fire(); } });
          this.input.keyboard?.on("keydown-SPACE", () => { if (this.ended) this.scene.restart(); else this.fire(); });
          this.time.addEvent({ delay: 2000, loop: true, callback: () => {
            if (this.ended) return;
            const waiting = this.enemies.getChildren().filter(enemy => !(enemy as Phaser.GameObjects.Text).getData("diving"));
            const enemy = P.Utils.Array.GetRandom(waiting) as Phaser.GameObjects.Text | undefined;
            if (!enemy) return;
            enemy.setData("diving", true);
            const body = enemy.body as Phaser.Physics.Arcade.Body;
            body.setVelocity(P.Math.Clamp((this.ship.x - enemy.x) * 0.2, -45, 45), 55 + this.score * 0.2);
          } });
          this.updateHud();
        }
        moveShip(x: number) { if (!this.ended) this.ship.x = P.Math.Clamp(x, 20, this.scale.width / resolution - 20); }
        fire() {
          if (this.ended || this.time.now - this.lastFire < 180) return;
          this.lastFire = this.time.now;
          const bullet = this.add.rectangle(this.ship.x, this.ship.y - 24, 3, 12, fg);
          this.bullets.add(bullet);
          (bullet.body as Phaser.Physics.Arcade.Body).setVelocityY(-420);
        }
        updateHud() {
          const text = `WORD RAID  得分 ${String(this.score).padStart(4, "0")}  ${"♥".repeat(Math.max(0, this.lives))}`;
          this.hud.setText(text);
          setStatus(`${text} · ${this.lives}条生命${this.ended ? " · 点击重新开始" : ""}`);
        }
        loseLife() { this.lives--; if (this.lives <= 0 || this.remaining === 0) this.finish(false); else this.updateHud(); }
        finish(won: boolean) {
          this.ended = true;
          this.physics.pause();
          this.message.setText(`${won ? "全部击落！" : "游戏结束"}\n点击重新开始`);
          this.updateHud();
        }
        override update(time: number, delta: number) {
          if (this.ended) return;
          if (this.cursor?.left.isDown) this.moveShip(this.ship.x - delta * 0.5);
          if (this.cursor?.right.isDown) this.moveShip(this.ship.x + delta * 0.5);
          this.fire();
          for (const item of this.bullets.getChildren()) { const bullet = item as Phaser.GameObjects.Rectangle; if (bullet.y < -20) bullet.destroy(); }
          for (const item of this.enemies.getChildren()) {
            const enemy = item as Phaser.GameObjects.Text;
            if (!enemy.getData("diving")) {
              enemy.x = Number(enemy.getData("homeX")) + Math.sin(time / 600 + Number(enemy.getData("homeX"))) * 3;
            } else {
              enemy.rotation += delta * 0.0008;
              if (enemy.y > this.scale.height / resolution + 40) { enemy.destroy(); this.remaining--; this.loseLife(); }
            }
          }
        }
      }
      game = new P.Game({ type: P.CANVAS, parent, width: Math.round(parent.clientWidth * resolution), height: Math.round(380 * resolution), transparent: true, scene: RaidScene, physics: { default: "arcade", arcade: { gravity: { x: 0, y: 0 } } }, audio: { noAudio: true } });
      let width = parent.clientWidth;
      observer = new ResizeObserver(() => {
        if (!game || width === parent.clientWidth) return;
        width = parent.clientWidth; game.scale.resize(Math.round(width * resolution), Math.round(380 * resolution));
        game.scene.scenes.forEach(scene => scene.scene.restart());
      });
      observer.observe(parent);
    });
    return () => { disposed = true; observer?.disconnect(); game?.destroy(true); };
  }, [theme]);
  return <div className="relative">
    <h2 className="sr-only">WORD RAID 飞船文字射击</h2>
    <p role="status" className="sr-only">{status}</p>
    <div ref={host} role="application" aria-label="飞船文字射击：移动鼠标或滑动控制飞船，自动发射，左右方向键移动，结束后点击重玩" className="h-[380px] w-full touch-none text-foreground [&_canvas]:block [&_canvas]:!h-[380px] [&_canvas]:!w-full" />
  </div>;
}