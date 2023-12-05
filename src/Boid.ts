import * as THREE from "three";
import { settings } from "./config";

// Boid class
export class Boid {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  // private line: THREE.Line;
  private particle: THREE.Mesh;
  private scene: THREE.Scene;

  constructor(x: number, y: number, z: number, scene: THREE.Scene) {
    // create random velocity
    this.velocity =  new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    this.scene = scene;
    this.createParticle(new THREE.Vector3(x, y, z));
  }

  private createParticle(position: THREE.Vector3): void {
    // // Create a custom boid geometry
    // const boidGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    // const vertices: Float32Array = new Float32Array([
    //   0, 0, 0,
    //   0, 0, -0.05, // Vertex 2 (tip of the segment)
    // ]);
    // boidGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // // Create a white line material
    // const boidMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    // this.line = new THREE.Line(boidGeometry, boidMaterial);

    const boidGeometry = new THREE.CircleGeometry(settings.boidSize, 6);
    // const boidGeometry = new THREE.SphereGeometry(settings.boidSize, 6, 6);
    // boidGeometry.computeVertexNormals();
    const boidMaterial = new THREE.MeshBasicMaterial( { color: settings.boidColor, side: THREE.DoubleSide } );
    this.particle = new THREE.Mesh( boidGeometry, boidMaterial );
    this.particle.position.copy(position);
    // Set this.position to be a reference to the particle's position
    this.position = this.particle.position;
    // Add the particle to the scene
    this.scene.add(this.particle);
  }

  public refreshAppearance(): void {
    const position = this.position.clone();
    if (this.particle) {
      this.scene.remove(this.particle);
    }
    this.createParticle(position);
  }

  public remove(): void {
    // this.scene.remove(this.line);
    this.scene.remove(this.particle);
  }

  // Update the boid's geometry to align with its heading
  private updateBoidGeometry(): void {
    // this.line.lookAt(this.position.clone().add(this.velocity));
    // this.circle.lookAt(this.position.clone().add(this.velocity));
    this.particle.lookAt(this.position.clone().add(this.velocity));
  }

  // Add forces
  public applyForce(force: THREE.Vector3): void {
    this.velocity.add(force);
  }

  private limitVelocity(): void {
    // limit velocity to settings.maxVelocity
    if (this.velocity.length() > settings.behaviour.maxVelicity) {
      this.velocity.normalize().multiplyScalar(settings.behaviour.maxVelicity);
    }
  }

  // Update the boid's position
  public update(): void {
    if (settings.pushFromCenter) {
      const distanceToCenter = this.position.length();
      if (distanceToCenter < settings.pushFromCenter.radius) {
        const pushForce = this.position.clone().normalize().multiplyScalar(settings.pushFromCenter.strength);
        this.applyForce(pushForce);
      }
    }

    this.limitVelocity();
    this.position.add(this.velocity);

    const { boxSize } = settings;
    if (settings.boxShape === "cube" && settings.boxMode === "wrap") {
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

    if (settings.boxShape === "cube" && settings.boxMode === "bounce") {
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

    if (settings.boxShape === "sphere" && settings.boxMode === "bounce") {
      // bounce off when the boid reaches the edge of the sphere of diameter boxSize
      const distanceToCenter = this.position.length();
      if (distanceToCenter > boxSize) {
        this.position.normalize().multiplyScalar(boxSize);
        this.velocity.reflect(this.position);
      }
    }

    if (settings.boxShape === "sphere" && settings.boxMode === "wrap") {
      // jump to the other side of the sphere when the boid reaches the edge of the sphere of diameter boxSize
      const distanceToCenter = this.position.length();
      if (distanceToCenter > boxSize) {
        this.position.normalize().multiplyScalar(-boxSize);
      }
    }

    this.updateBoidGeometry();
  }
}
