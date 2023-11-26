import * as THREE from "three";

// Boid class
export class Boid {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  private line: THREE.Line;

  constructor(x: number, y: number, z: number, scene: THREE.Scene) {
    this.velocity = new THREE.Vector3(x, y, z);

    // Create a custom boid geometry
    const boidGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    const vertices: Float32Array = new Float32Array([
      0, 0, 0,
      0.05, 0, 0, // Vertex 2 (tip of the segment)
    ]);
    boidGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    boidGeometry.computeVertexNormals();
    // Create a white line material
    const boidMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    this.line = new THREE.Line(boidGeometry, boidMaterial);
    this.position = this.line.position;
    scene.add(this.line);
  }

  // Update the boid's geometry to align with its heading
  private updateBoidGeometry(): void {
    this.line.lookAt(this.position.clone().add(this.velocity));
  }

  // Add forces
  public applyForce(force: THREE.Vector3): void {
    this.velocity.add(force);
  }

  // Update the boid's position
  public update(): void {
    // limit velocity to 0.1
    if (this.velocity.length() > 0.01) {
      this.velocity.normalize().multiplyScalar(0.01);
    }
    this.position.add(this.velocity);

    const boxSize: number = 3;
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
}
