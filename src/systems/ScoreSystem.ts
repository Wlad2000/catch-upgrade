import { Config } from "../core/Config";
import { GameStatus, type State } from "../core/GameState";
import { ObjectType } from "../entities/FallingObject";

export class ScoreSystem {
  applyCatch(type: ObjectType, state: State) {
    if (type === ObjectType.BOMB) {
      state.status = GameStatus.GAME_OVER;
      return;
    }

    if (type === ObjectType.GEM_X2 || type === ObjectType.GEM_X10) {
      state.multiplier = type === ObjectType.GEM_X10 ? 10 : 2;
      state.multiplierTimeLeft = Config.game.multiplierDuration;
      return;
    }

    if (type === ObjectType.MAGNET) {
      state.magnetTimeLeft = Config.game.magnetDuration;
      return;
    }

    state.score += 10 * state.multiplier;
  }

  applyMiss(state: State) {
    state.missed += 1;

    if (state.missed >= Config.game.maxMissed) {
      state.status = GameStatus.GAME_OVER;
    }
  }
}
