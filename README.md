# Catch & Upgrade

PixiJS + TypeScript playable ad prototype focused on simple 2D arcade gameplay, readable architecture, and ad-style game flow.

## Story

The player controls a platform at the bottom of the screen and catches falling objects. The core object is a green tennis ball: it gives score and can bounce from the floor once before it is missed. Optional power-ups change the tempo, while bombs punish mistakes.

The project is intentionally small and clean so it can be used as a pet project for learning and portfolio review.

## Gameplay

- Catch `COIN / BALL` objects to score points.
- Avoid `BOMB` objects. Catching one ends the game.
- Missing 5 required balls ends the game.
- Difficulty increases over time: falling speed grows and spawn interval becomes shorter.
- `GEM_X2` doubles ball score for 30 seconds.
- `GEM_X10` is rare and multiplies ball score by 10 for 30 seconds.
- `MAGNET` activates a visible magnet zone around the platform and pulls positive objects inside it.
- The game has Start, Pause/Resume, Info, Game Over, and End Card CTA flow.

## Controls

- Mouse or touch drag: move the platform.
- `INFO`: open rules and object descriptions.
- `PAUSE`: pause gameplay.
- `D`: toggle debug overlay.

## Tech Stack

- PixiJS for rendering.
- TypeScript.
- Vite.
- Manual `requestAnimationFrame` game loop.
- AABB collision detection.
- Simple ECS-like separation through systems.
- Object pools for falling objects and particles.
- MRAID-ready mock wrapper for playable ad integration.

## Project Structure

```txt
src/
  core/
    Config.ts
    Game.ts
    GameLoop.ts
    GameState.ts
  entities/
    FallingObject.ts
    Player.ts
  systems/
    CollisionSystem.ts
    DifficultySystem.ts
    ParticleSystem.ts
    ScoreSystem.ts
    SpawnSystem.ts
  ui/
    DebugOverlay.ts
    GameOverScreen.ts
    HUD.ts
    InfoScreen.ts
    StartScreen.ts
  utils/
    ObjectPool.ts
    Vector2.ts
    collision.ts
    math.ts
    mraid.ts
    random.ts
```

## What This Project Demonstrates

- 2D playable ad mechanics and flow.
- PixiJS rendering and canvas UI.
- Game state management: start, playing, paused, game over.
- Gameplay systems: spawn, collision, score, difficulty.
- Basic 2D math: velocity, distance, normalization, lerp.
- Physics-lite behavior: gravity, one-time floor bounce, magnet attraction.
- Game feel: screen shake, squash/stretch, particles, level pulse.
- Performance thinking: object pooling for reusable entities and particles.
- Ad-specific thinking: MRAID mock, end card, CTA button.

## Run Locally

```bash
npm install
npm run dev
```

Build production version:

```bash
npm run build
```

Note: this Vite version requires a modern Node.js version. Use Node `20.19+` or `22.12+`.

## MRAID Mock

The project includes a small MRAID-ready wrapper in `src/utils/mraid.ts`:

- `gameReady()` is called after app initialization.
- `gameEnd(score)` is called on game over.
- `openStore()` is called by the end card CTA.

In a real playable ad environment, these methods can be connected to the ad network SDK.
