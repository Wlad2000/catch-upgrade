export function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number) {
  return Math.floor(randomBetween(min, max + 1));
}

export function chance(probability: number) {
  return Math.random() < probability;
}
