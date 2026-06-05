import { Graphics } from "pixi.js";
import { Config } from "../core/Config";
import { Vector2, type AABB } from "../utils/math";

export const ObjectType = {
  COIN: "COIN",
  GEM_X2: "GEM_X2",
  GEM_X10: "GEM_X10",
  MAGNET: "MAGNET",
  BOMB: "BOMB",
} as const;

export type ObjectType = (typeof ObjectType)[keyof typeof ObjectType];


export class FallingObject extends Graphics {
  speed = 0;
  type: ObjectType = ObjectType.COIN;
  velocity = new Vector2();
  bounced = false;
  readonly size = Config.fallingObject.size;

  constructor() {
    super();
    this.pivot.set(this.size / 2);
  }

  reset(type: ObjectType, speed: number, x: number, y: number) {
    this.type = type;
    this.speed = speed;
    this.velocity.set(0, speed);
    this.bounced = false;
    this.alpha = 1;
    this.scale.set(1);
    this.rotation = 0;
    this.position.set(x, y);
    this.draw();
  }

  update(dt: number, floorY: number) {
    this.velocity.y += Config.fallingObject.gravity * dt;
    this.x += this.velocity.x * dt;
    this.y += this.velocity.y * dt;

    if (this.type === ObjectType.COIN && !this.bounced && this.y + this.size / 2 >= floorY) {
      this.y = floorY - this.size / 2;
      this.velocity.y *= -Config.fallingObject.bounceDamping;
      this.velocity.x += Math.sign(Math.random() - 0.5) * 70;
      this.bounced = true;
    }

    this.rotation += (this.type === ObjectType.BOMB ? -2.6 : 1.8) * dt;
  }

  attractTo(target: Vector2, dt: number) {
    if (this.type === ObjectType.BOMB) {
      return;
    }

    const direction = Vector2.fromPoints(this.x, this.y, target.x, target.y);
    const distance = direction.length();

    if (distance <= 0 || distance > Config.game.magnetRadius) {
      return;
    }

    direction.normalize().scale(Config.game.magnetStrength * dt);
    this.velocity.add(direction);
  }

  getAABB(): AABB {
    return {
      x: this.x - this.size / 2,
      y: this.y - this.size / 2,
      width: this.size,
      height: this.size,
    };
  }

  private draw() {
    this.clear();

    if (this.type === ObjectType.BOMB) {
      this.circle(this.size / 2, this.size / 2, this.size * 0.44);
      this.fill(0xff4d5d);
      this.rect(this.size * 0.42, 0, this.size * 0.16, this.size * 0.28);
      this.fill(0xffc857);
      return;
    }

    if (this.type === ObjectType.GEM_X2 || this.type === ObjectType.GEM_X10) {
      const isRare = this.type === ObjectType.GEM_X10;
      this.poly([
        this.size / 2, 0,
        this.size, this.size * 0.38,
        this.size * 0.76, this.size,
        this.size * 0.24, this.size,
        0, this.size * 0.38,
      ]);
      this.fill(isRare ? 0xff6bd6 : 0x59d8ff);
      this.circle(this.size / 2, this.size / 2, this.size * 0.2);
      this.fill(0xffffff);
      return;
    }

    if (this.type === ObjectType.MAGNET) {
      this.arc(this.size * 0.5, this.size * 0.5, this.size * 0.36, Math.PI * 0.15, Math.PI * 0.85);
      this.stroke({ color: 0x35f2a6, width: 8 });
      this.circle(this.size * 0.22, this.size * 0.72, 4);
      this.circle(this.size * 0.78, this.size * 0.72, 4);
      this.fill(0xffffff);
      return;
    }

    this.circle(this.size / 2, this.size / 2, this.size * 0.45);
    this.fill(0xffd166);
    this.circle(this.size / 2, this.size / 2, this.size * 0.24);
    this.fill(0xfff1a8);
  }
}
