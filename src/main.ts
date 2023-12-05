import { Stage } from "./Stage";
import { settings, settingsManager } from "./config";
import { Flock } from "./flock/Flock";

// Create the scene
const stage: Stage = new Stage();
// Create the flock
const flock: Flock = new Flock({
  settings: settingsManager.currentSettings.flock,
  scene: stage.scene,
});

// Animation function
function animate(): void {
  requestAnimationFrame(animate);
  flock.update();
  stage.render();
}

// Keypress event listener
document.addEventListener("keydown", (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowUp":
      settingsManager.increaseCenterSize();
      break;
    case "ArrowDown":
      settingsManager.decreaseCenterSize();
      break;
    case "ArrowLeft":
      settingsManager.switchBoxSize("small");
      break;
    case "ArrowRight":
      settingsManager.switchBoxSize("large");
      break;

    case "a":
    case "s":
    case "d":
      settingsManager.setBehaviourMode(event.key);
      break;

    case "1":
      settingsManager.setBoxMode("wrap");
      break;
    case "2":
      settingsManager.setBoxMode("bounce");
      break;

    case "q":
      settingsManager.setBoxShape("cube");
      break;
    case "w":
      settingsManager.setBoxShape("sphere");
      break;

    default:
      break;
  }
  console.log(JSON.stringify(settings, null, 2));
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
