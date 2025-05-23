// sound.js
// Gestión centralizada de efectos de sonido para Asteroids

const sounds = {
    explosion_asteroide: new Audio('explosion_asteroide.wav'), // Al destruir un asteroide
    explosion_ship: new Audio('explosion_ship.wav'),           // Al destruir la nave
    laserShoot: new Audio('laserShoot.wav'),                   // Al disparar
    LiveUp: new Audio('LiveUp.wav'),                           // Al ganar una vida
    NewLevel: new Audio('NewLevel.wav'),                       // Al iniciar o pasar de nivel
    respawn: new Audio('respawn.wav')                          // Al reaparecer la nave
};

let muted = false;

function setMuted(val) {
    muted = val;
    for (const key in sounds) {
        sounds[key].muted = muted;
    }
    const btn = document.getElementById('mute-btn');
    if (btn) btn.textContent = muted ? '🔇 Silenciado' : '🔊 Sonido';
}

window.addEventListener('DOMContentLoaded', () => {
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.onclick = () => setMuted(!muted);
    }
    window.addEventListener('keydown', e => {
        if (e.key === 's' || e.key === 'S') {
            setMuted(!muted);
        }
    });
});

function playSound(name) {
    if (muted) return;
    if (sounds[name]) {
        const s = sounds[name].cloneNode();
        s.muted = muted;
        s.play();
    }
}
