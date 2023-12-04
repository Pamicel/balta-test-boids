import * as THREE from "three";
import { settings } from "./config";

// Boid class
export class Boid {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  // private line: THREE.Line;
  private sphere: THREE.Mesh;
  private scene: THREE.Scene;

  constructor(x: number, y: number, z: number, scene: THREE.Scene) {
    this.velocity = new THREE.Vector3(x, y, z);

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

    // const boidGeometry = new THREE.CircleGeometry( 0.02, 6 );
    // sphere
    const boidGeometry = new THREE.SphereGeometry( 0.02, 6, 6 );
    boidGeometry.computeVertexNormals();
    const boidMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    this.sphere = new THREE.Mesh( boidGeometry, boidMaterial );

    // this.position = this.line.position;
    // scene.add(this.line);

    this.position = this.sphere.position;
    scene.add(this.sphere);

    this.scene = scene;
  }

  public remove(): void {
    // this.scene.remove(this.line);
    this.scene.remove(this.sphere);
  }

  // Update the boid's geometry to align with its heading
  private updateBoidGeometry(): void {
    // this.line.lookAt(this.position.clone().add(this.velocity));
    // this.circle.lookAt(this.position.clone().add(this.velocity));
    this.sphere.lookAt(this.position.clone().add(this.velocity));
  }

  // Add forces
  public applyForce(force: THREE.Vector3): void {
    this.velocity.add(force);
  }

  // Update the boid's position
  public update(): void {
    // limit velocity to 0.1
    if (this.velocity.length() > settings.maxVelicity) {
      this.velocity.normalize().multiplyScalar(settings.maxVelicity);
    }
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
