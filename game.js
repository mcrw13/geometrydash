const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");

let velocity = 0;
let gravity = 0.6;
let isJumping = false;
let score = 0;
let gameRunning = true;

function jump(){
    if(!isJumping){
        velocity = 12;
        isJumping = true;
    }
}

document.addEventListener("keydown", e=>{
    if(e.code === "Space"){
        if(!gameRunning){
            restartGame();
        }else{
            jump();
        }
    }
});

function gameLoop(){

    if(!gameRunning) return;

    velocity -= gravity;

    let bottom = parseFloat(window.getComputedStyle(player).bottom);

    bottom += velocity;

    if(bottom <= 0){
        bottom = 0;
        velocity = 0;
        isJumping = false;
    }

    player.style.bottom = bottom + "px";

    checkCollision();

    requestAnimationFrame(gameLoop);
}

function spawnObstacle(){

    if(!gameRunning) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");

    obstacle.style.left = "800px";

    game.appendChild(obstacle);

    let obstaclePos = 800;

    const move = setInterval(()=>{

        if(!gameRunning){
            clearInterval(move);
            return;
        }

        obstaclePos -= 5;
        obstacle.style.left = obstaclePos + "px";

        if(obstaclePos < -30){
            obstacle.remove();
            clearInterval(move);
            score++;
            scoreText.innerText = "Score: " + score;
        }

    },20);

    setTimeout(spawnObstacle,1500 + Math.random()*1000);
}

function checkCollision(){

    const obstacles = document.querySelectorAll(".obstacle");

    obstacles.forEach(obstacle=>{

        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if(
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.bottom > obstacleRect.top
        ){
            endGame();
        }

    });
}

function endGame(){
    gameRunning = false;
    gameOverText.style.display = "block";
}

function restartGame(){

    document.querySelectorAll(".obstacle").forEach(o=>o.remove());

    score = 0;
    scoreText.innerText = "Score: 0";

    player.style.bottom = "0px";

    gameRunning = true;
    gameOverText.style.display = "none";

    spawnObstacle();
    gameLoop();
}

spawnObstacle();
gameLoop();
