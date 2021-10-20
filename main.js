let myCanvas = document.getElementById("canvas");
let context = myCanvas.getContext("2d")
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
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);
    draw(context);
    showFps();
}

function showFps() {
    context.fillStyle = "White";
    context.font = "normal 16pt Arial";
    context.fillText(Math.floor(fps) + " fps", 10, 20);
}

function init() {
    context.imageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    load({ width : myCanvas.width, height : myCanvas.height });
    requestAnimationFrame(run);
}

init();
