import { Graphics } from "pixi.js";
import { Config } from "../core/Config";
import type { AABB } from "../utils/math";

export class Player extends Graphics {
  readonly bodyWidth = Config.player.width;
  readonly bodyHeight = Config.player.height;

  constructor() {
    super();

    this.draw(false);
    this.pivot.set(this.bodyWidth / 2, this.bodyHeight / 2);
  }

  setUpgraded(upgraded: boolean) {
    this.draw(upgraded);
  }

  getAABB(): AABB {
    return {
      x: this.x - (this.bodyWidth * this.scale.x) / 2,
      y: this.y - (this.bodyHeight * this.scale.y) / 2,
      width: this.bodyWidth * this.scale.x,
      height: this.bodyHeight * this.scale.y,
    };
  }

  squash() {
    this.scale.set(this.scale.x * 1.12, 0.82);
  }

  updateJuice(dt: number, targetScaleX: number) {
    this.scale.x += (targetScaleX - this.scale.x) * Math.min(1, dt * 12);
    this.scale.y += (1 - this.scale.y) * Math.min(1, dt * 14);
  }

  private draw(upgraded: boolean) {
    this.clear();
    this.roundRect(0, 0, this.bodyWidth, this.bodyHeight, 8);
    this.fill(upgraded ? 0xffd166 : 0x35f2a6);
    this.roundRect(12, 5, this.bodyWidth - 24, 5, 3);
    this.fill(upgraded ? 0xffffff : 0xcfffee);
  }
}
