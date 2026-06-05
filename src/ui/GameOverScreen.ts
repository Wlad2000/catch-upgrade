import { Container, Graphics, Text } from "pixi.js";

export class GameOverScreen extends Container {
  private panel = new Graphics();
  private retryButton = new Container();
  private ctaButton = new Container();
  private title = new Text({
    text: "End Card",
    style: {
      fill: 0xffffff,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 40,
      fontWeight: "900" as const,
    },
  });
  private score = new Text({
    text: "",
    style: {
      fill: 0xb9c5d6,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 20,
      fontWeight: "700" as const,
    },
  });
  private ctaText = new Text({
    text: "PLAY NOW",
    style: {
      fill: 0x111827,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 22,
      fontWeight: "900" as const,
    },
  });
  private retryText = new Text({
    text: "RETRY",
    style: {
      fill: 0xffffff,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 15,
      fontWeight: "900" as const,
    },
  });
  private ctaBg = new Graphics();
  private retryBg = new Graphics();

  constructor(onRestart: () => void, onCta: () => void) {
    super();
    this.visible = false;
    this.retryButton.eventMode = "static";
    this.retryButton.cursor = "pointer";
    this.retryButton.on("pointertap", (event) => {
      event.stopPropagation();
      onRestart();
    });
    this.ctaButton.eventMode = "static";
    this.ctaButton.cursor = "pointer";
    this.ctaButton.on("pointertap", (event) => {
      event.stopPropagation();
      onCta();
    });
    this.ctaButton.addChild(this.ctaBg, this.ctaText);
    this.retryButton.addChild(this.retryBg, this.retryText);
    this.addChild(this.panel, this.title, this.score, this.ctaButton, this.retryButton);
  }

  layout(width: number, height: number) {
    this.panel.clear();
    this.panel.rect(0, 0, width, height);
    this.panel.fill({ color: 0x070b13, alpha: 0.82 });
    this.panel.roundRect(width / 2 - 104, height / 2 + 38, 208, 56, 8);
    this.panel.fill(0xffd166);
    this.panel.roundRect(width / 2 - 72, height / 2 + 110, 144, 38, 8);
    this.panel.stroke({ color: 0x9ee7ff, width: 2 });

    this.title.anchor.set(0.5);
    this.title.position.set(width / 2, height / 2 - 74);
    this.title.scale.set(Math.min(1, (width - 36) / this.title.width));
    this.score.anchor.set(0.5);
    this.score.position.set(width / 2, height / 2 - 22);
    this.ctaButton.position.set(width / 2 - 104, height / 2 + 38);
    this.retryButton.position.set(width / 2 - 72, height / 2 + 110);
    this.ctaBg.clear();
    this.ctaBg.roundRect(0, 0, 208, 56, 8);
    this.ctaBg.fill(0xffd166);
    this.retryBg.clear();
    this.retryBg.roundRect(0, 0, 144, 38, 8);
    this.retryBg.fill({ color: 0x111827, alpha: 0.2 });
    this.ctaText.anchor.set(0.5);
    this.ctaText.position.set(104, 28);
    this.retryText.anchor.set(0.5);
    this.retryText.position.set(72, 19);
  }

  setScore(score: number) {
    this.score.text = `Final score ${score}`;
  }
}
