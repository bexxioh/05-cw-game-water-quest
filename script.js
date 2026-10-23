
const GOAL_CANS = 20;
const GAME_LENGTH = 30;

let currentCans = 0;
let timeLeft = GAME_LENGTH;
let gameActive = false;
let spawnInterval;
let timerInterval;

const winningMessages = [
  "You did it! Every drop counts!",
  "Amazing! You reached 20 cans!",
  "You're a Water Quest champion!",
  "You made a splash! Congratulations!"
];

const losingMessages = [
  "So close! Give it another try!",
  "Every drop counts. Keep going!",
  "Ready for another round?",
  "Don't give up! You can do it!"
];

const grid = document.querySelector(".game-grid");
const scoreDisplay = document.getElementById("current-cans");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("achievements");
const startButton = document.getElementById("start-game");

// Create the nine game cells
function createGrid() {
  grid.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    grid.appendChild(cell);
  }
}

// Show a can in one random cell
function spawnWaterCan() {
  if (!gameActive) {
    return;
  }

  const cells = document.querySelectorAll(".grid-cell");

  // Remove the previous can
  cells.forEach(function(cell) {
    cell.innerHTML = "";
  });

  const randomIndex = Math.floor(Math.random() * cells.length);
  const randomCell = cells[randomIndex];

  const wrapper = document.createElement("div");
  wrapper.className = "water-can-wrapper";

  const can = document.createElement("div");
  can.className = "water-can";

  wrapper.appendChild(can);
  randomCell.appendChild(wrapper);
}

// Start or restart the game
function startGame() {
  if (gameActive) {
    return;
  }

  // Clear old intervals in case of a restart
  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  currentCans = 0;
  timeLeft = GAME_LENGTH;
  gameActive = true;

  scoreDisplay.textContent = currentCans;
  timerDisplay.textContent = timeLeft;
  messageDisplay.textContent = "";

  startButton.textContent = "Game in Progress";
  startButton.disabled = true;

  createGrid();
  spawnWaterCan();

  // Change the can every second
  spawnInterval = setInterval(function() {
    spawnWaterCan();
  }, 1000);

  // Count down once every second
  timerInterval = setInterval(function() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Finish the game and show a random result message
function endGame() {
  gameActive = false;

  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  // Remove the last can
  const cells = document.querySelectorAll(".grid-cell");

  cells.forEach(function(cell) {
    cell.innerHTML = "";
  });

  let messages;

  if (currentCans >= GOAL_CANS) {
    messages = winningMessages;
  } else {
    messages = losingMessages;
  }

  const randomIndex = Math.floor(Math.random() * messages.length);
  messageDisplay.textContent = messages[randomIndex];

  startButton.textContent = "Play Again";
  startButton.disabled = false;
}

// Handle can clicks
grid.addEventListener("click", function(event) {
  if (!gameActive) {
    return;
  }

  const clickedCan = event.target.closest(".water-can-wrapper");

  if (clickedCan) {
    currentCans++;
    scoreDisplay.textContent = currentCans;

    // Immediately show the next can
    spawnWaterCan();
  }
});

// Start button listener
startButton.addEventListener("click", startGame);

// Build the grid when the page first loads
createGrid();