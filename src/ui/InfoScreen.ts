import { Container, Graphics, Text } from "pixi.js";
import { FallingObject, ObjectType } from "../entities/FallingObject";

interface InfoItem {
  type: ObjectType;
  title: string;
  body: string;
}

export class InfoScreen extends Container {
  private panel = new Graphics();
  private title = new Text({
    text: "How To Play",
    style: this.textStyle(34, 0xffffff, "900"),
  });
  private rules = new Text({
    text: "Catch tennis balls to score points. Avoid bombs. Optional power-ups can boost your run. Every level increases speed and spawn pressure.",
    style: {
      ...this.textStyle(16, 0xb9c5d6, "700"),
      align: "center" as const,
      wordWrap: true,
      wordWrapWidth: 520,
    },
  });
  private closeButton = new Container();
  private closeBg = new Graphics();
  private closeText = new Text({
    text: "CLOSE",
    style: this.textStyle(16, 0x111827, "900"),
  });
  private rows: Array<{
    icon: FallingObject;
    title: Text;
    body: Text;
  }> = [];

  private items: InfoItem[] = [
    {
      type: ObjectType.COIN,
      title: "COIN / BALL",
      body: "Required catch. Gives score and can bounce from the floor once before it is missed.",
    },
    {
      type: ObjectType.GEM_X2,
      title: "GEM_X2",
      body: "Optional power-up. Doubles score from COIN / BALL catches for 30 seconds.",
    },
    {
      type: ObjectType.GEM_X10,
      title: "GEM_X10",
      body: "Rare optional power-up. Multiplies COIN / BALL score by 10 for 30 seconds.",
    },
    {
      type: ObjectType.MAGNET,
      title: "MAGNET",
      body: "Optional power-up. Shows a visible zone and pulls positive objects inside it.",
    },
    {
      type: ObjectType.BOMB,
      title: "BOMB",
      body: "Danger object. Catching it ends the game immediately.",
    },
  ];

  constructor(onClose: () => void) {
    super();
    this.visible = false;
    this.eventMode = "static";

    this.closeButton.eventMode = "static";
    this.closeButton.cursor = "pointer";
    this.closeButton.on("pointertap", (event) => {
      event.stopPropagation();
      onClose();
    });
    this.closeButton.addChild(this.closeBg, this.closeText);

    for (const item of this.items) {
      const icon = new FallingObject();
      icon.reset(item.type, 0, 0, 0);
      icon.scale.set(1.05);
      const title = new Text({ text: item.title, style: this.textStyle(15, 0xffffff, "900") });
      const body = new Text({
        text: item.body,
        style: {
          ...this.textStyle(13, 0xb9c5d6, "700"),
          wordWrap: true,
          wordWrapWidth: 430,
        },
      });
      this.rows.push({ icon, title, body });
    }

    this.addChild(this.panel, this.title, this.rules);
    for (const row of this.rows) {
      this.addChild(row.icon, row.title, row.body);
    }
    this.addChild(this.closeButton);
  }

  layout(width: number, height: number) {
    const compact = width < 520 || height < 690;
    const contentWidth = Math.min(width - 32, compact ? 520 : 620);
    const left = (width - contentWidth) / 2;
    const top = compact ? 18 : 30;
    const rowGap = compact ? 78 : 86;
    const iconX = left + 34;
    const textX = left + 70;
    const rowsTop = top + (compact ? 132 : 148);

    this.panel.clear();
    this.panel.rect(0, 0, width, height);
    this.panel.fill({ color: 0x070b13, alpha: 0.92 });

    this.title.anchor.set(0.5, 0);
    this.title.position.set(width / 2, top);
    this.title.style.fontSize = compact ? 28 : 34;

    this.rules.anchor.set(0.5, 0);
    this.rules.position.set(width / 2, top + (compact ? 44 : 54));
    this.rules.style.fontSize = compact ? 13 : 16;
    this.rules.style.wordWrapWidth = contentWidth - 20;

    this.rows.forEach((row, index) => {
      const y = rowsTop + index * rowGap;
      row.icon.position.set(iconX, y + 17);
      row.title.position.set(textX, y);
      row.body.position.set(textX, y + 24);
      row.body.style.wordWrapWidth = contentWidth - 86;
      row.title.style.fontSize = compact ? 13 : 15;
      row.body.style.fontSize = compact ? 11 : 13;
    });

    this.closeBg.clear();
    this.closeBg.roundRect(0, 0, 150, 42, 8);
    this.closeBg.fill(0x9ee7ff);
    this.closeText.anchor.set(0.5);
    this.closeText.position.set(75, 21);
    this.closeButton.position.set(width / 2 - 75, height - (compact ? 56 : 70));
  }

  private textStyle(fontSize: number, fill: number, fontWeight: "700" | "900") {
    return {
      fill,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize,
      fontWeight,
    };
  }
}
