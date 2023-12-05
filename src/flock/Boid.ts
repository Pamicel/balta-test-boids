import * as THREE from "three";
import { SpaceConstraintsSettings } from "../config";

// Boid class
export class Boid {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  private particle: THREE.Mesh;
  private scene: THREE.Scene;

  constructor({
    position,
    scene,
    color,
    size,
  }: {
    position: THREE.Vector3;
    scene: THREE.Scene;
    color: number;
    size: number;
  }) {
    // create random velocity
    this.velocity = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    this.scene = scene;
    this.createParticle({ position, color, size });
  }

  private createParticle({
    position,
    color,
    size,
  }: {
    position: THREE.Vector3;
    color: number;
    size: number;
  }): void {
    // // Create a custom boid geometry
    // const boidGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    // const vertices: Float32Array = new Float32Array([
    //   0, 0, 0,
    //   0, 0, -0.05, // Vertex 2 (tip of the segment)
    // ]);
    // boidGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // // Create a white line material
    // const boidMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: settings.boidColor });
    // this.particle = new THREE.Line(boidGeometry, boidMaterial);

    const boidGeometry = new THREE.CircleGeometry(size, 6);
    // const boidGeometry = new THREE.SphereGeometry(settings.boidSize, 6, 6);
    // boidGeometry.computeVertexNormals();
    const boidMaterial = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
    });
    this.particle = new THREE.Mesh(boidGeometry, boidMaterial);
    this.particle.position.copy(position);
    // Set this.position to be a reference to the particle's position
    this.position = this.particle.position;
    // Add the particle to the scene
    this.scene.add(this.particle);
  }

  public changeAppearance({
    color,
    size,
  }: {
    color: number;
    size: number;
  }): void {
    const position = this.position.clone();
    if (this.particle) {
      this.scene.remove(this.particle);
    }
    this.createParticle({ position, color, size });
  }

  public remove(): void {
    // this.scene.remove(this.line);
    this.scene.remove(this.particle);
  }

  // Update the boid's geometry to align with its heading
  private alignWithMovement(): void {
    // this.line.lookAt(this.position.clone().add(this.velocity));
    // this.circle.lookAt(this.position.clone().add(this.velocity));
    this.particle.lookAt(this.position.clone().add(this.velocity));
  }

  // Add forces
  public applyForce(force: THREE.Vector3): void {
    this.velocity.add(force);
  }

  private limitVelocity(maxVelocity: number): void {
    // limit velocity to settings.maxVelocity
    if (this.velocity.length() > maxVelocity) {
      this.velocity.normalize().multiplyScalar(maxVelocity);
    }
  }

  // Update the boid's position
  public update(constraints: {
    space: SpaceConstraintsSettings;
    maxVelocity: number;
  }): void {
    if (constraints.space.pushFromCenter) {
      const distanceToCenter = this.position.length();
      if (distanceToCenter < constraints.space.pushFromCenter.radius) {
        const pushForce = this.position
          .clone()
          .normalize()
          .multiplyScalar(constraints.space.pushFromCenter.strength);
        this.applyForce(pushForce);
      }
    }

    this.limitVelocity(constraints.maxVelocity);
    this.position.add(this.velocity);

    const { boxSize, boxShape, boxMode } = constraints.space;
    if (boxShape === "cube" && boxMode === "wrap") {
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
    }

    if (boxShape === "cube" && boxMode === "bounce") {
      // bounce off when boid reaches the edge
      if (this.position.x > boxSize) {
        this.position.x = boxSize;
        this.velocity.x *= -1;
      } else if (this.position.x < -boxSize) {
        this.position.x = -boxSize;
        this.velocity.x *= -1;
      }
      if (this.position.y > boxSize) {
        this.position.y = boxSize;
        this.velocity.y *= -1;
      } else if (this.position.y < -boxSize) {
        this.position.y = -boxSize;
        this.velocity.y *= -1;
      }
      if (this.position.z > boxSize) {
        this.position.z = boxSize;
        this.velocity.z *= -1;
      } else if (this.position.z < -boxSize) {
        this.position.z = -boxSize;
        this.velocity.z *= -1;
      }
    }

    if (boxShape === "sphere" && boxMode === "bounce") {
      // bounce off when the boid reaches the edge of the sphere of diameter boxSize
      const distanceToCenter = this.position.length();
      if (distanceToCenter > boxSize) {
        this.position.normalize().multiplyScalar(boxSize);
        this.velocity.reflect(this.position);
      }
    }

    if (boxShape === "sphere" && boxMode === "wrap") {
      // jump to the other side of the sphere when the boid reaches the edge of the sphere of diameter boxSize
      const distanceToCenter = this.position.length();
      if (distanceToCenter > boxSize) {
        this.position.normalize().multiplyScalar(-boxSize);
      }
    }

    this.alignWithMovement();
  }
}
