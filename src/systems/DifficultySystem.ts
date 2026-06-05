import { Config } from "../core/Config";
import type { State } from "../core/GameState";
import { randomInt } from "../utils/math";

export class DifficultySystem {
  private nextIncreaseAt = Config.difficulty.interval;

  update(state: State) {
    if (state.elapsed < this.nextIncreaseAt) {
      return false;
    }

    state.level += 1;
    state.speedMultiplier *= Config.difficulty.speedMultiplier;
    state.spawnInterval = Math.max(
      Config.spawn.minInterval,
      state.spawnInterval * Config.difficulty.spawnMultiplier,
    );
    state.levelColor = this.randomReadableColor();
    this.nextIncreaseAt += Config.difficulty.interval;
    return true;
  }

  reset() {
    this.nextIncreaseAt = Config.difficulty.interval;
  }

  private randomReadableColor() {
    const colors = [0x9ee7ff, 0xffd166, 0x35f2a6, 0xff6bd6, 0xff8f70, 0xc4f06f];
    return colors[randomInt(0, colors.length - 1)];
  }
}
