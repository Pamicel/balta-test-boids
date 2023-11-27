import * as THREE from "three";
import { Stage } from "./Stage";
import { settings, settingsManager } from "./config";
import { Flock } from "./Flock";

// Create the scene
const stage: Stage = new Stage();
// Create the flock
const flock: Flock = new Flock();

// Add boids to the flock
flock.addBoids(settings.numBoids, stage.scene);

// Animation function
function animate(): void {
  requestAnimationFrame(animate);

  // Implement Reynolds' Boid algorithm behaviors
  for (const boid of flock.boids) {
    const separationForce: THREE.Vector3 = new THREE.Vector3();
    const alignmentForce: THREE.Vector3 = new THREE.Vector3();
    const cohesionForce: THREE.Vector3 = new THREE.Vector3();
    let separationCount: number = 0;
    let alignmentCount: number = 0;
    let cohesionCount: number = 0;

    for (const otherBoid of flock.boids) {
      if (otherBoid !== boid) {
        const distance: number = boid.position.distanceTo(otherBoid.position);

        // Separation
        if (distance < settings.separationRadius) {
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
        if (distance < settings.alignmentRadius) {
          alignmentForce.add(otherBoid.velocity);
          alignmentCount++;
        }

        // Cohesion
        if (distance < settings.cohesionRadius) {
          cohesionForce.add(otherBoid.position);
          cohesionCount++;
        }
      }
    }

    // Apply separation, alignment, and cohesion forces
    if (separationCount > 0) {
      separationForce.divideScalar(separationCount);
      separationForce.normalize();
      separationForce.multiplyScalar(settings.separationFactor); // Adjust separation strength
    }

    if (alignmentCount > 0) {
      alignmentForce.divideScalar(alignmentCount);
      alignmentForce.normalize();
      alignmentForce.multiplyScalar(settings.alignmentFactor); // Adjust alignment strength
    }

    if (cohesionCount > 0) {
      cohesionForce.divideScalar(cohesionCount);
      cohesionForce.sub(boid.position);
      cohesionForce.normalize();
      cohesionForce.multiplyScalar(settings.cohesionFactor); // Adjust cohesion strength
    }

    // Update boid's velocity based on forces
    boid.applyForce(separationForce);
    boid.applyForce(alignmentForce);
    boid.applyForce(cohesionForce);
    // Update boid's position based on velocity
    boid.update();
  }

  stage.render();
}

// Keypress event listener
document.addEventListener("keydown", (event: KeyboardEvent) => {
  console.log(event.key);
  switch (event.key) {
    case "ArrowUp":
      settings.numBoids += 10;
      flock.addBoids(10, stage.scene);
      break;
    case "ArrowDown":
      settings.numBoids -= 10;
      flock.removeBoids(10);
      break;
    case "ArrowLeft":
      settings.boxSize -= 1;
      break;
    case "ArrowRight":
      settings.boxSize += 1;
      break;

    case "a":
    case "s":
      settingsManager.setMode(event.key);
      break;
    default:
      break;
  }
  console.log(JSON.stringify(settings, null, 2));
});

// Start the animation loop
animate();
