import * as THREE from "three";
import { Boid } from "./Boid";
import { Scene } from "./Scene";
import { config } from "./config";

// Create a scene
const scene: Scene = new Scene();
// Create an array to store boids
const boids: Boid[] = [];

// Create a flock of boids
for (let i = 0; i < config.numBoids; i++) {
  const x: number = Math.random() * 2 - 1;
  const y: number = Math.random() * 2 - 1;
  const z: number = Math.random() * 2 - 1;
  const boid: Boid = new Boid(x, y, z, scene.scene);
  boids.push(boid);
}

// Animation function
function animate(): void {
  requestAnimationFrame(animate);

  // Implement Reynolds' Boid algorithm behaviors
  for (const boid of boids) {
    const separationRadius: number = 0.1;
    const alignmentRadius: number = 0.2;
    const cohesionRadius: number = 0.2;
    const separationForce: THREE.Vector3 = new THREE.Vector3();
    const alignmentForce: THREE.Vector3 = new THREE.Vector3();
    const cohesionForce: THREE.Vector3 = new THREE.Vector3();
    let separationCount: number = 0;
    let alignmentCount: number = 0;
    let cohesionCount: number = 0;

    for (const otherBoid of boids) {
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
      separationForce.multiplyScalar(config.separationFactor); // Adjust separation strength
    }

    if (alignmentCount > 0) {
      alignmentForce.divideScalar(alignmentCount);
      alignmentForce.normalize();
      alignmentForce.multiplyScalar(config.alignmentFactor); // Adjust alignment strength
    }

    if (cohesionCount > 0) {
      cohesionForce.divideScalar(cohesionCount);
      cohesionForce.sub(boid.position);
      cohesionForce.normalize();
      cohesionForce.multiplyScalar(config.cohesionFactor); // Adjust cohesion strength
    }

    // Update boid's velocity based on forces
    boid.applyForce(separationForce);
    boid.applyForce(alignmentForce);
    boid.applyForce(cohesionForce);
    // Update boid's position based on velocity
    boid.update();
  }

  scene.render();
}

// Start the animation loop
animate();
