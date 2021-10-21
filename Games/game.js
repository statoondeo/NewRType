let imageLoader = null;
let gameReady = false;
let scene = null;
let mainScreen = null;

// Gestion du clavier
let keyListener = null;

let sceneManager = null;

function keyDownEventListener(key) {
    key.preventDefault();
    keyListener.switchOn(key.code);
}

function keyUpEventListener(key) {
    key.preventDefault();
    keyListener.switchOff(key.code);
}

function load(screen) {
    keyListener = new KeyListener();
    document.addEventListener("keydown", keyDownEventListener, false);
    document.addEventListener("keyup", keyUpEventListener, false);

    mainScreen = screen
    // this.canvas.scale(4, 4);

    imageLoader = new ImageLoader();
    imageLoader.add("images/player.png");
    imageLoader.add("images/enemyred.png");
    imageLoader.add("images/background.png");
    imageLoader.add("images/background2.png");
    imageLoader.start(startGame);
}

function startGame() {
    sceneManager = new SceneManager();
    let currentScene = SamplePlayScene.createInstance(imageLoader, mainScreen)
    sceneManager.addScene(currentScene);
    sceneManager.setCurrent(currentScene);

    gameReady = true;
}

function update(dt) {
    if (!gameReady) return;

    sceneManager.update(dt);
}

function draw(context) {
    if (!gameReady) {
        context.fillStyle = "rgb(255, 255, 255)";
        context.fillRect(1, 1, 400, 100);
        context.fillStyle = "rgb(0, 255, 0)";
        context.fillRect(1, 1, 400 * imageLoader.getLoadedRatio(), 100);
        return;
    }

    sceneManager.draw(context);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
