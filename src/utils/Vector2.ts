export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(vector: Vector2) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  }

  add(vector: Vector2) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  scale(value: number) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  length() {
    return Math.hypot(this.x, this.y);
  }

  normalize() {
    const length = this.length();

    if (length > 0) {
      this.x /= length;
      this.y /= length;
    }

    return this;
  }

  static distance(a: Vector2, b: Vector2) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  static lerp(a: Vector2, b: Vector2, t: number) {
    return new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
  }

  static fromPoints(ax: number, ay: number, bx: number, by: number) {
    return new Vector2(bx - ax, by - ay);
  }
}
