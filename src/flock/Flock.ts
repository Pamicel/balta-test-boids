import * as THREE from "three";
import { Boid } from "./Boid";
import { BehaviourSettings, SpaceConstraintsSettings } from "../config";
import { FlockSettings } from "./FlockSettings";

type BoidAppearance = {
  color: number;
  size: number;
};

export class Flock {
  public name: string;
  public boids: Boid[] = [];
  public settings: FlockSettings;

  constructor({
    name,
    numBoids,
    boidAppearance,
    spaceConstraints,
    behaviour,
    scene,
  }: {
    name: string;
    numBoids: number;
    boidAppearance: BoidAppearance;
    spaceConstraints: SpaceConstraintsSettings;
    behaviour: BehaviourSettings;
    scene: THREE.Scene;
  }) {
    this.name = name;
    this.settings = new FlockSettings({
      flock: this,
      behaviourSettings: behaviour,
      boidAppearance,
      spaceConstraints,
    });
    this.addBoids(numBoids, scene);
  }

  public refreshBoidsAppearance(boidSettings: BoidAppearance) {
    this.boids.forEach((boid) =>
      boid.changeAppearance({
        color: this.settings.boidAppearance.color,
        size: this.settings.boidAppearance.size,
      })
    );
  }

  public addBoids(n: number, scene: THREE.Scene): void {
    for (let i = 0; i < n; i++) {
      const x: number = Math.random() * 2 - 1;
      const y: number = Math.random() * 2 - 1;
      const z: number = Math.random() * 2 - 1;
      const position = new THREE.Vector3(x, y, z);
      const boid: Boid = new Boid({
        position,
        scene,
        flock: this,
      });
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
    // Implement Reynolds' Boid algorithm behaviors
    for (const boid of this.boids) {
      const separationForce: THREE.Vector3 = new THREE.Vector3();
      const alignmentForce: THREE.Vector3 = new THREE.Vector3();
      const cohesionForce: THREE.Vector3 = new THREE.Vector3();
      let separationCount: number = 0;
      let alignmentCount: number = 0;
      let cohesionCount: number = 0;

      const {
        separationRadius,
        alignmentRadius,
        cohesionRadius,
        separationFactor,
        alignmentFactor,
        cohesionFactor,
        maxVelocity,
      } = this.settings.behaviour;

      for (const otherBoid of this.boids) {
        if (otherBoid !== boid) {
          const distance: number = boid.position.distanceTo(otherBoid.position);

          // Separation
          if (distance < separationRadius) {
            // if distance is zero. push the boid in a random direction
            if (distance !== 0) {
              const diff: THREE.Vector3 = new THREE.Vector3().subVectors(
                boid.position,
                otherBoid.position
              );
              diff.normalize().divideScalar(distance);
              separationForce.add(diff);
            } else {
              const randomDirection: THREE.Vector3 = new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
              );
              separationForce.add(randomDirection);
            }
            separationCount++;
          }

          // Alignment
          if (distance < alignmentRadius) {
            alignmentForce.add(otherBoid.velocity);
            alignmentCount++;
          }

          // Cohesion
          if (distance < cohesionRadius) {
            cohesionForce.add(otherBoid.position);
            cohesionCount++;
          }
        }
      }

      // Apply separation, alignment, and cohesion forces
      if (separationCount > 0) {
        separationForce.divideScalar(separationCount);
        separationForce.normalize();
        separationForce.multiplyScalar(separationFactor); // Adjust separation strength
      }

      if (alignmentCount > 0) {
        alignmentForce.divideScalar(alignmentCount);
        alignmentForce.normalize();
        alignmentForce.multiplyScalar(alignmentFactor); // Adjust alignment strength
      }

      if (cohesionCount > 0) {
        cohesionForce.divideScalar(cohesionCount);
        cohesionForce.sub(boid.position);
        cohesionForce.normalize();
        cohesionForce.multiplyScalar(cohesionFactor); // Adjust cohesion strength
      }

      // Update boid's velocity based on forces
      boid.applyForce(separationForce);
      boid.applyForce(alignmentForce);
      boid.applyForce(cohesionForce);
      // Update boid's position based on velocity
      boid.update();
    }
  }
}
