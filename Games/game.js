let gameReady = false;
let sceneManager = null;

// Gestion des images de chargement
let loaderImage = document.getElementById("loaderImage");
let loaderImages = [];
let totalDt = 0;
for (let index = 1; index <= 14; index++) {
    let item = document.getElementById("loaderImage-" + index); 
    loaderImages.push(item.src);
}

function keyDownEventListener(key) {
    key.preventDefault();
    ServiceLocator.getService(ServiceLocator.KEYBOARD).switchOn(key.code);
}

function keyUpEventListener(key) {
    key.preventDefault();
    ServiceLocator.getService(ServiceLocator.KEYBOARD).switchOff(key.code);
}

function mouseMoveEventListener(event) {
    event.preventDefault();
    event.stopPropagation();
    ServiceLocator.getService(ServiceLocator.KEYBOARD).mouseMove(event.clientX, event.clientY);
}

function mouseClickEventListener(event) {
    e.preventDefault();
    e.stopPropagation();
    // ServiceLocator.getService(ServiceLocator.KEYBOARD).mouseClick();
}

function load(canvas) {
    let inputListener = new InputListener();

    // Pour le calcul des coordonnées de la souris
    inputListener.offSet = new Vec2(canvas.left, canvas.top);

    // Gestion du clavier
    document.addEventListener("keydown", keyDownEventListener, false);
    document.addEventListener("keyup", keyUpEventListener, false);

    // Gestion de la souris
    canvas.addEventListener('mousemove', mouseMoveEventListener, false);
    canvas.addEventListener('click', mouseClickEventListener, false);

    // Gestion de ressources
    let assetLoader = new AssetLoader();

    // Services utilisés dans toute l'application
    ServiceLocator.registerService(ServiceLocator.SCREEN, { width : canvas.width, height : canvas.height });
    ServiceLocator.registerService(ServiceLocator.KEYBOARD, inputListener);
    ServiceLocator.registerService(ServiceLocator.RESOURCE, assetLoader);
    ServiceLocator.registerService(ServiceLocator.PARAMETER, new Parameter());
    
    // Ressources à charger
    assetLoader.add("images/player1.png");
    assetLoader.add("images/player2.png");
    assetLoader.add("images/starknife.png");
    assetLoader.add("images/wobbler.png");
    assetLoader.add("images/background1.png");
    assetLoader.add("images/background2.png");
    assetLoader.add("images/background3.png");
    assetLoader.add("images/rock7.png");
    assetLoader.add("images/rock8.png");
    assetLoader.add("images/rock9.png");
    assetLoader.add("images/rock10.png");
    assetLoader.add("images/rock11.png");
    assetLoader.add("images/speedpowerup.png");
    assetLoader.add("images/powerup.png");
    assetLoader.add("images/bluespark.png");
    assetLoader.add("images/redspark.png");
    assetLoader.add("images/greenspark.png");
    assetLoader.add("images/purplespark.png");
    assetLoader.add("images/redbullet.png");
    assetLoader.add("images/bluebullet.png");
    assetLoader.add("images/greenbullet.png");
    assetLoader.add("images/rocket.png");
    assetLoader.add("images/soil1.png");
    assetLoader.add("images/soil2.png");
    assetLoader.add("images/soil3.png");
    assetLoader.add("images/soil4.png");
    assetLoader.add("images/tech_bottom_end_left.png");
    assetLoader.add("images/tech_bottom_end_right.png");
    assetLoader.add("images/tech_bottom_tile.png");
    assetLoader.add("images/tech_bottom_tile2.png");
    assetLoader.add("images/bigsaucer.png");
    assetLoader.add("images/cube.png");
    assetLoader.add("images/gas2.png");
    assetLoader.add("images/gui/bigPanel.png");
    assetLoader.add("images/gui/button.png");

    assetLoader.start(startGame);
}

function startGame() {
    sceneManager = new SceneManager();
    let currentScene = MenuScene.createInstance()
    sceneManager.addScene(currentScene);
    sceneManager.setCurrent(currentScene);
    ServiceLocator.registerService(ServiceLocator.SCENE, sceneManager);

    // // On enregistre les controles à utiliser
    // let inputListener = ServiceLocator.getService(ServiceLocator.KEYBOARD);
    // inputListener.registerCommand("ArrowUp", new MoveCommand(currentScene.playerShip, new Vec2(0, -1)));
    // inputListener.registerCommand("ArrowDown", new MoveCommand(currentScene.playerShip, new Vec2(0, 1)));
    // inputListener.registerCommand("ArrowLeft", new MoveCommand(currentScene.playerShip, new Vec2(-1, 0)));
    // inputListener.registerCommand("ArrowRight", new MoveCommand(currentScene.playerShip, new Vec2(1, 0)));
    // inputListener.registerCommand("KeyZ", new FireActionCommand(currentScene.playerShip));

    gameReady = true;
}

function update(dt) {
    if (!gameReady) {
        let ratio = Math.floor(ServiceLocator.getService(ServiceLocator.RESOURCE).getLoadedRatio() / 14 * 100);
        if (ratio < loaderImages.length) {
            loaderImage.src = loaderImages[ratio];
        }

        return;
    };

    sceneManager.update(dt);

    // Est-ce que l'on passe en affichage collideBox?
    if (ServiceLocator.getService(ServiceLocator.KEYBOARD).isPressed("KeyC")) {
        let parameters = ServiceLocator.getService(ServiceLocator.PARAMETER);
        parameters.setColliderDisplay(!parameters.colliderDisplay);
    }

    // if (ServiceLocator.getService(ServiceLocator.KEYBOARD).isPressed("KeyV")) {
    //     let playerShip = ServiceLocator.getService(ServiceLocator.SCENE).currentScene.playerShip;
    //     let explosion = new BigSaucerBigExplosionGameObject(playerShip);
    //     explosion.status = GameObjectState.ACTIVE;
    //     explosion.position.x = playerShip.position.x;
    //     explosion.position.y = playerShip.position.y;
    //     ServiceLocator.getService(ServiceLocator.SCENE).currentScene.addGameObject(explosion);
    // }
}

function draw(context) {
    if (!gameReady) return;

    sceneManager.draw(context);
}
