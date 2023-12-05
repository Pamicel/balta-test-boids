type BehaviourSettings = {
  separationFactor: number,
  alignmentFactor: number,
  cohesionFactor: number,
  separationRadius: number,
  alignmentRadius: number,
  cohesionRadius: number,
  maxVelicity: number,
}

type Config = {
  behaviour: BehaviourSettings,
  // scene settings
  numBoids: number,
  boxSize: number,
  boxMode: BoxMode,
  boxShape: BoxShape,
  zDistance: number,
  backgroundColor: number,
  boidColor: number,
  bloom: {
    strength: number,
    radius: number,
    threshold: number,
  },
  pushFromCenter: PushFromCenter | null,
  boidSize: number,
}

type Mode = "a" | "s" | "d";
type BoxMode = "wrap" | "bounce";
type BoxShape = "sphere" | "cube";
type PushFromCenter = {
  radius: number,
  strength: number,
}

class SettingsManager {
  private default: Config = {
    behaviour: {
      // behaviour factors
      separationFactor: 0.005,
      alignmentFactor: 0.002,
      cohesionFactor: 0.003,
      separationRadius: 0.1,
      alignmentRadius: 0.2,
      cohesionRadius: 0.2,
      maxVelicity: 0.01,
    },
    // scene settings
    numBoids: 500,
    boxSize: 1,
    boxMode: "wrap",
    boxShape: "sphere",
    zDistance: 6,
    backgroundColor: 0x000000,
    boidColor: 0xffffff,
    bloom: {
      strength: 0.5,
      radius: 0,
      threshold: 0,
    },
    boidSize: 0.06,
    pushFromCenter: {
      radius: 0.5,
      strength: 0.001,
    },
  };
  public currentSettings: Config;
  private currentMode: Mode | null = null;

  constructor () {
    this.currentSettings = { ...this.default };
  }

  public resetBehaviour () {
    this.currentSettings.behaviour = this.default.behaviour;
  }

  public setBehaviourMode (mode: Mode) {
    this.resetBehaviour();
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
    this.currentSettings.behaviour.cohesionRadius = this.default.behaviour.cohesionRadius * 10;
  }

  private behaviourModeS () {
    // increase separation factor
    this.currentSettings.behaviour.alignmentFactor = this.default.behaviour.alignmentFactor * 1.2;
    // increase separation radius
    this.currentSettings.behaviour.separationRadius = this.default.behaviour.separationRadius * 1.2;
    // Make boids slower
    this.currentSettings.behaviour.maxVelicity = this.default.behaviour.maxVelicity / 2;
  }

  private behaviourModeD () {
    // increase separation radius
    this.currentSettings.behaviour.separationRadius = this.default.behaviour.separationRadius * 2;
    // Make boids slower
    this.currentSettings.behaviour.maxVelicity = this.default.behaviour.maxVelicity * 2;
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

  private get boidSize () {
    return this.currentSettings.boidSize;
  }

  private set boidSize (size: number) {
    if (size < 0.005) {
      return;
    }
    this.currentSettings.boidSize = size;
  }

  public increaseBoidSize () {
    this.boidSize += 0.002;
  }

  public decreaseBoidSize () {
    this.boidSize -= 0.002;
  }

  public increaseCenterSize () {
    if (!this.currentSettings.pushFromCenter) {
      return;
    }
    this.currentSettings.pushFromCenter.radius += 0.1;
  }

  public decreaseCenterSize () {
    if (!this.currentSettings.pushFromCenter) {
      return;
    }
    this.currentSettings.pushFromCenter.radius -= 0.1;
  }
}

export const settingsManager = new SettingsManager();
export const settings = settingsManager.currentSettings;