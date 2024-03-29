import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
// import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
// import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { settings } from "./config";

export class Stage {
  public scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private composer: EffectComposer;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    document.body.appendChild(this.renderer.domElement);
    this.refresh();
  }

  private set cameraDistance(distance: number) {
    this.camera.position.z = distance;
  }

  private rotateCamera() {
    this.camera.position.x =
      Math.sin(Date.now() / 10000) * settings.cameraDistance;
    this.camera.position.z =
      Math.cos(Date.now() / 10000) * settings.cameraDistance;
    this.camera.lookAt(0, 0, 0);
  }

  public refresh(): void {
    this.cameraDistance = settings.cameraDistance;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.scene.background = new THREE.Color(settings.backgroundColor);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Postprocessing
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      settings.bloom.strength,
      settings.bloom.radius,
      settings.bloom.threshold
    );
    this.composer.addPass(bloomPass);
    // const afterimagePass = new AfterimagePass();
    // this.composer.addPass(afterimagePass);
    // const dotscreenPass = new DotScreenPass();
    // this.composer.addPass(dotscreenPass);
  }

  public render(): void {
    this.rotateCamera();
    this.composer.render();
  }
}
