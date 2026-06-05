export { intersects, type AABB } from "./collision";
export { chance, randomBetween, randomInt } from "./random";
export { Vector2 } from "./Vector2";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
