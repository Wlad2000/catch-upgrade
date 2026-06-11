import { Container, Graphics, Text } from "pixi.js";

export type StartScreenMode = "start" | "resume";

export class StartScreen extends Container {
  private panel = new Graphics();
  private actionButton = new Container();
  private actionBg = new Graphics();
  private infoButton = new Container();
  private infoBg = new Graphics();
  private credit = new Text({
    text: "Developed by Vlad Harashko 2026",
    style: {
      fill: 0x9ee7ff,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 16,
      fontWeight: "700" as const,
    },
  });
  private title = new Text({
    text: "Catch & Upgrade",
    style: {
      fill: 0xffffff,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 42,
      fontWeight: "900" as const,
    },
  });
  private subtitle = new Text({
    text: "Drag the platform. Catch rewards. Avoid bombs.",
    style: {
      fill: 0xb9c5d6,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 17,
      fontWeight: "600" as const,
      align: "center",
    },
  });
  private button = new Text({
    text: "START",
    style: {
      fill: 0x111827,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 22,
      fontWeight: "900" as const,
    },
  });
  private infoText = new Text({
    text: "INFO",
    style: {
      fill: 0x111827,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 18,
      fontWeight: "900" as const,
    },
  });

  constructor(onStart: () => void, onInfo: () => void) {
    super();
    this.eventMode = "static";
    this.actionButton.eventMode = "static";
    this.actionButton.cursor = "pointer";
    this.actionButton.on("pointertap", (event) => {
      event.stopPropagation();
      onStart();
    });
    this.infoButton.eventMode = "static";
    this.infoButton.cursor = "pointer";
    this.infoButton.on("pointertap", (event) => {
      event.stopPropagation();
      onInfo();
    });
    this.actionButton.addChild(this.actionBg, this.button);
    this.infoButton.addChild(this.infoBg, this.infoText);
    this.addChild(this.panel, this.credit, this.title, this.subtitle, this.actionButton, this.infoButton);
  }

  setMode(mode: StartScreenMode) {
    this.button.text = mode === "resume" ? "RESUME" : "START";
  }

  layout(width: number, height: number) {
    this.panel.clear();
    this.panel.rect(0, 0, width, height);
    this.panel.fill({ color: 0x070b13, alpha: 0.78 });

    this.credit.anchor.set(0.5, 0);
    this.credit.position.set(width / 2, 22);
    this.credit.style.fontSize = width < 400 ? 12 : 16;
    this.title.anchor.set(0.5);
    this.title.position.set(width / 2, height / 2 - 72);
    this.title.style.fontSize = width < 400 ? 32 : 42;
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(width / 2, height / 2 - 22);
    this.subtitle.style.fontSize = width < 400 ? 14 : 17;

    this.actionBg.clear();
    this.actionBg.roundRect(0, 0, 184, 52, 8);
    this.actionBg.fill(0x35f2a6);
    this.button.anchor.set(0.5);
    this.button.position.set(92, 26);
    this.actionButton.position.set(width / 2 - 92, height / 2 + 72);

    this.infoBg.clear();
    this.infoBg.roundRect(0, 0, 132, 42, 8);
    this.infoBg.fill(0xffd166);
    this.infoText.anchor.set(0.5);
    this.infoText.position.set(66, 21);
    this.infoButton.position.set(width / 2 - 66, height / 2 + 136);
  }
}
