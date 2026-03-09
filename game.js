const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");

let velocity = 0;
let gravity = 0.6;
let isJumping = false;
let score = 0;
let running = true;

function jump(){
    if(!isJumping){
        velocity = 12;
        isJumping = true;
    }
}

document.addEventListener("touchstart", handleInput);
document.addEventListener("click", handleInput);

function handleInput(){
    if(!running){
        restart();
    }else{
        jump();
    }
}

function gameLoop(){

    if(!running) return;

    velocity -= gravity;

    let bottom = parseFloat(getComputedStyle(player).bottom);
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

    if(!running) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");

    obstacle.style.left = game.offsetWidth + "px";

    game.appendChild(obstacle);

    let pos = game.offsetWidth;

    const move = setInterval(()=>{

        if(!running){
            clearInterval(move);
            return;
        }

        pos -= 6;
        obstacle.style.left = pos + "px";

        if(pos < -40){
            obstacle.remove();
            clearInterval(move);
            score++;
            scoreText.innerText = "Score: " + score;
        }

    },20);

    setTimeout(spawnObstacle,1400);
}

function checkCollision(){

    const obstacles = document.querySelectorAll(".obstacle");

    obstacles.forEach(o=>{

        const p = player.getBoundingClientRect();
        const r = o.getBoundingClientRect();

        if(
            p.left < r.right &&
            p.right > r.left &&
            p.bottom > r.top
        ){
            endGame();
        }

    });
}

function endGame(){
    running = false;
    gameOverText.style.display = "block";
}

function restart(){

    document.querySelectorAll(".obstacle").forEach(o=>o.remove());

    score = 0;
    scoreText.innerText = "Score: 0";

    player.style.bottom = "0px";

    running = true;
    gameOverText.style.display = "none";

    spawnObstacle();
    gameLoop();
}

spawnObstacle();
gameLoop();
