 // utils.js - Funciones utilitarias para el juego Asteroids

// Genera un número aleatorio entre min y max
function randRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Convierte grados a radianes
function degToRad(deg) {
    return deg * Math.PI / 180;
}

// Calcula la distancia entre dos puntos
function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Envuelve una coordenada en el espacio virtual 16:9
function wrapCoord(val, max) {
    if (val < 0) return max + val;
    if (val > max) return val - max;
    return val;
}

// Dibuja un polígono irregular para asteroides
function generateAsteroidShape(radius, vertexCount = 10) {
    const points = [];
    for (let i = 0; i < vertexCount; i++) {
        const angle = (i / vertexCount) * Math.PI * 2;
        const r = radius * randRange(0.7, 1.2);
        points.push({
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r
        });
    }
    return points;
}
