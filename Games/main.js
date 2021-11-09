let canvasInPage = document.getElementById("canvas");
let drawContext = canvasInPage.getContext("2d")
let interval;
let lastTick = 0;
let fps = 0;
let fpsTolerance = 1 / 1000;
let wantedFps = 60;
let fpsList = [ 0, 0, 0, 0, 0];
let fpsIndex = 0;

function run(tick) {
    requestAnimationFrame(run);

    // Calcul du deltaTime
    let dt = (tick - lastTick) / 1000

    // Gestion du framerate
    if (dt < (1 / wantedFps) - fpsTolerance) {
        return;
    }

    // Calcul des fps, moyenne sur les 5 dernières
    fps = 1 / dt;
    fpsList[fpsIndex++] = fps;
    fpsIndex %= 5;

    // GameLoop
    lastTick = tick;
    update(dt);
    drawContext.clearRect(0, 0, canvasInPage.width, canvasInPage.height);
    draw(drawContext);
    showFps();
}

function showFps() {
    let avgFps = 0;
    for (let index = 0; index < 5; index++) {
        avgFps += fpsList[index];
    }
    // drawContext.fillStyle = "White";
    // drawContext.font = "normal 10pt neuropol";
    // drawContext.fillText(Math.floor(avgFps / 5) + " fps", 10, 20);
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
