import { Stage } from "./Stage";
import { settings, settingsManager } from "./config";
import { Flock } from "./flock/Flock";

// Create the scene
const stage: Stage = new Stage();
// Create the flock
const flockA: Flock = new Flock({
  name: "Main Flock",
  numBoids: settings.flock.numBoids,
  boidAppearance: {
    color: settings.boidColor,
    size: settings.flock.boidSize,
  },
  scene: stage.scene,
  behaviour: settings.flock.behaviour,
  spaceConstraints: settings.flock.spaceConstraints,
});

// Animation function
function animate(): void {
  requestAnimationFrame(animate);
  flockA.update();
  stage.render();
}

// Keypress event listener
document.addEventListener("keydown", (event: KeyboardEvent) => {
  const flock = flockA;
  switch (event.key) {
    case "ArrowUp":
      flock.settings.increaseCenterSize();
      break;
    case "ArrowDown":
      flock.settings.decreaseCenterSize();
      break;
    case "ArrowLeft":
      flock.settings.switchBoxSize("small");
      break;
    case "ArrowRight":
      flock.settings.switchBoxSize("large");
      break;

    case "a":
    case "s":
    case "d":
      flock.settings.setBehaviourMode(event.key);
      break;

    case "w":
      flock.settings.swtichBoxMode();
      break;
    // case "q":
    //   flock.settings.switchBoxShape();
    //   break;

    default:
      break;
  }
  // console.log(JSON.stringify(settings, null, 2));
  flock.settings.log();
});

// window resize event listener
window.addEventListener("resize", () => {
  stage.refresh();
});

// Mouse event listener: if scroll zoom
window.addEventListener("wheel", (event: WheelEvent) => {
  if (event.deltaY < 0) {
    settingsManager.zoomIn();
  } else {
    settingsManager.zoomOut();
  }
  stage.refresh();
});

// Start the animation loop
animate();
