let gameReady = false;
let sceneManager = null;

// Gestion des images de chargement
let loaderImage = document.getElementById("loaderImage");
let loaderText = document.getElementById("loaderText");
let loaderImages = [];
let totalDt = 0;

const Services = new ServicesLocator();

for (let index = 1; index <= 14; index++) {
    let item = document.getElementById("loaderImage-" + index); 
    loaderImages.push(item.src);
}

function keyDownEventListener(key) {
    key.preventDefault();
    Services.get("INPUT").switchOn(key.code);
}

function keyUpEventListener(key) {
    key.preventDefault();
    Services.get("INPUT").switchOff(key.code);
}

function mouseMoveEventListener(event) {
    event.preventDefault();
    // event.stopPropagation();
    Services.get("INPUT").mouseMove(event.clientX, event.clientY);
}

function mouseDownEventListener(event) {
    event.preventDefault();
    // event.stopPropagation();
    Services.get("INPUT").mouseDown();
}

function mouseUpEventListener(event) {
    event.preventDefault();
    // event.stopPropagation();
    Services.get("INPUT").mouseUp();
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
    Services.register("SCREEN", { width : canvas.width, height : canvas.height });
    Services.register("INPUT", inputListener);
    Services.register("ASSET", assetLoader);
    Services.register("PARAMETER", new Parameter());
    
    // Ressources à charger
    assetLoader.add("IMAGE", "Images/player1.png");
    assetLoader.add("IMAGE", "Images/player2.png");
    assetLoader.add("IMAGE", "Images/starknife.png");
    assetLoader.add("IMAGE", "Images/starknife2.png");
    assetLoader.add("IMAGE", "Images/wobbler.png");
    assetLoader.add("IMAGE", "Images/wobbler2.png");
    assetLoader.add("IMAGE", "Images/station.png");
    assetLoader.add("IMAGE", "Images/background1.png");
    assetLoader.add("IMAGE", "Images/background2.png");
    assetLoader.add("IMAGE", "Images/background3.png");
    assetLoader.add("IMAGE", "Images/rock7.png");
    assetLoader.add("IMAGE", "Images/rock8.png");
    assetLoader.add("IMAGE", "Images/rock9.png");
    assetLoader.add("IMAGE", "Images/rock10.png");
    assetLoader.add("IMAGE", "Images/rock11.png");
    assetLoader.add("IMAGE", "Images/speedpowerup.png");
    assetLoader.add("IMAGE", "Images/powerup.png");
    assetLoader.add("IMAGE", "Images/bluespark.png");
    assetLoader.add("IMAGE", "Images/redspark.png");
    assetLoader.add("IMAGE", "Images/greenspark.png");
    assetLoader.add("IMAGE", "Images/purplespark.png");
    assetLoader.add("IMAGE", "Images/laser.png");
    assetLoader.add("IMAGE", "Images/redbullet.png");
    assetLoader.add("IMAGE", "Images/bluebullet.png");
    assetLoader.add("IMAGE", "Images/greenbullet.png");
    assetLoader.add("IMAGE", "Images/rocket.png");
    assetLoader.add("IMAGE", "Images/soil1.png");
    assetLoader.add("IMAGE", "Images/soil2.png");
    assetLoader.add("IMAGE", "Images/soil3.png");
    assetLoader.add("IMAGE", "Images/soil4.png");
    assetLoader.add("IMAGE", "Images/tech_bottom_end_left.png");
    assetLoader.add("IMAGE", "Images/tech_bottom_end_right.png");
    assetLoader.add("IMAGE", "Images/tech_bottom_tile.png");
    assetLoader.add("IMAGE", "Images/tech_bottom_tile2.png");
    assetLoader.add("IMAGE", "Images/bigsaucer.png");
    assetLoader.add("IMAGE", "Images/cube.png");
    assetLoader.add("IMAGE", "Images/bigsaucer2.png");
    assetLoader.add("IMAGE", "Images/cube2.png");
    assetLoader.add("IMAGE", "Images/gas2.png");
    assetLoader.add("IMAGE", "Images/klaw.png");
    assetLoader.add("IMAGE", "Images/atom.png");
    assetLoader.add("IMAGE", "Images/atom2.png");
    assetLoader.add("IMAGE", "Images/Gui/bigPanel.png");
    assetLoader.add("IMAGE", "Images/Gui/bigPanel1.png");
    assetLoader.add("IMAGE", "Images/Gui/bigPanel2.png");
    assetLoader.add("IMAGE", "Images/Gui/button.png");
    assetLoader.add("IMAGE", "Images/Gui/smallPanel.png");
    assetLoader.add("IMAGE", "Images/Gui/verySmallPanel.png");
    assetLoader.add("IMAGE", "Images/Gui/lifeBar.png");
    assetLoader.add("IMAGE", "Images/Gui/playerHud.png");
    assetLoader.add("IMAGE", "Images/Gui/smallPanel2.png");
    assetLoader.add("IMAGE", "Images/Gui/verySmallPanel2.png");
    assetLoader.add("IMAGE", "Images/Gui/lifeBar2.png");
    assetLoader.add("IMAGE", "Images/Gui/playerHud2.png");
    assetLoader.add("IMAGE", "Images/shield.png");
    assetLoader.add("IMAGE", "Images/life.png");

    assetLoader.add("SOUND", "Sounds/laser1.mp3");
    assetLoader.add("SOUND", "Sounds/laser2.mp3");
    assetLoader.add("SOUND", "Sounds/laser3.mp3");
    assetLoader.add("SOUND", "Sounds/laser4.mp3");
    assetLoader.add("SOUND", "Sounds/laser5.mp3");
    assetLoader.add("SOUND", "Sounds/laser6.mp3");
    assetLoader.add("SOUND", "Sounds/Correct_08_wav.wav");
    assetLoader.add("SOUND", "Sounds/Correct_06_wav.wav");
    assetLoader.add("SOUND", "Sounds/Tense_01_wav.wav");
    assetLoader.add("SOUND", "Sounds/Explosion_Sci_Fi_03_wav.wav");
    assetLoader.add("SOUND", "Sounds/Explosion_Sci_Fi_03_variation_01_wav.wav");
    assetLoader.add("SOUND", "Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav");
    assetLoader.add("SOUND", "Sounds/Digital_panel_v1_wav.wav");
    assetLoader.add("SOUND", "Sounds/Digital_panel_v1_variation_02_wav.wav");
    assetLoader.add("SOUND", "Sounds/Digital_panel_v1_variation_01_wav.wav");
    assetLoader.add("SOUND", "Sounds/Rifle_v1_variation_02_wav.wav");
    assetLoader.add("SOUND", "Sounds/Click_Digital_06_wav.wav");
    assetLoader.add("SOUND", "Sounds/Hover_Digital_06_wav.wav");
    assetLoader.add("SOUND", "Sounds/Click_Digital_10_wav.wav");
    assetLoader.add("SOUND", "Sounds/Stinger_v2_wav.wav");

    assetLoader.add("SOUND", "Musics/bensound-highoctane.mp3");
    assetLoader.add("SOUND", "Musics/bensound-scifi.mp3");
    assetLoader.add("SOUND", "Musics/alexander-nakarada-loss.mp3");
    assetLoader.add("SOUND", "Musics/alexander-nakarada-we-are-victorious-finale.mp3");

    assetLoader.start(startGame);
}

function startGame() {
    sceneManager = new SceneManager();
    sceneManager.addScene("MENU", new MenuScene());
    sceneManager.addScene("LEVEL1", new Level1Scene());
    sceneManager.setCurrent("MENU");
    Services.register("SCENE", sceneManager);

    // On fait disparaitre les élément de chargement
    loaderImage.style.visibility = "hidden";
    loaderText.style.visibility = "hidden";

    gameReady = true;
    sceneManager.currentScene.show();
}

function update(dt) {
    if (!gameReady) {
        let loadRatio = Services.get("ASSET").getLoadedRatio();
        let ratio = Math.floor(loadRatio / 7 * 100);
        if (ratio < loaderImages.length) {
            loaderImage.src = loaderImages[ratio];
        }

        return;
    };

    sceneManager.update(dt);

    let inputListener = Services.get("INPUT");

    // Est-ce que l'on passe en affichage collideBox?
    if (inputListener.isPressed("KeyC")) {
        let parameters = Services.get("PARAMETER");
        parameters.setColliderDisplay(!parameters.colliderDisplay);
    }
}

function draw(context) {
    if (!gameReady) return;

    sceneManager.draw(context);
}
