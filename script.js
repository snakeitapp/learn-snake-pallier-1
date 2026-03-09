const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const gameOverMessage = document.getElementById("gameOverMessage");

// format téléphone à l'intérieur du grand cadre
canvas.width = 320;
canvas.height = 640;

const gridSize = 20;
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let snake;
let direction;
let food;

let gameLoop;
let gameRunning = false;

function initGame() {
    snake = [
        { x: 8, y: 16 }
    ];

    direction = { x: 1, y: 0 };

    food = {
        x: 12,
        y: 20
    };

    draw();
}

function startGame() {
    startButton.style.display = "none";
    gameOverMessage.classList.add("hidden");

    clearInterval(gameLoop);

    initGame();

    gameRunning = true;
    gameLoop = setInterval(update, 120);
}

function restartGame() {
    gameOverMessage.classList.add("hidden");
    startGame();
}

function update() {
    if (!gameRunning) return;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // passage d'un côté à l'autre
    if (head.x < 0) head.x = tileCountX - 1;
    if (head.x >= tileCountX) head.x = 0;
    if (head.y < 0) head.y = tileCountY - 1;
    if (head.y >= tileCountY) head.y = 0;

    // collision avec lui-même
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // nourriture
    ctx.fillStyle = "#DAA520";
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize,
        gridSize
    );

    // serpent
    ctx.fillStyle = "#B0E0E6";
    for (let part of snake) {
        ctx.fillRect(
            part.x * gridSize,
            part.y * gridSize,
            gridSize,
            gridSize
        );
    }
}

function placeFood() {
    let newFood;
    let onSnake;

    do {
        newFood = {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY)
        };

        onSnake = snake.some(part => part.x === newFood.x && part.y === newFood.y);
    } while (onSnake);

    food = newFood;
}

function endGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    gameOverMessage.classList.remove("hidden");
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction.y !== 1) {
        direction = { x: 0, y: -1 };
    } else if (e.key === "ArrowDown" && direction.y !== -1) {
        direction = { x: 0, y: 1 };
    } else if (e.key === "ArrowLeft" && direction.x !== 1) {
        direction = { x: -1, y: 0 };
    } else if (e.key === "ArrowRight" && direction.x !== -1) {
        direction = { x: 1, y: 0 };
    }
});

startButton.addEventListener("click", startGame);
