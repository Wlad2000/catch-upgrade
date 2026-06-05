import { Container, Graphics, Text } from "pixi.js";
import { GameStatus, type State } from "../core/GameState";

export class HUD extends Container {
  private scoreText = new Text({ text: "", style: this.textStyle(28, 0xffffff) });
  private missedText = new Text({ text: "", style: this.textStyle(17, 0xffb4bd) });
  private multiplierText = new Text({ text: "", style: this.textStyle(17, 0xffd166) });
  private levelText = new Text({ text: "", style: this.textStyle(24, 0x9ee7ff) });
  private powerTimerText = new Text({ text: "", style: this.textStyle(15, 0xffffff) });
  private pauseButton = new Container();
  private pauseBg = new Graphics();
  private pauseText = new Text({ text: "PAUSE", style: this.textStyle(14, 0x111827) });
  private levelPulse = 0;
  private levelBaseX = 0;

  constructor(onPause: () => void) {
    super();
    this.pauseButton.eventMode = "static";
    this.pauseButton.cursor = "pointer";
    this.pauseButton.on("pointertap", (event) => {
      event.stopPropagation();
      onPause();
    });
    this.pauseButton.addChild(this.pauseBg, this.pauseText);
    this.addChild(
      this.scoreText,
      this.missedText,
      this.multiplierText,
      this.levelText,
      this.powerTimerText,
      this.pauseButton,
    );
  }

  layout(width: number) {
    this.scoreText.position.set(20, 16);
    this.missedText.position.set(20, 78);
    this.multiplierText.position.set(20, 50);
    this.levelText.anchor.set(0.5, 0);
    this.levelText.position.set(width / 2, 18);
    this.levelBaseX = width / 2;
    this.powerTimerText.anchor.set(0.5, 0);
    this.powerTimerText.position.set(width / 2, 50);

    this.pauseBg.clear();
    this.pauseBg.roundRect(0, 0, 86, 34, 8);
    this.pauseBg.fill(0x9ee7ff);
    this.pauseText.anchor.set(0.5);
    this.pauseText.position.set(43, 17);
    this.pauseButton.position.set(width - 106, 18);
  }

  update(state: State, dt: number) {
    this.scoreText.text = `Score ${state.score}`;
    this.missedText.text = `Missed ${state.missed}/5`;
    this.multiplierText.text = state.multiplier > 1 ? `X${state.multiplier}` : "";
    this.levelText.text = `LEVEL ${state.level}`;
    this.levelText.style.fill = state.levelColor;
    this.powerTimerText.text = this.getPowerTimerText(state);
    this.pauseButton.visible = state.status === GameStatus.PLAYING;

    if (this.levelPulse > 0) {
      this.levelPulse = Math.max(0, this.levelPulse - dt);
      const wobble = Math.sin(this.levelPulse * 48) * 5;
      const scale = 1 + this.levelPulse * 0.35;
      this.levelText.x = this.levelBaseX + wobble;
      this.levelText.scale.set(scale);
    } else {
      this.levelText.x = this.levelBaseX;
      this.levelText.scale.set(1);
    }
  }

  triggerLevelChange() {
    this.levelPulse = 0.45;
  }

  private getPowerTimerText(state: State) {
    const timers: string[] = [];

    if (state.multiplierTimeLeft > 0) {
      timers.push(`Gem X${state.multiplier} ${Math.ceil(state.multiplierTimeLeft)}s`);
    }

    if (state.magnetTimeLeft > 0) {
      timers.push(`Magnet ${Math.ceil(state.magnetTimeLeft)}s`);
    }

    return timers.join("  ");
  }

  private textStyle(fontSize: number, fill: number) {
    return {
      fill,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize,
      fontWeight: "700" as const,
    };
  }
}
