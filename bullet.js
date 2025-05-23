class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 12;
        this.radius = 3;
        this.life = 0;
        this.maxLife = 60; // frames
    }

    update(dt) {
        this.x += Math.cos(this.angle) * this.speed * dt / 16;
        this.y += Math.sin(this.angle) * this.speed * dt / 16;
        this.x = wrapCoord(this.x, 1440);
        this.y = wrapCoord(this.y, 900);
        this.life += dt / 16;
    }

    draw(ctx, scale) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
    }

    isAlive() {
        return this.life < this.maxLife;
    }
}
