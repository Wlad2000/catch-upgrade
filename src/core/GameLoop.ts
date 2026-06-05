export class GameLoop {
  private lastTime = 0;
  private frameId = 0;
  private running = false;

  start(update: (delta: number) => void) {
    this.stop();
    this.running = true;
    this.lastTime = performance.now();

    const tick = (time:number) => {
      if (!this.running) {
        return;
      }

      const delta = Math.min((time - this.lastTime) / 1000, 0.05);
      this.lastTime = time;

      update(delta);

      this.frameId = requestAnimationFrame(tick);
    };

    this.frameId = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;

    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }
  }
}
