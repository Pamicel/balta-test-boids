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
flockA.settings.setBehaviourMode("d");
flockA.settings.setBoxMode("bounce");

const flockB: Flock = new Flock({
  name: "Secondary Flock",
  numBoids: settings.flock.numBoids,
  boidAppearance: {
    color: settings.boidColor,
    size: settings.flock.boidSize,
  },
  scene: stage.scene,
  behaviour: settings.flock.behaviour,
  spaceConstraints: {
    maxBoxSize: 4,
    minBoxSize: 1,
    boxSize: 4,
    boxMode: "wrap",
    boxShape: "sphere",
    pushFromCenter: {
      radius: 0,
      strength: 0.001,
    },
  },
});

// Animation function
function animate(): void {
  requestAnimationFrame(animate);
  flockA.update();
  flockB.update();
  stage.render();
}

let selectedFlock = flockA;
const chooseFlock = (choice: "1" | "2") => {
  if (choice === "1") {
    selectedFlock = flockA;
  } else if (choice === "2") {
    selectedFlock = flockB;
  }
  console.log(`Switched to flock "${selectedFlock.name}`);
};

const hideFlock = (flock: Flock) => {
  flock.removeBoids(flock.boids.length);
};

const showFlock = (flock: Flock) => {
  if (flock.boids.length === 0) {
    flock.addBoids(settings.flock.numBoids, stage.scene);
  }
};

// Keypress event listener
document.addEventListener("keydown", (event: KeyboardEvent) => {
  switch (event.key) {
    case "1":
    case "2":
      chooseFlock(event.key);
      break;
    case "ArrowUp":
      selectedFlock.settings.increaseCenterSize();
      break;
    case "ArrowDown":
      selectedFlock.settings.decreaseCenterSize();
      break;
    case "ArrowLeft":
      selectedFlock.settings.decreaseBoxSize();
      break;
    case "ArrowRight":
      selectedFlock.settings.increaseBoxSize();
      break;
    case "Backspace":
      hideFlock(selectedFlock);
      break;
    case "Enter":
      showFlock(selectedFlock);
      break;

    case "a":
    case "s":
    case "d":
      selectedFlock.settings.setBehaviourMode(event.key);
      break;

    case "w":
      selectedFlock.settings.swtichBoxMode();
      break;

    default:
      break;
  }
  // console.log(JSON.stringify(settings, null, 2));
  selectedFlock.settings.log();
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
  console.log(`Camera distance: ${settings.cameraDistance}`);
});

// Start the animation loop
animate();
