import { Boid } from "./Boid";

export class Flock {
  public boids: Boid[];

  constructor() {
    this.boids = [];
  }

  public addBoids(n: number, scene: THREE.Scene): void {
    for (let i = 0; i < n; i++) {
      const x: number = Math.random() * 2 - 1;
      const y: number = Math.random() * 2 - 1;
      const z: number = Math.random() * 2 - 1;
      const boid: Boid = new Boid(x, y, z, scene);
      this.boids.push(boid);
    }
  }

  public removeBoids(n: number): void {
    for (let i = 0; i < n; i++) {
      const boid = this.boids.pop();
      if (boid) {
        boid.remove();
      }
    }
  }

  public update(): void {
    for (const boid of this.boids) {
      boid.update();
    }
  }
}
