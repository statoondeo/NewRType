let gameReady = false;
let scene = null;

let sceneManager = null;

function keyDownEventListener(key) {
    key.preventDefault();
    ServiceLocator.getService(ServiceLocator.KEYBOARD).switchOn(key.code);
}

function keyUpEventListener(key) {
    key.preventDefault();
    ServiceLocator.getService(ServiceLocator.KEYBOARD).switchOff(key.code);
}

function load(screen) {
    let keyListener = new KeyListener();
    document.addEventListener("keydown", keyDownEventListener, false);
    document.addEventListener("keyup", keyUpEventListener, false);

    // this.canvas.scale(4, 4);

    let imageLoader = new ImageLoader();
    ServiceLocator.registerService(ServiceLocator.SCREEN, screen);
    ServiceLocator.registerService(ServiceLocator.RESOURCE, imageLoader);
    ServiceLocator.registerService(ServiceLocator.KEYBOARD, keyListener);
    
    imageLoader.add("images/player.png");
    imageLoader.add("images/enemyred.png");
    imageLoader.add("images/background.png");
    imageLoader.add("images/background2.png");
    imageLoader.start(startGame);
}

function startGame() {
    sceneManager = new SceneManager();
    let currentScene = SamplePlayScene.createInstance()
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
        context.fillRect(1, 1, 400 * ServiceLocator.getService(ServiceLocator.RESOURCE).getLoadedRatio(), 100);
        return;
    }

    sceneManager.draw(context);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
