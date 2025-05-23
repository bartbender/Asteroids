// gameManager.js
// Lógica principal del juego Asteroids

let canvas, ctx, scale;
let player, asteroids, bullets, explosions;
let lastTime = 0;
let running = false;
let score = 0;
let lives = 3;
let canShoot = true;
let shootCooldown = 0;
let gameOver = false;
let fireworks = null;
let fireworksTime = 0;
let lastAsteroidHit = { x: 720, y: 450 };

function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight - document.getElementById('title').offsetHeight;
    let cw = w, ch = h;
    if (w / h > 16 / 9) {
        cw = h * 16 / 9;
        ch = h;
    } else {
        cw = w;
        ch = w * 9 / 16;
    }
    canvas.width = cw;
    canvas.height = ch;
    scale = cw / 1440;
}

function startGame() {
    player = new Player();
    asteroids = [];
    bullets = [];
    explosions = [];
    score = 0;
    lives = 3;
    gameOver = false;
    spawnAsteroids(5);
    running = true;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    playSound('NewLevel');
}

function spawnAsteroids(n) {
    for (let i = 0; i < n; i++) {
        let x, y;
        do {
            x = randRange(0, 1440);
            y = randRange(0, 900);
        } while (dist(x, y, 720, 450) < 200);
        asteroids.push(new Asteroid(x, y, randRange(60, 90)));
    }
}

function gameLoop(now) {
    if (!running) return;
    const dt = Math.min(now - lastTime, 40);
    lastTime = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Actualizar
    if (!gameOver) {
        player.update(dt, Input);
        bullets.forEach(b => b.update(dt));
        asteroids.forEach(a => a.update(dt));
        explosions.forEach(e => e.update(dt));
        if (fireworks) {
            fireworks.update(dt);
            fireworksTime += dt;
            if (fireworksTime > 3000) { // 3 segundos
                fireworks = null;
                spawnAsteroids(5); // Regenerar la oleada solo cuando termina el efecto
            }
        }
        bullets = bullets.filter(b => b.isAlive());
        explosions = explosions.filter(e => e.isAlive());
        // Disparo
        if (Input.shoot && canShoot && !player.isExploding) {
            // Si hay un ángulo objetivo (mouse/touch), la nave apunta a esa dirección al disparar
            if (Input.targetAngle !== undefined) {
                player.angle = Input.targetAngle;
            }
            const bulletX = player.x + Math.cos(player.angle) * 24;
            const bulletY = player.y + Math.sin(player.angle) * 24;
            bullets.push(new Bullet(bulletX, bulletY, player.angle));
            canShoot = false;
            shootCooldown = 0;
            playSound('laserShoot');
        }
        if (!Input.shoot) canShoot = true;
        // Cooldown
        if (!canShoot) {
            shootCooldown += dt;
            if (shootCooldown > 180) canShoot = true;
        }
        // Colisiones
        for (let i = asteroids.length - 1; i >= 0; i--) {
            const a = asteroids[i];
            // Player vs Asteroide
            if (!player.isExploding && dist(player.x, player.y, a.x, a.y) < a.radius + player.radius) {
                player.explode();
                explosions.push(new Explosion(player.x, player.y));
                lives--;
                playSound('explosion_ship');
                if (lives <= 0) {
                    gameOver = true;
                    running = false;
                    setTimeout(() => {
                        document.getElementById('restart-btn').style.display = '';
                    }, 1000);
                }
                setTimeout(() => {
                    if (!gameOver) {
                        // Regenerar asteroides para evitar colisión inmediata en el respawn
                        asteroids = [];
                        spawnAsteroids(5);
                        player.reset();
                        playSound('respawn');
                    }
                }, 1000);
            }
            // Balas vs Asteroide
            for (let j = bullets.length - 1; j >= 0; j--) {
                const b = bullets[j];
                if (dist(a.x, a.y, b.x, b.y) < a.radius) {
                    bullets.splice(j, 1);
                    score += 25;
                    lastAsteroidHit = { x: a.x, y: a.y };
                    playSound('explosion_asteroide');
                    if (score >= 1000 * (3 - lives + 1) && lives < 10) {
                        lives++;
                        playSound('LiveUp');
                    }
                    const fragments = a.split();
                    if (fragments.length > 0) {
                        asteroids.push(...fragments);
                    }
                    asteroids.splice(i, 1);
                    break;
                }
            }
        }
        // Siguiente oleada
        if (asteroids.length === 0 && !gameOver && !fireworks) {
            score += 1000;
            fireworks = new Fireworks(lastAsteroidHit.x, lastAsteroidHit.y);
            fireworksTime = 0;
            playSound('NewLevel');
            // spawnAsteroids(5); // Ahora solo se llama cuando termina el efecto
        }
    }
    // Dibujar
    asteroids.forEach(a => a.draw(ctx, scale));
    bullets.forEach(b => b.draw(ctx, scale));
    player.draw(ctx, scale);
    explosions.forEach(e => e.draw(ctx, scale));
    if (fireworks) fireworks.draw(ctx, scale);
    UI.drawHUD(ctx, lives, score, scale);
    if (gameOver) UI.drawGameOver(ctx, scale);
    Input.reset();
    if (running) requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    document.getElementById('start-btn').onclick = startGame;
    document.getElementById('restart-btn').onclick = startGame;
    // Mover la declaración de canvas aquí para evitar conflicto con input.js
});

// Clase Fireworks para efecto visual
class Fireworks {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        for (let i = 0; i < 40; i++) {
            const angle = randRange(0, Math.PI * 2);
            const speed = randRange(4, 10);
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: `hsl(${Math.floor(randRange(0, 360))},100%,60%)`,
                radius: randRange(2, 5),
                life: randRange(1, 2)
            });
        }
    }
    update(dt) {
        for (let p of this.particles) {
            p.x += p.vx * dt / 16;
            p.y += p.vy * dt / 16;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.radius *= 0.98;
            p.life -= dt / 1000;
        }
        this.particles = this.particles.filter(p => p.life > 0.1);
    }
    draw(ctx, scale) {
        for (let p of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.beginPath();
            ctx.arc(p.x * scale, p.y * scale, p.radius * scale, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.restore();
        }
    }
}
