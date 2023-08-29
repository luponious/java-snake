
/*esa linea deberia estar en un archivo separado, ya lo sé pero bueno... no queria hacerlo, solamente porque seria mucho laburo por muy poco asi que por hora dejo ese comentario simpatico aca... si seguis leyendo es porque realmente queres saber que es lo que no deberia estar aca, asi que buen, ya casi termino de enrollar esa linea, te juro que no hay nada de mas aca, enserio... bueno... no se que mas decir...*/const potato = 'Wt8NDxpRa8HkZ7yLb1yHs0lyS2r6VbMhCt1SBmmz2_w'; const collectionId = 's2-ZMpVRK9w';
const updateBackgroundImage = (imageUrl) => {
  document.body.style.backgroundImage = `url(${imageUrl})`;
};//config para img random del background hecho con Unsplash
const fetchRandomImage = async () => {
  try {
    const response = await fetch(`https://api.unsplash.com/collections/${collectionId}/photos?client_id=${potato}`);
    const data = await response.json();

    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomImage = data[randomIndex];
      updateBackgroundImage(randomImage.urls.full);
      const backgroundContainer = document.querySelector('.background-container');
      backgroundContainer.style.backgroundImage = `url(${randomImage.urls.full})`;
    }
  } catch (error) {
    console.error('Error fetching image:', error);
  }
};


const startBtn = document.querySelector("#startBtn");
let gameStarted = false;
const startGame = () => {
  if (!gameStarted) {
    gameStarted = true;
    startBtn.style.display = "none";
    const playBoard = document.querySelector(".play-board");
    const scoreElement = document.querySelector(".score");
    const highScoreElement = document.querySelector(".high-score");
    const controls = document.querySelectorAll(".controls i");
    let gameOver = false;
    let foodX, foodY;
    let snakeX = 5,
      snakeY = 5;
    let velocityX = 0,
      velocityY = 0;
    let snakeBody = [];
    let setIntervalId;
    let score = 0;
    let queuedDirection = null;
    let highScore = localStorage.getItem("high-score") || 0; // High score en storage local
    highScoreElement.innerText = `High Score: ${highScore}`;
    let snakeSpeed = 200; //velociad inicial en milisec
    const speedIncreaseThreshold = 2; // a cada 2 comidas
    const speedIncreaseAmount = 15; // incrementa velocidad en 15 milisec
    const updateFoodPosition = () => {
      foodX = Math.floor(Math.random() * 30) + 1;
      foodY = Math.floor(Math.random() * 30) + 1;
    };
    const controladorGameOver = () => {
      clearInterval(setIntervalId);
      const gameOverModal = document.getElementById("gameOverModal");
      const gameOverContent = gameOverModal.querySelector(".content");
      const gameOverScore = gameOverContent.querySelector("#gameOverScore");
      gameOverScore.textContent = `${score}`;
      gameOverModal.classList.add("show");
    };
    const playAgainBtn = document.querySelector("#playAgainBtn");
    playAgainBtn.addEventListener("click", () => {
      const gameOverModal = document.querySelector("#gameOverModal");
      gameOverModal.classList.remove("show");
      score = 0;
      snakeSpeed = 100; // Reset speed
      clearInterval(setIntervalId);
      setIntervalId = setInterval(initGame, snakeSpeed);
      location.reload();
    });
    const changeDirection = (e) => {
      if (e.key === "ArrowUp" && velocityY != 1) {
        queuedDirection = { x: 0, y: -1 };
      } else if (e.key === "ArrowDown" && velocityY != -1) {
        queuedDirection = { x: 0, y: 1 };
      } else if (e.key === "ArrowLeft" && velocityX != 1) {
        queuedDirection = { x: -1, y: 0 };
      } else if (e.key === "ArrowRight" && velocityX != -1) {
        queuedDirection = { x: 1, y: 0 };
      }
    };
    controls.forEach((button) =>
      button.addEventListener("click", () =>
        changeDirection({ key: button.dataset.key })
      )
    );
    const initGame = () => {
      if (gameOver) return controladorGameOver();
      let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
      if (queuedDirection) {
        velocityX = queuedDirection.x;
        velocityY = queuedDirection.y;
        queuedDirection = null;
      }
      if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        // incremento de velocidad
        if (score % speedIncreaseThreshold === 0) {
          snakeSpeed -= speedIncreaseAmount;
          clearInterval(setIntervalId);
          setIntervalId = setInterval(initGame, snakeSpeed);
        }
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
    setIntervalId = setInterval(initGame, snakeSpeed);
    document.addEventListener("keyup", changeDirection);
  }
};
fetchRandomImage();
startBtn.addEventListener("click", startGame);