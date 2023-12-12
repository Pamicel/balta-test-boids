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
  maxBoxSize: number;
  minBoxSize: number;
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

type BoxMode = "wrap" | "bounce";
type BoxShape = "sphere" | "cube";
type PushFromCenter = {
  radius: number;
  strength: number;
};

class SettingsManager {
  private default: Config = {
    // global scene settings
    cameraDistance: 12,
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
        maxBoxSize: 4,
        minBoxSize: 1,
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

  constructor() {
    this.currentSettings = { ...this.default };
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
}

export const settingsManager = new SettingsManager();
export const settings = settingsManager.currentSettings;
