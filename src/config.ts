type Config = {
  separationFactor: number,
  alignmentFactor: number,
  cohesionFactor: number,
  separationRadius: number,
  alignmentRadius: number,
  cohesionRadius: number,
  numBoids: number,
  boxSize: number,
  boxMode: BoxMode,
  boxShape: BoxShape,
  maxVelicity: number,
  zDistance: number,
  backgroundColor: number,
}

type Mode = "a" | "s" | "d";
type BoxMode = "wrap" | "bounce";
type BoxShape = "sphere" | "cube";

class SettingsManager {
  private default: Config = {
    // behaviour factors
    separationFactor: 0.005,
    alignmentFactor: 0.002,
    cohesionFactor: 0.003,
    separationRadius: 0.1,
    alignmentRadius: 0.2,
    cohesionRadius: 0.2,
    maxVelicity: 0.01,
    // scene settings
    numBoids: 500,
    boxSize: 1,
    boxMode: "wrap",
    boxShape: "sphere",
    zDistance: 6,
    backgroundColor: 0x000000,
  };
  public currentSettings: Config;
  private currentMode: Mode | null = null;

  constructor () {
    this.currentSettings = { ...this.default };
  }

  public reset () {
    // reset config to default
    this.currentSettings.cohesionRadius = this.default.cohesionRadius;
    this.currentSettings.separationFactor = this.default.separationFactor;
    this.currentSettings.separationRadius = this.default.separationRadius;
    this.currentSettings.maxVelicity = this.default.maxVelicity;
  }

  public setBehaviourMode (mode: Mode) {
    this.reset();
    if (this.currentMode === mode) {
      this.currentMode = null;
      console.log(`Mode ${mode} unset`)
      return;
    }
    switch (mode) {
      case "a":
        this.behaviourModeA();
        break;
      case "s":
        this.behaviourModeS();
        break;
      case "d":
        this.behaviourModeD();
        break;
    }
    this.currentMode = mode;
    console.log(`Mode ${mode} set`)
  }

  private behaviourModeA () {
    // increase cohesion radius
    this.currentSettings.cohesionRadius = this.default.cohesionRadius * 10;
  }

  private behaviourModeS () {
    // increase separation factor
    this.currentSettings.alignmentFactor = this.default.alignmentFactor * 1.2;
    // increase separation radius
    this.currentSettings.separationRadius = this.default.separationRadius * 1.2;
    // Make boids slower
    this.currentSettings.maxVelicity = this.default.maxVelicity / 2;
  }

  private behaviourModeD () {
    // increase separation radius
    this.currentSettings.separationRadius = this.default.separationRadius * 2;
    // Make boids slower
    this.currentSettings.maxVelicity = this.default.maxVelicity * 2;
  }

  public switchBoxSize (size: "small" | "large") {
    const smallBoxSize = 1;
    const largeBoxSize = 4;
    if (size === "large") {
      this.currentSettings.boxSize = largeBoxSize;
    } else {
      this.currentSettings.boxSize = smallBoxSize;
    }
  }

  public setBoxMode (mode: BoxMode) {
    this.currentSettings.boxMode = mode;
  }

  public setBoxShape (shape: BoxShape) {
    this.currentSettings.boxShape = shape;
  }

  private changeCameraDistance (delta: number) {
    // no closer than 1
    if (this.currentSettings.zDistance + delta < 1) {
      return;
    }
    this.currentSettings.zDistance += delta;
  }

  public zoomIn () {
    this.changeCameraDistance(-1);
  }

  public zoomOut () {
    this.changeCameraDistance(1);
  }
}

export const settingsManager = new SettingsManager();
export const settings = settingsManager.currentSettings;