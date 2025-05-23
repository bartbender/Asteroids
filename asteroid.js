// asteroid.js
// Lógica y renderizado de los asteroides

class Asteroid {
    constructor(x, y, radius, level = 1) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.level = level;
        this.angle = randRange(0, Math.PI * 2);
        this.speed = randRange(0.5, 2) * (4 - level) * 0.75; // Reducir velocidad un 25%
        this.vel = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.shape = generateAsteroidShape(this.radius, randRange(8, 14));
    }

    update(dt) {
        this.x += this.vel.x * dt / 16;
        this.y += this.vel.y * dt / 16;
        this.x = wrapCoord(this.x, 1440);
        this.y = wrapCoord(this.y, 900);
    }

    draw(ctx, scale) {
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(this.shape[0].x * scale, this.shape[0].y * scale);
        for (let i = 1; i < this.shape.length; i++) {
            ctx.lineTo(this.shape[i].x * scale, this.shape[i].y * scale);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    split() {
        if (this.radius < 30) return [];
        const newR = this.radius / 2;
        return [
            new Asteroid(this.x, this.y, newR, this.level + 1),
            new Asteroid(this.x, this.y, newR, this.level + 1)
        ];
    }
}
