const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// High score en storage local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
// posicionador de comida (random integer "29"+1)
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const controladorGameOver = () => {
  clearInterval(setIntervalId);

  // controles de modal
  const gameOverModal = document.getElementById("gameOverModal");
  const gameOverContent = gameOverModal.querySelector(".content");
  const gameOverScore = gameOverContent.querySelector("#gameOverScore");

  // Actualizacion del score en el modal
  gameOverScore.textContent = `${score}`;

  gameOverModal.classList.add("show");
};

  //btn Jugar novamente y reset de la pagina
const playAgainBtn = document.querySelector("#playAgainBtn");
playAgainBtn.addEventListener("click", () => {
    const gameOverModal = document.querySelector("#gameOverModal");
  gameOverModal.classList.remove("show");
  score = 0;
  location.reload();
});


const changeDirection = (e) => {
  // controlador de dire· y velocidad
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// transform· de teclas valor para objecto
controls.forEach((button) =>
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  )
);

const initGame = () => {
  if (gameOver) return controladorGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // chequeando la si se "toca" la comida
  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodY, foodX]); // push de la comida para el array del cuerpo
    score++; // incrementando score en +1
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }
  // actualizando la posicion de la cabeza
  snakeX += velocityX;
  snakeY += velocityY;

  // "moviendo" valores del cuerpo en 1
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  // chequear si se tocó una pared
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    return (gameOver = true);
  }

  for (let i = 0; i < snakeBody.length; i++) {
    // +1 div para el cuerpo
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // chequeaar golpe en el cuerpo
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);