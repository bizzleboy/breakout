console.log("gay");

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height / 2;

let dx = 2;
let dy = -2;

var ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 12;
const brickOffsetTop = 10;
const brickOffsetLeft = 30;

let ballColor = "Black";
let score = 0;
let lives = 3;

let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, canvas.height - 10);
}
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(evt) {
  if (evt.key === "Right" || evt.key === "ArrowRight") {
    rightPressed = true;
  } else if (evt.key === "Left" || evt.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(evt) {
  if (evt.key === "Right" || evt.key === "ArrowRight") {
    rightPressed = false;
  } else if (evt.key === "Left" || evt.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(evt) {
  const relativeX = evt.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "Red";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          ballColor = getRandomColor();
          score++;
          if (score == brickColumnCount * brickRowCount) {
            alert("you win");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "45px Arial";
  ctx.fillStyle = ballColor;
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 75, canvas.height / 2);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  ctx.fillStyle = getRandomColor();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  x += dx;
  y += dy;
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX - 10 && x < paddleX + paddleWidth + 10) {
      dy = -dy * 1.1;
    } else {
      lives--;
      if (!lives) {
        alert("Game Over Nerd");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleHeight) / 2;
      }
    }
  }
  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }

  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }
  requestAnimationFrame(draw);
}

draw();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
