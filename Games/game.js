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

function mousemoveEventListener(event) {
    let inputHandler = ServiceLocator.getService(ServiceLocator.KEYBOARD);
    inputHandler.mouse.x = event.clientX - canvasInPage.offsetLeft;
    inputHandler.mouse.y = event.clientY - canvasInPage.offsetTop;
}

function clickEventListener(event) {
    let inputHandler = ServiceLocator.getService(ServiceLocator.KEYBOARD);
    inputHandler.click.x = inputHandler.mouse.x;
    inputHandler.click.y = inputHandler.mouse.y;
}

function load(canvas) {
    let keyListener = new KeyListener();
    document.addEventListener("keydown", keyDownEventListener, false);
    document.addEventListener("keyup", keyUpEventListener, false);

    // this.canvas.scale(4, 4);
    canvas.addEventListener("mousemove", mousemoveEventListener, false);
    canvas.addEventListener("click", clickEventListener, false);

    let imageLoader = new ImageLoader();
    ServiceLocator.registerService(ServiceLocator.SCREEN, { width : canvas.width, height : canvas.height });
    ServiceLocator.registerService(ServiceLocator.RESOURCE, imageLoader);
    ServiceLocator.registerService(ServiceLocator.KEYBOARD, keyListener);
    ServiceLocator.registerService(ServiceLocator.PARAMETER, new Parameter());
    
    imageLoader.add("images/player1.png");
    imageLoader.add("images/player2.png");
    imageLoader.add("images/starknife.png");
    imageLoader.add("images/starknifeReversed.png");
    imageLoader.add("images/redbullet.png");
    imageLoader.add("images/background.png");
    imageLoader.add("images/background2.png");
    imageLoader.add("images/background3.png");
    imageLoader.add("images/gas2.png");
    imageLoader.add("images/rock7.png");
    imageLoader.add("images/rock8.png");
    imageLoader.add("images/rock9.png");
    imageLoader.add("images/rock10.png");
    imageLoader.add("images/rock11.png");
    imageLoader.add("images/tech_bottom_end_left.png");
    imageLoader.add("images/tech_bottom_end_right.png");
    imageLoader.add("images/tech_bottom_single.png");
    imageLoader.add("images/tech_bottom_tile.png");
    imageLoader.add("images/tech_bottom_tile2.png");
    imageLoader.add("images/gui/bigPanel.png");
    imageLoader.add("images/gui/button.png");
    imageLoader.start(startGame);
}

function startGame() {
    sceneManager = new SceneManager();
    let level1 = SamplePlayScene.createInstance()
    let menu = SampleMenuScene.createInstance(level1);
    sceneManager.addScene(level1);
    sceneManager.addScene(menu);
    sceneManager.setCurrent(menu);
    ServiceLocator.registerService(ServiceLocator.SCENE, sceneManager);

    gameReady = true;
}

function update(dt) {
    if (!gameReady) return;

    sceneManager.update(dt);

    // Est-ce que l'on passe en affichage collideBox?
    if (ServiceLocator.getService(ServiceLocator.KEYBOARD).isPressed("KeyC")) {
        let parameters = ServiceLocator.getService(ServiceLocator.PARAMETER);
        parameters.colliderDisplay = !parameters.colliderDisplay;
    }

    // Mise à jour des contrôles (surtout pour le click de souris);
    ServiceLocator.getService(ServiceLocator.KEYBOARD).update(dt);
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
