import { Player } from "./player.js";
import { Projectile } from "./projectile.js";
import { Enemy } from "./enemy.js";
import { distanceBetweenTwoPoints } from "./utilities.js";


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const deadElement = document.querySelector('.dead');
const scoreElement = document.querySelector('#score');

let player;
let projectiles = [];
let enemies = [];
let score = 0;
let animationId;
let spawnIntervalId;
let countIntervalId;

startGame();

function startGame() {
    init();
    animate();
    spawnEnemies();
}



function spawnEnemies() {
    let CountOfSpawnEnemies = 1;

    countIntervalId = setInterval(() => letCountOfSpawnEnemies++, 30000);
    spawnIntervalId = setInterval(() => enemies.push(new Enemy(canvas.width, canvas.height, context, player)), 1000);
    spawnCountEnemies(CountOfSpawnEnemies);
}

function init() {
    const movementLimits = {
        minX: 0,
        maxX: canvas.width,
        minY: 0,
        maxY: canvas.height,
    };

    player = new Player(canvas.width / 2, canvas.height / 2, context, movementLimits);
    addEventListener("click", createProjectile);
}

function createProjectile(event) {
    projectiles.push(
        new Projectile(
            player.x,
            player.y,
            event.clientX,
            event.clientY,
            context
        )
    )
}

function spawnCountEnemies(count) {
    for (let i = 0; i < count; i++) {
        enemies.push(new Enemy(canvas.width, canvas.height, context, player));
    }
}


function animate() {
    animationId = requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);

    projectiles = projectiles.filter(projectileInsideWindow);
    enemies.forEach(enemy => checkHittingEnemy(enemy));
    enemies = enemies.filter(enemy => enemy.health > 0);


    const isGameOver = enemies.some(checkHittingPlayer);
    if (isGameOver) {
        deadElement.style.display = 'block'
        clearInterval(countIntervalId);
        clearInterval(spawnIntervalId);
        cancelAnimationFrame(animationId);
    }

    projectiles.forEach(projectiles => projectiles.update());
    player.update();
    enemies.forEach(enemy => enemy.update());
}

function projectileInsideWindow(projectile) {
    return projectile.x + projectile.radius > 0 &&
        projectile.x - projectile.radius < canvas.width &&
        projectile.y + projectile.radius > 0 &&
        projectile.y - projectile.radius < canvas.height;
}

function checkHittingPlayer(enemy) {
    const distance = distanceBetweenTwoPoints(player.x, player.y, enemy.x, enemy.y);
    return distance - enemy.radius - player.radius < 0;
}

function checkHittingEnemy(enemy) {
    projectiles.some((projectile) => {
        const distance = distanceBetweenTwoPoints(projectile.x, projectile.y, enemy.x, enemy.y);
        if (distance - 66 - projectile.radius > 0) return false;


        enemy.health--;

        if (enemy.health < 1) {
            increaseScore();
        }

        return true;
    });
}

function increaseScore(){
    score += 250;
    scoreElement.innerHTML = score;
}