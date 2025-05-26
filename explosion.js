 // explosion.js - Animación de explosión vectorial

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.time = 0;
        this.duration = 1000; // ms
        this.particles = [];
        for (let i = 0; i < 24; i++) {
            const angle = randRange(0, Math.PI * 2);
            const speed = randRange(2, 8);
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: randRange(2, 6)
            });
        }
    }

    update(dt) {
        this.time += dt;
        for (let p of this.particles) {
            p.x += p.vx * dt / 16;
            p.y += p.vy * dt / 16;
            p.radius *= 0.97;
        }
    }

    draw(ctx, scale) {
        ctx.save();
        ctx.globalAlpha = 1 - (this.time / this.duration);
        ctx.fillStyle = '#ffe066';
        for (let p of this.particles) {
            ctx.beginPath();
            ctx.arc(p.x * scale, p.y * scale, p.radius * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    isAlive() {
        return this.time < this.duration;
    }
}
