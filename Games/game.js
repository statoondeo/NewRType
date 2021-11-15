let gameReady = false;
let sceneManager = null;

// Gestion des images de chargement
let loaderImage = document.getElementById("loaderImage");
let loaderText = document.getElementById("loaderText");
let loaderImages = [];
let totalDt = 0;

for (let index = 1; index <= 14; index++) {
    let item = document.getElementById("loaderImage-" + index); 
    loaderImages.push(item.src);
}

function keyDownEventListener(key) {
    key.preventDefault();
    Services.get(Services.INPUT).switchOn(key.code);
}

function keyUpEventListener(key) {
    key.preventDefault();
    Services.get(Services.INPUT).switchOff(key.code);
}

function mouseMoveEventListener(event) {
    event.preventDefault();
    // event.stopPropagation();
    Services.get(Services.INPUT).mouseMove(event.clientX, event.clientY);
}

function mouseDownEventListener(event) {
    event.preventDefault();
    // event.stopPropagation();
    Services.get(Services.INPUT).mouseDown();
}

function mouseUpEventListener(event) {
    event.preventDefault();
    // event.stopPropagation();
    Services.get(Services.INPUT).mouseUp();
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
    canvas.addEventListener('mousedown', mouseDownEventListener, false);
    canvas.addEventListener('mouseup', mouseUpEventListener, false);

    // Gestion de ressources
    let assetLoader = new AssetLoader();

    // Services utilisés dans toute l'application
    Services.registerService(Services.SCREEN, { width : canvas.width, height : canvas.height });
    Services.registerService(Services.INPUT, inputListener);
    Services.registerService(Services.ASSET, assetLoader);
    Services.registerService(Services.PARAMETER, new Parameter());
    Services.registerService(Services.AUDIO, new AudioContext());
    
    // Ressources à charger
    assetLoader.add(AssetLoader.IMAGE, "Images/player1.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/player2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/starknife.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/starknife2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/wobbler.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/wobbler2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/station.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/background1.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/background2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/background3.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/rock7.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/rock8.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/rock9.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/rock10.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/rock11.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/speedpowerup.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/powerup.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/bluespark.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/redspark.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/greenspark.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/purplespark.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/laser.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/redbullet.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/bluebullet.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/greenbullet.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/rocket.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/soil1.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/soil2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/soil3.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/soil4.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/tech_bottom_end_left.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/tech_bottom_end_right.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/tech_bottom_tile.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/tech_bottom_tile2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/bigsaucer.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/cube.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/bigsaucer2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/cube2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/gas2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/klaw.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/bigPanel.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/button.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/smallPanel.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/verySmallPanel.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/lifeBar.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/playerHud.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/smallPanel2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/verySmallPanel2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/lifeBar2.png");
    assetLoader.add(AssetLoader.IMAGE, "Images/Gui/playerHud2.png");

    assetLoader.add(AssetLoader.SOUND, "sounds/laser1.mp3");
    assetLoader.add(AssetLoader.SOUND, "sounds/laser2.mp3");
    assetLoader.add(AssetLoader.SOUND, "sounds/laser3.mp3");
    assetLoader.add(AssetLoader.SOUND, "sounds/laser4.mp3");
    assetLoader.add(AssetLoader.SOUND, "sounds/laser5.mp3");

    assetLoader.add(AssetLoader.SOUND, "Musics/bensound-highoctane.mp3");
    assetLoader.add(AssetLoader.SOUND, "Musics/bensound-scifi.mp3");

    assetLoader.start(startGame);
}

function startGame() {
    sceneManager = new SceneManager();
    sceneManager.addScene("MENU", new MenuScene());
    sceneManager.addScene("LEVEL1", new Level1Scene());
    sceneManager.setCurrent("LEVEL1");
    Services.registerService(Services.SCENE, sceneManager);

    // On fait disparaitre les élément de chargement
    loaderImage.style.visibility = "hidden";
    loaderText.style.visibility = "hidden";

    gameReady = true;
    sceneManager.currentScene.show();
}

function update(dt) {
    if (!gameReady) {
        let loadRatio = Services.get(Services.ASSET).getLoadedRatio();
        let ratio = Math.floor(loadRatio / 7 * 100);
        if (ratio < loaderImages.length) {
            loaderImage.src = loaderImages[ratio];
        }

        return;
    };

    sceneManager.update(dt);

    let inputListener = Services.get(Services.INPUT);

    // Est-ce que l'on passe en affichage collideBox?
    if (inputListener.isPressed("KeyC")) {
        let parameters = Services.get(Services.PARAMETER);
        parameters.setColliderDisplay(!parameters.colliderDisplay);
    }
}

function draw(context) {
    if (!gameReady) return;

    sceneManager.draw(context);
}
