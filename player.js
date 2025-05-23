 // player.js - Lógica y renderizado de la nave del jugador

class Player {
    constructor() {
        this.x = 720;
        this.y = 450;
        this.radius = 24;
        this.angle = 0; // Apunta hacia arriba (eje Y negativo)
        this.vel = { x: 0, y: 0 };
        this.rotation = 0;
        this.thrusting = false;
        this.lives = 3;
        this.score = 0;
        this.isExploding = false;
        this.explosionTime = 0;
        this.respawnDelay = 0;
    }

    reset() {
        this.x = 720;
        this.y = 450;
        this.angle = 0; // Apunta hacia arriba (eje Y negativo)
        this.vel = { x: 0, y: 0 };
        this.isExploding = false;
        this.explosionTime = 0;
        this.respawnDelay = 0;
    }

    update(dt, input) {
        if (this.isExploding) {
            this.explosionTime += dt;
            if (this.explosionTime > 1000) {
                this.isExploding = false;
                this.respawnDelay = 0;
                this.reset();
            }
            return;
        }
       
      
         // Rotación
        if (input.left) {
            this.angle -= 0.0050 * dt;
            console.log('Rotando a la izquierda', this.angle);
        }
        if (input.right) {
            this.angle += 0.0050 * dt;
            console.log('Rotando a la derecha', this.angle);
        }
        // Mouse/touch SOLO si no se está usando teclado
        if (!input.left && !input.right && input.targetAngle !== undefined && 
            input.targetAngle!== this.angle) {            
            this.angle = input.targetAngle;
        }

        // Aceleración
        if (input.up || input.accelerate) {
            this.vel.x += Math.cos(this.angle) * 0.01 * dt;
            this.vel.y += Math.sin(this.angle) * 0.01 * dt;
        }
        // Movimiento
        this.x += this.vel.x * dt / 16;
        this.y += this.vel.y * dt / 16;
        // Fricción
        this.vel.x *= 0.99;
        this.vel.y *= 0.99;
        // Envolvimiento
        this.x = wrapCoord(this.x, 1440);
        this.y = wrapCoord(this.y, 900);
    }

    draw(ctx, scale) {
        if (this.isExploding) return;
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.angle + Math.PI / 2); // Corrige la orientación para que la punta apunte en la dirección lógica
        ctx.strokeStyle = '#ffe066';
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(0, -24 * scale);
        ctx.lineTo(16 * scale, 20 * scale);
        ctx.lineTo(0, 12 * scale);
        ctx.lineTo(-16 * scale, 20 * scale);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    explode() {
        this.isExploding = true;
        this.explosionTime = 0;
    }
}
