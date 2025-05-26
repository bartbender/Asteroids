 // input.js - Gestión de controles por teclado, ratón y touch

const Input = {
    left: false,
    right: false,
    up: false,
    shoot: false,
    targetAngle: undefined,
    mouseDown: false,
    accelerate: false,
    reset() {
        this.shoot = false;        
    }
};

window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') Input.left = true;
    if (e.code === 'ArrowRight') Input.right = true;
    if (e.code === 'ArrowUp') Input.up = true;
    if (e.code === 'Space') Input.shoot = true;
});
window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') Input.left = false;
    if (e.code === 'ArrowRight') Input.right = false;
    if (e.code === 'ArrowUp') Input.up = false;
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        Input.targetAngle = undefined;
    }
});

let inputCanvas;
function getCanvas() {
    if (!inputCanvas) inputCanvas = document.getElementById('game-canvas');
    return inputCanvas;
}

getCanvas().addEventListener('mousemove', e => {
    const rect = getCanvas().getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const angle = Math.atan2(my - rect.height / 2, mx - rect.width / 2);       
    Input.targetAngle = angle;
});
getCanvas().addEventListener('mousedown', e => {
    if (e.button === 0) {
        Input.shoot = true;
        Input.mouseDown = true;
    }
});
getCanvas().addEventListener('mouseup', e => {
    if (e.button === 0) {
        Input.mouseDown = false;
    }
});

getCanvas().addEventListener('touchstart', e => {
    if (e.touches.length > 0) {
        const rect = getCanvas().getBoundingClientRect();
        const tx = e.touches[0].clientX - rect.left;
        const ty = e.touches[0].clientY - rect.top;
        const angle = Math.atan2(ty - rect.height / 2, tx - rect.width / 2);
        Input.targetAngle = angle;
        Input.shoot = true;
    }
});
getCanvas().addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
        const rect = getCanvas().getBoundingClientRect();
        const tx = e.touches[0].clientX - rect.left;
        const ty = e.touches[0].clientY - rect.top;
        const angle = Math.atan2(ty - rect.height / 2, tx - rect.width / 2);
        Input.targetAngle = angle;
    }
});
getCanvas().addEventListener('touchend', e => {
    Input.shoot = false;
});

// Botón de aceleración
const accelerateBtn = document.getElementById('accelerate-btn');
if (accelerateBtn) {
    // Event listeners para el botón de aceleración
    accelerateBtn.addEventListener('touchstart', () => {
        Input.accelerate = true;
    });
    accelerateBtn.addEventListener('touchend', () => {
        Input.accelerate = false;
    });
    accelerateBtn.addEventListener('mousedown', () => {
        Input.accelerate = true;
    });
    accelerateBtn.addEventListener('mouseup', () => {
        Input.accelerate = false;
    });
}
