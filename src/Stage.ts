import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
// import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
// import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
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
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Postprocessing
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0;
    bloomPass.strength = .5;
    bloomPass.radius = 0;
    this.composer.addPass(bloomPass);
    // const afterimagePass = new AfterimagePass();
    // this.composer.addPass(afterimagePass);

    // const dotscreenPass = new DotScreenPass();
    // this.composer.addPass(dotscreenPass);

    this.refresh();
  }

  private set cameraDistance(distance: number) {
    this.camera.position.z = distance;
  }

  public refresh(): void {
    this.cameraDistance = settings.zDistance;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.scene.background = new THREE.Color(settings.backgroundColor);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public render(): void {
    this.composer.render();
  }
}
