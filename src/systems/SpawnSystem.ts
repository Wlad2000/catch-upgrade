import { Container } from "pixi.js";
import { Config } from "../core/Config";
import { FallingObject, ObjectType } from "../entities/FallingObject";
import { ObjectPool } from "../utils/ObjectPool";
import { chance, randomBetween } from "../utils/math";

export class SpawnSystem {
  private timer = 0;
  private pool = new ObjectPool(
    () => new FallingObject(),
    (object) => {
      object.removeFromParent();
      object.visible = true;
    },
  );

  update(
    dt: number,
    stage: Container,
    objects: FallingObject[],
    width: number,
    spawnInterval: number,
    speedMultiplier: number,
  ) {
    this.timer += dt * 1000;

    if (this.timer < spawnInterval || objects.length >= Config.fallingObject.maxActive) {
      return;
    }

    this.timer = 0;
    const type = this.pickType();
    const speed = randomBetween(
      Config.fallingObject.baseSpeed * 0.85,
      Config.fallingObject.baseSpeed * 1.25,
    ) * speedMultiplier;
    const object = this.pool.acquire();
    const margin = Config.fallingObject.size;

    object.reset(type, speed, randomBetween(margin, width - margin), -margin);
    objects.push(object);
    stage.addChild(object);
  }

  release(object: FallingObject) {
    object.removeFromParent();
    this.pool.release(object);
  }

  reset() {
    this.timer = 0;
  }

  private pickType(): ObjectType {
    if (chance(0.14)) {
      return ObjectType.BOMB;
    }

    if (chance(0.035)) {
      return ObjectType.GEM_X10;
    }

    if (chance(0.12)) {
      return ObjectType.GEM_X2;
    }

    if (chance(0.1)) {
      return ObjectType.MAGNET;
    }

    return ObjectType.COIN;
  }

  getStats() {
    return this.pool.stats;
  }
}
