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
  console.log(event.key);
  switch (event.key) {
    case "ArrowUp":
      settings.numBoids += 10;
      flock.addBoids(10, stage.scene);
      break;
    case "ArrowDown":
      settings.numBoids -= 10;
      flock.removeBoids(10);
      break;
    case "ArrowLeft":
      settings.boxSize -= 1;
      break;
    case "ArrowRight":
      settings.boxSize += 1;
      break;

    case "a":
    case "s":
      settingsManager.setMode(event.key);
      break;
    default:
      break;
  }
  console.log(JSON.stringify(settings, null, 2));
});

// Start the animation loop
animate();
