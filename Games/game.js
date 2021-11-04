let gameReady = false;
let sceneManager = null;

function keyDownEventListener(key) {
    key.preventDefault();
    ServiceLocator.getService(ServiceLocator.KEYBOARD).switchOn(key.code);
}

function keyUpEventListener(key) {
    key.preventDefault();
    ServiceLocator.getService(ServiceLocator.KEYBOARD).switchOff(key.code);
}

function load(canvas) {
    let inputListener = new InputListener();
    document.addEventListener("keydown", keyDownEventListener, false);
    document.addEventListener("keyup", keyUpEventListener, false);

    let assetLoader = new AssetLoader();
    ServiceLocator.registerService(ServiceLocator.SCREEN, { width : canvas.width, height : canvas.height });
    ServiceLocator.registerService(ServiceLocator.KEYBOARD, inputListener);
    ServiceLocator.registerService(ServiceLocator.RESOURCE, assetLoader);
    ServiceLocator.registerService(ServiceLocator.PARAMETER, new Parameter());
    
    assetLoader.add("images/player1.png");
    assetLoader.add("images/starknife.png");
    assetLoader.add("images/sphere.png");
    assetLoader.add("images/wobbler.png");
    assetLoader.add("images/background1.png");
    assetLoader.add("images/background2.png");
    assetLoader.add("images/background3.png");
    assetLoader.add("images/rock7.png");
    assetLoader.add("images/rock8.png");
    assetLoader.add("images/rock9.png");
    assetLoader.add("images/rock10.png");
    assetLoader.add("images/rock11.png");
    assetLoader.add("images/speedup.png");
    assetLoader.add("images/bluespark.png");
    assetLoader.add("images/serpentbody.png");
    assetLoader.add("images/serpenthead.png");
    assetLoader.add("images/serpentrear.png");
    assetLoader.add("images/redbullet.png");
    assetLoader.add("images/bluebullet.png");
    assetLoader.add("images/greenbullet.png");

    assetLoader.start(startGame);
}

function startGame() {
    sceneManager = new SceneManager();
    let currentScene = Level1Scene.createInstance()
    sceneManager.addScene(currentScene);
    sceneManager.setCurrent(currentScene);
    ServiceLocator.registerService(ServiceLocator.SCENE, sceneManager);

    // On enregistre les controles à utiliser
    let inputListener = ServiceLocator.getService(ServiceLocator.KEYBOARD);
    inputListener.registerCommand("ArrowUp", new MoveCommand(currentScene.playerShip, new Vec2(0, -1)));
    inputListener.registerCommand("ArrowDown", new MoveCommand(currentScene.playerShip, new Vec2(0, 1)));
    inputListener.registerCommand("ArrowLeft", new MoveCommand(currentScene.playerShip, new Vec2(-1, 0)));
    inputListener.registerCommand("ArrowRight", new MoveCommand(currentScene.playerShip, new Vec2(1, 0)));
    inputListener.registerCommand("KeyZ", new FireActionCommand(currentScene.playerShip));

    gameReady = true;
}

function update(dt) {
    if (!gameReady) return;

    sceneManager.update(dt);

    // Est-ce que l'on passe en affichage collideBox?
    if (ServiceLocator.getService(ServiceLocator.KEYBOARD).isPressed("KeyC")) {
        let parameters = ServiceLocator.getService(ServiceLocator.PARAMETER);
        parameters.setColliderDisplay(!parameters.colliderDisplay);
    }
}

function draw(context) {
    if (!gameReady) return;

    sceneManager.draw(context);
}
