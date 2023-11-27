type Config = {
  separationFactor: number,
  alignmentFactor: number,
  cohesionFactor: number,
  separationRadius: number,
  alignmentRadius: number,
  cohesionRadius: number,
  numBoids: number,
  boxSize: number,
  maxVelicity: number,
}

type Mode = "a" | "s";

class SettingsManager {
  private default: Config = {
    separationFactor: 0.005,
    alignmentFactor: 0.002,
    cohesionFactor: 0.003,
    separationRadius: 0.1,
    alignmentRadius: 0.2,
    cohesionRadius: 0.2,
    numBoids: 300,
    boxSize: 3,
    maxVelicity: 0.01,
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

  public setMode (mode: Mode) {
    this.reset();
    if (this.currentMode === mode) {
      this.currentMode = null;
      return;
    }
    switch (mode) {
      case "a":
        this.modeA();
        break;
      case "s":
        this.modeS();
        break;
    }
    this.currentMode = mode;
  }

  private modeA () {
    // increase cohesion radius
    this.currentSettings.cohesionRadius = this.default.cohesionRadius * 10;
  }

  public modeS () {
    // increase separation factor
    this.currentSettings.alignmentFactor = this.default.alignmentFactor * 1.2;
    // increase separation radius
    this.currentSettings.separationRadius = this.default.separationRadius * 1.2;
    // Make boids slower
    this.currentSettings.maxVelicity = this.default.maxVelicity / 2;
  }
}

export const settingsManager = new SettingsManager();
export const settings = settingsManager.currentSettings;