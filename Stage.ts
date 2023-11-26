import * as THREE from "three";

export class Stage {
  public scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Set the background color to black
    this.scene.background = new THREE.Color(0);

    // Set camera position
    this.camera.position.z = 5;
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
