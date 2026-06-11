import { Graphics, Text } from "pixi.js";
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
  private badgeText = new Text({
    text: "",
    style: {
      fill: 0xffffff,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 8,
      fontWeight: "900" as const,
    },
  });

  constructor() {
    super();
    this.pivot.set(this.size / 2);
    this.badgeText.anchor.set(0.5);
    this.badgeText.position.set(this.size / 2, this.size / 2);
    this.addChild(this.badgeText);
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

    if (
      this.type === ObjectType.COIN &&
      !this.bounced &&
      this.y + this.size / 2 >= floorY
    ) {
      this.y = floorY - this.size / 2;
      this.velocity.y *= -Config.fallingObject.bounceDamping;
      this.velocity.x += Math.sign(Math.random() - 0.5) * 70;
      this.bounced = true;
      this.scale.set(1.12, 0.86);
    }

    this.scale.x += (1 - this.scale.x) * Math.min(1, dt * 10);
    this.scale.y += (1 - this.scale.y) * Math.min(1, dt * 10);
    this.rotation += (this.type === ObjectType.BOMB ? -2.6 : 1.8) * dt;
  }

  attractTo(target: Vector2, dt: number) {
    if (!this.isMagnetAffected()) {
      return;
    }

    const direction = Vector2.fromPoints(this.x, this.y, target.x, target.y);
    const distance = direction.length();

    if (distance <= 0 || distance > Config.game.magnetRadius) {
      return;
    }

    const falloff = 1 - distance / Config.game.magnetRadius;
    direction
      .normalize()
      .scale(Config.game.magnetStrength * (0.35 + falloff) * dt);
    this.velocity.add(direction);
    this.velocity.x = Math.max(-420, Math.min(420, this.velocity.x));
    this.velocity.y = Math.max(-420, Math.min(520, this.velocity.y));
  }

  isMagnetAffected() {
    return (
      this.type === ObjectType.COIN ||
      this.type === ObjectType.GEM_X2 ||
      this.type === ObjectType.GEM_X10
    );
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
    this.badgeText.visible = false;

    if (this.type === ObjectType.BOMB) {
      this.circle(this.size / 2, this.size * 0.58, this.size * 0.41);
      this.stroke({ color: 0xffffff, width: 2, alpha: 0.95 });
      this.circle(this.size / 2, this.size * 0.58, this.size * 0.38);
      this.fill(0x111111);
      this.circle(this.size * 0.38, this.size * 0.44, this.size * 0.1);
      this.fill(0x3f3f46);
      this.rect(
        this.size * 0.47,
        this.size * 0.08,
        this.size * 0.12,
        this.size * 0.22,
      );
      this.fill(0x6b7280);
      this.circle(this.size * 0.53, this.size * 0.08, this.size * 0.08);
      this.fill(0xffd166);
      this.poly([
        this.size * 0.53,
        -2,
        this.size * 0.66,
        this.size * 0.14,
        this.size * 0.55,
        this.size * 0.14,
        this.size * 0.47,
        this.size * 0.28,
        this.size * 0.43,
        this.size * 0.1,
      ]);
      this.fill(0xff4d5d);
      return;
    }

    if (this.type === ObjectType.GEM_X2 || this.type === ObjectType.GEM_X10) {
      const isRare = this.type === ObjectType.GEM_X10;
      this.roundRect(3, 5, this.size - 6, this.size - 10, 8);
      this.fill(isRare ? 0x9b5cff : 0x2f9bff);
      this.roundRect(7, 9, this.size - 14, 5, 3);
      this.fill(isRare ? 0xc7a7ff : 0x9ee7ff);
      this.badgeText.text = isRare ? "x10" : "x2";
         this.badgeText.scale = isRare ? 1 : 1.1;
      this.badgeText.visible = true;
      this.badgeText.position.set(this.size / 2, this.size * 0.62);
      return;
    }

    if (this.type === ObjectType.MAGNET) {
      this.moveTo(this.size * 0.22, this.size * 0.78);
      this.quadraticCurveTo(
        this.size * 0.14,
        this.size * 0.28,
        this.size * 0.45,
        this.size * 0.2,
      );
      this.stroke({ color: 0x3b82f6, width: 8 });
      this.moveTo(this.size * 0.78, this.size * 0.78);
      this.quadraticCurveTo(
        this.size * 0.86,
        this.size * 0.28,
        this.size * 0.55,
        this.size * 0.2,
      );
      this.stroke({ color: 0xf43f5e, width: 8 });
      this.moveTo(this.size * 0.43, this.size * 0.2);
      this.lineTo(this.size * 0.565, this.size * 0.2);
      this.stroke({ color: 0xffffff, width: 8 });
      this.rect(
        this.size * 0.12,
        this.size * 0.73,
        this.size * 0.18,
        this.size * 0.13,
      );
      this.fill(0x3b82f6);
      this.rect(
        this.size * 0.7,
        this.size * 0.73,
        this.size * 0.18,
        this.size * 0.13,
      );
      this.fill(0xf43f5e);
      this.roundRect(
        this.size * 0.43,
        this.size * 0.16,
        this.size * 0.14,
        this.size * 0.1,
        2,
      );
      this.fill(0xffffff);
      return;
    }

    this.circle(this.size / 2, this.size / 2, this.size * 0.43);
    this.fill(0xb6ff3f);
    this.moveTo(this.size * 0.37, this.size * 0.15);
    this.quadraticCurveTo(
      this.size * 0.18,
      this.size * 0.5,
      this.size * 0.37,
      this.size * 0.85,
    );
    this.stroke({ color: 0xffffff, width: 3, alpha: 0.95 });
    this.moveTo(this.size * 0.63, this.size * 0.15);
    this.quadraticCurveTo(
      this.size * 0.82,
      this.size * 0.5,
      this.size * 0.63,
      this.size * 0.85,
    );
    this.stroke({ color: 0xffffff, width: 3, alpha: 0.95 });
    this.circle(this.size * 0.34, this.size * 0.28, 3);
    this.fill({ color: 0xeaff9c, alpha: 0.7 });
  }
}
