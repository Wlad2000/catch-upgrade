export const GameStatus = {
  START: "START",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  GAME_OVER: "GAME_OVER",
} as const;

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export interface State {
  score: number;
  missed: number;
  elapsed: number;
  level: number;
  speedMultiplier: number;
  spawnInterval: number;
  multiplier: 1 | 2 | 10;
  multiplierTimeLeft: number;
  magnetTimeLeft: number;
  levelColor: number;
  status: GameStatus;
}

export const createInitialState = (): State => ({
  score: 0,
  missed: 0,
  elapsed: 0,
  level: 1,
  speedMultiplier: 1,
  spawnInterval: 850,
  multiplier: 1,
  multiplierTimeLeft: 0,
  magnetTimeLeft: 0,
  levelColor: 0x9ee7ff,
  status: GameStatus.START,
});
