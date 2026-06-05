import { Application, Container, Graphics, Rectangle } from "pixi.js";
import { FallingObject, ObjectType } from "../entities/FallingObject";
import { Player } from "../entities/Player";
import { CollisionSystem } from "../systems/CollisionSystem";
import { DifficultySystem } from "../systems/DifficultySystem";
import { ParticleSystem } from "../systems/ParticleSystem";
import { ScoreSystem } from "../systems/ScoreSystem";
import { SpawnSystem } from "../systems/SpawnSystem";
import { DebugOverlay } from "../ui/DebugOverlay";
import { GameOverScreen } from "../ui/GameOverScreen";
import { HUD } from "../ui/HUD";
import { StartScreen } from "../ui/StartScreen";
import { MRAID } from "../utils/mraid";
import { clamp, Vector2 } from "../utils/math";
import { Config } from "./Config";
import { GameLoop } from "./GameLoop";
import { GameStatus, createInitialState, type State } from "./GameState";

export class Game {
  private app = new Application();
  private loop = new GameLoop();
  private state: State = createInitialState();
  private player = new Player();
  private objects: FallingObject[] = [];
  private playLayer = new Container();
  private uiLayer = new Container();
  private background = new Graphics();
  private ground = new Graphics();
  private hud = new HUD(() => this.pause());
  private startScreen = new StartScreen(() => this.handleStartScreenAction());
  private gameOverScreen = new GameOverScreen(() => this.start(), () => MRAID.openStore());
  private debugOverlay = new DebugOverlay();
  private spawnSystem = new SpawnSystem();
  private collisionSystem = new CollisionSystem();
  private scoreSystem = new ScoreSystem();
  private difficultySystem = new DifficultySystem();
  private particleSystem = new ParticleSystem();
  private shakeTime = 0;
  private shakePower = 0;
  private playerTargetScaleX = 1;
  private fps = 60;

  constructor() {
    void this.init();
  }

  async init() {
    await this.app.init({
      resizeTo: window,
      backgroundColor: Config.backgroundColor,
      antialias: true,
      autoDensity: true,
    });

    this.app.ticker.stop();

    const mount = document.querySelector<HTMLDivElement>("#app") ?? document.body;
    mount.appendChild(this.app.canvas);

    this.app.stage.addChild(this.background, this.playLayer, this.uiLayer);
    this.playLayer.addChild(this.ground, this.player);
    this.uiLayer.addChild(this.hud, this.startScreen, this.gameOverScreen, this.debugOverlay);
    this.startScreen.setMode("start");

    this.bindInput();
    this.bindDebugToggle();
    this.layout();
    window.addEventListener("resize", () => this.layout());
    MRAID.gameReady();

    this.loop.start((dt) => this.update(dt));
  }

  private start() {
    this.clearObjects();
    this.particleSystem.clear();
    this.spawnSystem.reset();
    this.difficultySystem.reset();
    this.state = createInitialState();
    this.state.status = GameStatus.PLAYING;
    this.player.setUpgraded(false);
    this.startScreen.visible = false;
    this.gameOverScreen.visible = false;
    this.playLayer.visible = true;
    this.playLayer.position.set(0, 0);
    this.shakeTime = 0;
    this.layout();
  }

  private handleStartScreenAction() {
    if (this.state.status === GameStatus.PAUSED) {
      this.resume();
      return;
    }

    this.start();
  }

  private pause() {
    if (this.state.status !== GameStatus.PLAYING) {
      return;
    }

    this.state.status = GameStatus.PAUSED;
    this.startScreen.setMode("resume");
    this.startScreen.visible = true;
  }

  private resume() {
    this.state.status = GameStatus.PLAYING;
    this.startScreen.visible = false;
  }

  private update(dt: number) {
    this.fps += (1 / Math.max(dt, 0.001) - this.fps) * 0.08;

    if (this.state.status === GameStatus.PLAYING) {
      this.state.elapsed += dt;
      this.updatePowerTimers(dt);
      this.spawnSystem.update(
        dt,
        this.playLayer,
        this.objects,
        this.app.screen.width,
        this.state.spawnInterval,
        this.state.speedMultiplier,
      );

      const playerCenter = new Vector2(this.player.x, this.player.y);

      for (const object of this.objects) {
        if (this.state.magnetTimeLeft > 0) {
          object.attractTo(playerCenter, dt);
        }

        object.update(dt, this.app.screen.height - 36);
      }

      const { caught, missed } = this.collisionSystem.update(
        this.player,
        this.objects,
        this.app.screen.height,
      );

      for (const object of caught) {
        this.scoreSystem.applyCatch(object.type, this.state);
        this.player.squash();

        if (object.type === ObjectType.BOMB) {
          this.startShake(0.55, 16);
        }

        this.particleSystem.burst(
          this.playLayer,
          object.x,
          object.y,
          this.getObjectColor(object.type),
        );
        this.removeObject(object);
      }

      for (const object of missed) {
        if (object.type === ObjectType.COIN) {
          this.scoreSystem.applyMiss(this.state);
        }

        this.removeObject(object);
      }

      if (this.difficultySystem.update(this.state)) {
        this.hud.triggerLevelChange();
        this.startShake(0.24, 7);
        this.player.setUpgraded(true);
        this.particleSystem.burst(this.playLayer, this.player.x, this.player.y - 18, this.state.levelColor);
      }

      if (this.isGameOver()) {
        this.showGameOver();
      }
    }

    if (this.state.status === GameStatus.PLAYING) {
      this.particleSystem.update(dt);
      this.player.updateJuice(dt, this.playerTargetScaleX);
      this.updateShake(dt);
    }

    this.hud.visible = this.state.status === GameStatus.PLAYING;
    this.hud.update(this.state, dt);
    this.debugOverlay.update(this.state, {
      fps: this.fps,
      activeObjects: this.objects.length,
      activeParticles: this.particleSystem.activeCount,
      objectPoolTotal: this.spawnSystem.getStats().totalCreated,
      particlePoolTotal: this.particleSystem.getStats().totalCreated,
    });
    this.app.render();
  }

  private showGameOver() {
    this.clearObjects();
    this.particleSystem.clear();
    this.playLayer.visible = false;
    MRAID.gameEnd(this.state.score);
    this.gameOverScreen.setScore(this.state.score);
    this.gameOverScreen.visible = true;
  }

  private isGameOver() {
    return this.state.status === GameStatus.GAME_OVER;
  }

  private bindInput() {
    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height);
    this.app.stage.on("pointermove", (event) => {
      if (this.state.status !== GameStatus.PLAYING) {
        return;
      }

      const x = event.global.x;
      this.player.x = clamp(
        x,
        Config.player.width / 2 + 12,
        this.app.screen.width - Config.player.width / 2 - 12,
      );
    });
  }

  private bindDebugToggle() {
    window.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "d") {
        this.debugOverlay.toggle();
      }
    });
  }

  private layout() {
    const width = this.app.screen.width;
    const height = this.app.screen.height;
    const isPortrait = height >= width;
    const horizontalPadding = isPortrait ? 10 : 18;

    this.app.stage.hitArea = new Rectangle(0, 0, width, height);

    this.background.clear();
    this.background.rect(0, 0, width, height);
    this.background.fill(Config.backgroundColor);

    this.ground.clear();
    this.ground.rect(0, height - 36, width, 36);
    this.ground.fill(0x0b1020);

    this.playerTargetScaleX = isPortrait ? 0.82 : 1;
    this.player.position.set(
      clamp(
        this.player.x || width / 2,
        (Config.player.width * this.playerTargetScaleX) / 2 + horizontalPadding,
        width - (Config.player.width * this.playerTargetScaleX) / 2 - horizontalPadding,
      ),
      height - (isPortrait ? 74 : Config.player.bottomOffset),
    );
    this.player.scale.x = this.playerTargetScaleX;

    this.hud.layout(width);
    this.startScreen.layout(width, height);
    this.gameOverScreen.layout(width, height);
    this.debugOverlay.layout(width, height);
  }

  private removeObject(object: FallingObject) {
    const index = this.objects.indexOf(object);

    if (index >= 0) {
      this.objects.splice(index, 1);
    }

    this.spawnSystem.release(object);
  }

  private clearObjects() {
    for (const object of this.objects) {
      this.spawnSystem.release(object);
    }

    this.objects = [];
  }

  private updatePowerTimers(dt: number) {
    if (this.state.multiplierTimeLeft > 0) {
      this.state.multiplierTimeLeft = Math.max(0, this.state.multiplierTimeLeft - dt);

      if (this.state.multiplierTimeLeft === 0) {
        this.state.multiplier = 1;
      }
    }

    if (this.state.magnetTimeLeft > 0) {
      this.state.magnetTimeLeft = Math.max(0, this.state.magnetTimeLeft - dt);
    }
  }

  private startShake(duration: number, power: number) {
    this.shakeTime = Math.max(this.shakeTime, duration);
    this.shakePower = Math.max(this.shakePower, power);
  }

  private updateShake(dt: number) {
    if (this.shakeTime <= 0) {
      this.playLayer.position.set(0, 0);
      this.shakePower = 0;
      return;
    }

    this.shakeTime = Math.max(0, this.shakeTime - dt);
    const power = this.shakePower * (this.shakeTime / 0.55);
    this.playLayer.position.set((Math.random() - 0.5) * power, (Math.random() - 0.5) * power);
  }

  private getObjectColor(type: ObjectType) {
    switch (type) {
      case ObjectType.BOMB:
        return 0xff4d5d;
      case ObjectType.GEM_X2:
        return 0x59d8ff;
      case ObjectType.GEM_X10:
        return 0xff6bd6;
      case ObjectType.MAGNET:
        return 0x35f2a6;
      default:
        return 0xffd166;
    }
  }
}
