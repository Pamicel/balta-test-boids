import * as THREE from "three";

// Initialize Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the background color to black
scene.background = new THREE.Color(0x000000);

// Create an array to store boids
const boids = [];

// Behavior constants
const separationFactor = 0.005;
const alignmentFactor = 0.002;
const cohesionFactor = 0.003;

// Boid class
class Boid {
  constructor(x, y, z, scene) {
    this.velocity = new THREE.Vector3(x, y, z);

    // Create a custom boid geometry
    const boidGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        0, 0, 0,    // Vertex 1 (origin)
        0.05, 0, 0,  // Vertex 2 (tip of the segment)
    ]);
    boidGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    boidGeometry.computeVertexNormals();
    // Create a white line material
    const boidMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    this.line = new THREE.Line( boidGeometry, boidMaterial );
    this.position = this.line.position;
    scene.add( this.line );
  }

  // Update the boid's geometry to align with its heading
  updateBoidGeometry() {
    this.line.lookAt(this.position.clone().add(this.velocity));
  }

  // Add forces
  applyForce(force) {
    this.velocity.add(force);
  }

  // Update the boid's position
  update() {
    // limit velocity to 0.1
    if (this.velocity.length() > 0.01) {
      this.velocity.normalize().multiplyScalar(0.01);
    }
    this.position.add(this.velocity);

    const boxSize = 3;
    // jump to the other side of the scene when boid reaches the edge
    if (this.position.x > boxSize) {
      this.position.x = -boxSize;
    } else if (this.position.x < -boxSize) {
      this.position.x = boxSize;
    }
    if (this.position.y > boxSize) {
      this.position.y = -boxSize;
    } else if (this.position.y < -boxSize) {
      this.position.y = boxSize;
    }
    if (this.position.z > boxSize) {
      this.position.z = -boxSize;
    } else if (this.position.z < -boxSize) {
      this.position.z = boxSize;
    }
    this.updateBoidGeometry();
  }

  addTo(scene) {
    scene.add(this.boidMesh);
  }
}

// Create a flock of boids
const numBoids = 300;
for (let i = 0; i < numBoids; i++) {
  const x = Math.random() * 2 - 1;
  const y = Math.random() * 2 - 1;
  const z = Math.random() * 2 - 1;
  const boid = new Boid(
    x,
    y,
    z,
    scene
  );
  boids.push(boid);
}

// Set camera position
camera.position.z = 5;

// Animation function
function animate() {
  requestAnimationFrame(animate);

  // Implement Reynolds' Boid algorithm behaviors
  for (const boid of boids) {
    const separationRadius = 0.1;
    const alignmentRadius = 0.2;
    const cohesionRadius = 0.2;
    const separationForce = new THREE.Vector3();
    const alignmentForce = new THREE.Vector3();
    const cohesionForce = new THREE.Vector3();
    let separationCount = 0;
    let alignmentCount = 0;
    let cohesionCount = 0;

    for (const otherBoid of boids) {
      if (otherBoid !== boid) {
        const distance = boid.position.distanceTo(otherBoid.position);

        // Separation
        if (distance < separationRadius) {
          // if distance is zero. push the boid in a random direction
          if (distance !== 0) {
            const diff = new THREE.Vector3().subVectors(
              boid.position,
              otherBoid.position
            );
            diff.normalize().divideScalar(distance);
            separationForce.add(diff);
          } else {
            const randomDirection = new THREE.Vector3(
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

  renderer.render(scene, camera);
}

// Start the animation loop
animate();
