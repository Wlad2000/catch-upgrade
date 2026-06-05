export const Config = {
  backgroundColor: 0x111827,
  player: {
    width: 144,
    height: 22,
    bottomOffset: 64,
  },
  fallingObject: {
    size: 34,
    baseSpeed: 240,
    maxActive: 36,
    gravity: 280,
    bounceDamping: 0.62,
  },
  spawn: {
    initialInterval: 850,
    minInterval: 280,
  },
  difficulty: {
    interval: 10,
    speedMultiplier: 1.1,
    spawnMultiplier: 0.9,
  },
  game: {
    maxMissed: 5,
    multiplierDuration: 30,
    magnetDuration: 8,
    magnetRadius: 180,
    magnetStrength: 720,
  },
} as const;
