var bird = document.getElementById("bird");
var playButton = document.getElementById("play-button");
var restartButton = document.getElementById("restart-button");

var jumping = 0;
var counter = 0;
var gameInterval = null;
var pipeInterval = null;
var isGameRunning = false;
var pipes = [];
var pipeIntervalTime = isMobile() ? 2000 : 1000; // 2000ms for mobile, 1000ms for desktop
var score = 0;

// Start Game
function startGame() {
    playButton.style.display = "none";
    restartButton.style.display = "none";
    isGameRunning = true;
    counter = 0;
    score = 0;
    updateScore();
    bird.style.top = "50%";

    pipes = [];
    document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());

    gameInterval = setInterval(gameLoop, 10);
    pipeInterval = setInterval(createPipe, pipeIntervalTime); // New pipe every 2 seconds
}

// Restart Game
function restartGame() {
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
    startGame();
}

function createPipe() {
    const game = document.getElementById('game');

    // Create pipe container
    const pipe = document.createElement('div');
    pipe.classList.add('pipe');

    // Random heights
    const topHeight = Math.ceil(Math.random() * 20) + 10; // Top pipe: 10–40%
    const middleHeight = Math.ceil(Math.random() * 10) + 30; // Middle gap: 20–40%
    const bottomHeight = 100 - (topHeight + middleHeight); // Remaining height for bottom pipe

    // Create Top Pipe Image
    const pipeTop = document.createElement('img');
    pipeTop.src = 'images/steel-pipe-clipart-xl.png';
    pipeTop.classList.add('pipe-top');
    pipeTop.style.height = `${topHeight}%`;

    const pipeMiddle = document.createElement('div');
    pipeMiddle.classList.add('pipe-middle');
    pipeMiddle.style.height = `${middleHeight}%`;
    pipeMiddle.style.top = `${topHeight}%`;


    // Create Bottom Pipe Image
    const pipeBottom = document.createElement('img');
    pipeBottom.src = 'images/steel-pipe-clipart-xl.png';
    pipeBottom.classList.add('pipe-bottom');
    pipeBottom.style.height = `${bottomHeight}%`;
    pipeBottom.style.top = `${topHeight + middleHeight}%`;

    // Append pipes
    pipe.appendChild(pipeTop);
    pipe.appendChild(pipeMiddle);
    pipe.appendChild(pipeBottom);

    // Append pipe to game container
    game.appendChild(pipe);
    pipes.push(pipe);

    // Remove pipe after animation ends
    pipe.addEventListener('animationend', () => {
        pipe.remove();
        pipes.shift();
    });
}



// Main Game Loop
function gameLoop() {
    var birdRect = bird.getBoundingClientRect();

    // Apply Gravity
    var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    if (jumping == 0 && isGameRunning) {
        bird.style.top = (birdTop + 1) + "px";
    }

    // Collision Detection for Each Pipe
    pipes.forEach(pipe => {
        var pipeRect = pipe.getBoundingClientRect();
        var pipeTop = pipe.querySelector('.pipe-top').getBoundingClientRect();
        var pipeBottom = pipe.querySelector('.pipe-bottom').getBoundingClientRect();

        // Check if bird passed the pipe without colliding
        if (pipeRect.right < birdRect.left && !pipe.passed) {
            score++;
            pipe.passed = true; // Mark pipe as passed
            updateScore();
        }
        // Horizontal Collision
        var isCollidingHorizontally = birdRect.right > pipeRect.left && birdRect.left < pipeRect.right;

        // Vertical Collision
        var isCollidingWithTop = birdRect.top < pipeTop.bottom;
        var isCollidingWithBottom = birdRect.bottom > pipeBottom.top;

        // Game Over Condition
        if (isCollidingHorizontally && (isCollidingWithTop || isCollidingWithBottom)) {
            endGame();
        }
    });
}

// End Game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
    isGameRunning = false;
    document.querySelectorAll('.pipe').forEach(pipe => pipe.style.animationPlayState = 'paused');
    restartButton.style.display = "inline-block";
    const finalScore = document.getElementById('final-score');
    finalScore.textContent = `Your Score: ${score}`;
}

// Jump Function
function jump() {
    if (!isGameRunning) return;

    jumping = 1;
    let jumpCount = 0;
    let jumpSpeed = isMobile() ? 3 : 5; // 2 for mobile, 3 for desktop
    var jumpInterval = setInterval(function () {
        var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
        if ((birdTop > 6) && (jumpCount < 15)) {
            bird.style.top = (birdTop - jumpSpeed) + "px";
        }
        if (jumpCount > 20) {
            clearInterval(jumpInterval);
            jumping = 0;
            jumpCount = 0;
        }
        jumpCount++;
    }, 10);
}

function isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

function updateScore() {
    document.getElementById('final-score').textContent = `Score: ${score}`;
}
// Event Listeners
playButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {
        jump();
    }
};
