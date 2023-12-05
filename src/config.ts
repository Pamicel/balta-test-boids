type FlockSettings = {
  boidSize: number;
  numBoids: number;
  behaviour: BehaviourSettings;
  spaceConstraints: SpaceConstraintsSettings;
};

export type BehaviourSettings = {
  separationFactor: number;
  alignmentFactor: number;
  cohesionFactor: number;
  separationRadius: number;
  alignmentRadius: number;
  cohesionRadius: number;
  maxVelocity: number;
};

export type SpaceConstraintsSettings = {
  boxSize: number;
  boxMode: BoxMode;
  boxShape: BoxShape;
  pushFromCenter: PushFromCenter | null;
};

type Config = {
  // global scene settings
  cameraDistance: number;
  backgroundColor: number;
  boidColor: number;
  bloom: {
    strength: number;
    radius: number;
    threshold: number;
  };
  flock: FlockSettings;
};

type Mode = "a" | "s" | "d";
type BoxMode = "wrap" | "bounce";
type BoxShape = "sphere" | "cube";
type PushFromCenter = {
  radius: number;
  strength: number;
};

class SettingsManager {
  private default: Config = {
    // global scene settings
    cameraDistance: 6,
    backgroundColor: 0x000000,
    boidColor: 0xffffff,
    bloom: {
      strength: 0.5,
      radius: 0,
      threshold: 0,
    },

    // flock settings
    flock: {
      numBoids: 500,
      boidSize: 0.06,
      // behaviour settings
      behaviour: {
        separationFactor: 0.005,
        alignmentFactor: 0.002,
        cohesionFactor: 0.003,
        separationRadius: 0.1,
        alignmentRadius: 0.2,
        cohesionRadius: 0.2,
        maxVelocity: 0.01,
      },
      // space constraints settings
      spaceConstraints: {
        boxSize: 1,
        boxMode: "wrap",
        boxShape: "sphere",
        pushFromCenter: {
          radius: 0.5,
          strength: 0.001,
        },
      },
    },
  };
  public currentSettings: Config;
  private currentMode: Mode | null = null;

  constructor() {
    this.currentSettings = { ...this.default };
  }

  public resetBehaviour() {
    this.currentSettings.flock.behaviour = this.default.flock.behaviour;
  }

  public setBehaviourMode(mode: Mode) {
    this.resetBehaviour();
    if (this.currentMode === mode) {
      this.currentMode = null;
      console.log(`Mode ${mode} unset`);
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
    console.log(`Mode ${mode} set`);
  }

  private behaviourModeA() {
    // increase cohesion radius
    this.currentSettings.flock.behaviour.cohesionRadius =
      this.default.flock.behaviour.cohesionRadius * 10;
  }

  private behaviourModeS() {
    // increase separation factor
    this.currentSettings.flock.behaviour.alignmentFactor =
      this.default.flock.behaviour.alignmentFactor * 1.2;
    // increase separation radius
    this.currentSettings.flock.behaviour.separationRadius =
      this.default.flock.behaviour.separationRadius * 1.2;
    // Make boids slower
    this.currentSettings.flock.behaviour.maxVelocity =
      this.default.flock.behaviour.maxVelocity / 2;
  }

  private behaviourModeD() {
    // increase separation radius
    this.currentSettings.flock.behaviour.separationRadius =
      this.default.flock.behaviour.separationRadius * 2;
    // Make boids slower
    this.currentSettings.flock.behaviour.maxVelocity =
      this.default.flock.behaviour.maxVelocity * 2;
  }

  public switchBoxSize(size: "small" | "large") {
    const smallBoxSize = 1;
    const largeBoxSize = 4;
    if (size === "large") {
      this.currentSettings.flock.spaceConstraints.boxSize = largeBoxSize;
    } else {
      this.currentSettings.flock.spaceConstraints.boxSize = smallBoxSize;
    }
  }

  public setBoxMode(mode: BoxMode) {
    this.currentSettings.flock.spaceConstraints.boxMode = mode;
  }

  public setBoxShape(shape: BoxShape) {
    this.currentSettings.flock.spaceConstraints.boxShape = shape;
  }

  private changeCameraDistance(delta: number) {
    // no closer than 1
    if (this.currentSettings.cameraDistance + delta < 1) {
      return;
    }
    this.currentSettings.cameraDistance += delta;
  }

  public zoomIn() {
    this.changeCameraDistance(-1);
  }

  public zoomOut() {
    this.changeCameraDistance(1);
  }

  private get boidSize() {
    return this.currentSettings.flock.boidSize;
  }

  private set boidSize(size: number) {
    if (size < 0.005) {
      return;
    }
    this.currentSettings.flock.boidSize = size;
  }

  public increaseBoidSize() {
    this.boidSize += 0.002;
  }

  public decreaseBoidSize() {
    this.boidSize -= 0.002;
  }

  public increaseCenterSize() {
    if (!this.currentSettings.flock.spaceConstraints.pushFromCenter) {
      return;
    }
    this.currentSettings.flock.spaceConstraints.pushFromCenter.radius += 0.1;
  }

  public decreaseCenterSize() {
    if (!this.currentSettings.flock.spaceConstraints.pushFromCenter) {
      return;
    }
    this.currentSettings.flock.spaceConstraints.pushFromCenter.radius -= 0.1;
  }
}

export const settingsManager = new SettingsManager();
export const settings = settingsManager.currentSettings;
