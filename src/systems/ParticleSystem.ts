import { Container, Graphics } from "pixi.js";
import { ObjectPool } from "../utils/ObjectPool";
import { randomBetween } from "../utils/math";

interface Particle {
  view: Graphics;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private pool = new ObjectPool(
    () => new Graphics(),
    (view) => {
      view.removeFromParent();
      view.clear();
      view.alpha = 1;
      view.scale.set(1);
      view.rotation = 0;
      view.visible = true;
    },
  );

  burst(stage: Container, x: number, y: number, color: number) {
    for (let i = 0; i < 12; i += 1) {
      const view = this.pool.acquire();
      view.circle(0, 0, randomBetween(2, 5));
      view.fill(color);
      view.position.set(x, y);
      stage.addChild(view);

      this.particles.push({
        view,
        vx: randomBetween(-180, 180),
        vy: randomBetween(-260, -90),
        life: 0,
        maxLife: randomBetween(0.35, 0.65),
      });
    }
  }

  update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const particle = this.particles[i];

      particle.life += dt;
      particle.vy += 520 * dt;
      particle.view.x += particle.vx * dt;
      particle.view.y += particle.vy * dt;
      particle.view.alpha = Math.max(0, 1 - particle.life / particle.maxLife);

      if (particle.life >= particle.maxLife) {
        particle.view.removeFromParent();
        this.pool.release(particle.view);
        this.particles.splice(i, 1);
      }
    }
  }

  clear() {
    for (const particle of this.particles) {
      particle.view.removeFromParent();
      this.pool.release(particle.view);
    }

    this.particles = [];
  }

  get activeCount() {
    return this.particles.length;
  }

  getStats() {
    return this.pool.stats;
  }
}
