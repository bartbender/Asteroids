 // ui.js - Gestión de la interfaz de usuario: vidas, puntuación, mensajes y botones

const UI = {
    drawHUD(ctx, lives, score, scale) {
        // Vidas (iconos de nave)
        ctx.save();
        ctx.translate(40 * scale, 40 * scale);
        for (let i = 0; i < lives; i++) {
            ctx.save();
            ctx.translate(i * 40 * scale, 0);
            drawShipIcon(ctx, scale);
            ctx.restore();
        }
        ctx.restore();
        // Puntuación
        ctx.save();
        ctx.font = `${32 * scale}px 'Luckiest Guy', 'Comic Sans MS', cursive`;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'right';
        ctx.fillText(score, 1440 * scale - 40 * scale, 50 * scale);
        ctx.restore();
    },
    drawGameOver(ctx, scale) {
        ctx.save();
        ctx.font = `${80 * scale}px 'Luckiest Guy', 'Comic Sans MS', cursive`;
        ctx.fillStyle = '#ff3b3b';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 720 * scale, 400 * scale);
        ctx.restore();
    }
};

function drawShipIcon(ctx, scale) {
    ctx.save();
    ctx.strokeStyle = '#ffe066';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(0, -15 * scale);
    ctx.lineTo(12 * scale, 15 * scale);
    ctx.lineTo(0, 8 * scale);
    ctx.lineTo(-12 * scale, 15 * scale);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}
