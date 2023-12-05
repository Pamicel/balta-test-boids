import { BehaviourSettings, SpaceConstraintsSettings } from "../config";
import { Flock } from "./Flock";

type BoidAppearance = {
  color: number;
  size: number;
};
type BoxMode = "wrap" | "bounce";
type BoxShape = "sphere" | "cube";
type BehaviourMode = "a" | "s" | "d";

export class FlockSettings {
  private flock: Flock;
  public behaviour: BehaviourSettings;
  public boidAppearance: BoidAppearance;
  public spaceConstraints: SpaceConstraintsSettings;
  private defaultBehaviour: BehaviourSettings;
  private currentBehaviourMode: BehaviourMode | null = null;

  constructor({
    flock,
    behaviourSettings,
    boidAppearance,
    spaceConstraints,
  }: {
    flock: Flock;
    behaviourSettings: BehaviourSettings;
    boidAppearance: BoidAppearance;
    spaceConstraints: SpaceConstraintsSettings;
  }) {
    this.flock = flock;
    this.behaviour = { ...behaviourSettings };
    this.defaultBehaviour = { ...behaviourSettings };
    this.boidAppearance = { ...boidAppearance };
    this.spaceConstraints = { ...spaceConstraints };
  }

  public logBehaviour() {
    console.log(`behaviour:\n${JSON.stringify(this.behaviour, null, 2)}`);
  }

  public logBoidAppearance() {
    console.log(
      `boidAppearance:\n${JSON.stringify(this.boidAppearance, null, 2)}`
    );
  }

  public logSpaceConstraints() {
    console.log(
      `spaceConstraints:\n${JSON.stringify(this.spaceConstraints, null, 2)}`
    );
  }

  public log() {
    console.group(`Flock name: "${this.flock.name}"`);
    this.logBehaviour();
    this.logBoidAppearance();
    this.logSpaceConstraints();
    console.groupEnd();
  }

  // Space constraints

  public increaseCenterSize(): void {
    if (this.spaceConstraints.pushFromCenter) {
      this.spaceConstraints.pushFromCenter.radius += 0.1;
    }
  }

  public decreaseCenterSize(): void {
    if (this.spaceConstraints.pushFromCenter) {
      this.spaceConstraints.pushFromCenter.radius -= 0.1;
    }
  }

  public switchBoxSize(size: "small" | "large") {
    const smallBoxSize = 1;
    const largeBoxSize = 4;
    if (size === "large") {
      this.spaceConstraints.boxSize = largeBoxSize;
    } else {
      this.spaceConstraints.boxSize = smallBoxSize;
    }
  }

  public setBoxMode(mode: BoxMode): void {
    this.spaceConstraints.boxMode = mode;
  }

  public swtichBoxMode(): void {
    if (this.spaceConstraints.boxMode === "bounce") {
      this.spaceConstraints.boxMode = "wrap";
    } else {
      this.spaceConstraints.boxMode = "bounce";
    }
  }

  public setBoxShape(shape: BoxShape): void {
    this.spaceConstraints.boxShape = shape;
  }

  public switchBoxShape(): void {
    if (this.spaceConstraints.boxShape === "cube") {
      this.spaceConstraints.boxShape = "sphere";
    } else {
      this.spaceConstraints.boxShape = "cube";
    }
  }

  // Behaviour

  public resetBehaviour() {
    this.behaviour = { ...this.defaultBehaviour };
  }

  public setBehaviourMode(mode: BehaviourMode) {
    this.resetBehaviour();
    if (this.currentBehaviourMode === mode) {
      this.currentBehaviourMode = null;
      console.log(`Mode ${mode} unset\t${this.flock.name} `);
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
    this.currentBehaviourMode = mode;
    console.log(`Mode ${mode} set\t${this.flock.name}`);
  }

  private behaviourModeA() {
    // increase cohesion radius
    this.behaviour.cohesionRadius = this.defaultBehaviour.cohesionRadius * 10;
  }

  private behaviourModeS() {
    // increase separation factor
    this.behaviour.alignmentFactor =
      this.defaultBehaviour.alignmentFactor * 1.2;
    // increase separation radius
    this.behaviour.separationRadius =
      this.defaultBehaviour.separationRadius * 1.2;
    // Make boids slower
    this.behaviour.maxVelocity = this.defaultBehaviour.maxVelocity / 2;
  }

  private behaviourModeD() {
    // increase separation radius
    this.behaviour.separationRadius =
      this.defaultBehaviour.separationRadius * 2;
    // Make boids slower
    this.behaviour.maxVelocity = this.defaultBehaviour.maxVelocity * 2;
  }

  // Boid appearance

  private get boidSize() {
    return this.boidAppearance.size;
  }

  private set boidSize(size: number) {
    if (size < 0.005) {
      return;
    }
    this.boidAppearance.size = size;
  }

  public increaseBoidSize() {
    this.boidSize += 0.002;
  }

  public decreaseBoidSize() {
    this.boidSize -= 0.002;
  }
}
