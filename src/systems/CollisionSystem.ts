import { FallingObject } from "../entities/FallingObject";
import { Player } from "../entities/Player";
import { intersects } from "../utils/math";

export interface CollisionResult {
  caught: FallingObject[];
  missed: FallingObject[];
}

export class CollisionSystem {
  update(player: Player, objects: FallingObject[], height: number): CollisionResult {
    const caught: FallingObject[] = [];
    const missed: FallingObject[] = [];
    const playerBox = player.getAABB();

    for (const object of objects) {
      if (intersects(playerBox, object.getAABB())) {
        caught.push(object);
      } else if (object.y - object.size / 2 > height) {
        missed.push(object);
      }
    }

    return { caught, missed };
  }
}
