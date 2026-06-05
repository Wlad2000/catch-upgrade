import { Container, Text } from "pixi.js";
import type { State } from "../core/GameState";

export interface DebugStats {
  fps: number;
  activeObjects: number;
  activeParticles: number;
  objectPoolTotal: number;
  particlePoolTotal: number;
}

export class DebugOverlay extends Container {
  private text = new Text({
    text: "",
    style: {
      fill: 0xc4f06f,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      fontSize: 13,
      fontWeight: "700" as const,
    },
  });

  constructor() {
    super();
    this.visible = false;
    this.addChild(this.text);
  }

  toggle() {
    this.visible = !this.visible;
  }

  layout(width: number, height: number) {
    this.text.anchor.set(1, 1);
    this.text.position.set(width - 18, height - 48);
  }

  update(state: State, stats: DebugStats) {
    this.text.text = [
      `FPS ${stats.fps.toFixed(0)}`,
      `objects ${stats.activeObjects} / pool ${stats.objectPoolTotal}`,
      `particles ${stats.activeParticles} / pool ${stats.particlePoolTotal}`,
      `spawn ${state.spawnInterval.toFixed(0)}ms`,
      `speed x${state.speedMultiplier.toFixed(2)}`,
    ].join("\n");
  }
}
