export class ObjectPool<T> {
  private available: T[] = [];
  private totalCreated = 0;
  private readonly create: () => T;
  private readonly reset: (item: T) => void;

  constructor(create: () => T, reset: (item: T) => void) {
    this.create = create;
    this.reset = reset;
  }

  acquire() {
    const item = this.available.pop();

    if (item) {
      this.reset(item);
      return item;
    }

    this.totalCreated += 1;
    const created = this.create();
    this.reset(created);
    return created;
  }

  release(item: T) {
    this.available.push(item);
  }

  clear() {
    this.available = [];
  }

  get stats() {
    return {
      available: this.available.length,
      totalCreated: this.totalCreated,
    };
  }
}
