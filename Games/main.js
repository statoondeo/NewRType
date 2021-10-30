let canvasInPage = document.getElementById("canvas");
let drawContext = canvasInPage.getContext("2d")
let interval;
let lastTick = 0;
let fps = 0;
let fpsTolerance = 1 / 1000;
let wantedFps = 60;

function run(tick) {
    requestAnimationFrame(run);

    // Calcul du deltaTime
    let dt = (tick - lastTick) / 1000

    // Gestion du framerate
    if (dt < (1 / wantedFps) - fpsTolerance) {
        return;
    }

    // GameLoop
    fps = 1 / dt;
    lastTick = tick;
    update(dt);
    drawContext.clearRect(0, 0, canvasInPage.width, canvasInPage.height);
    draw(drawContext);
    showFps();
}

function showFps() {
    drawContext.fillStyle = "White";
    drawContext.font = "normal 10pt Arial";
    drawContext.fillText(Math.floor(fps) + " fps", 10, 20);
}

function init() {
    drawContext.imageSmoothingEnabled = false;
    drawContext.msImageSmoothingEnabled = false;
    drawContext.webkitImageSmoothingEnabled = false;
    drawContext.mozImageSmoothingEnabled = false;
    load(canvasInPage);
    requestAnimationFrame(run);
}

init();
