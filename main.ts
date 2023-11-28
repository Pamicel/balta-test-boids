import { Stage } from "./Stage";
import { settings, settingsManager } from "./config";
import { Flock } from "./Flock";

// Create the scene
const stage: Stage = new Stage();
// Create the flock
const flock: Flock = new Flock();

// Add boids to the flock
flock.addBoids(settings.numBoids, stage.scene);

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
      stage.zoomIn();
      break;
    case "ArrowDown":
      stage.zoomOut();
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

// Start the animation loop
animate();
