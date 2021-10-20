let imageLoader = null;
let gameReady = false;
let scene = null;
let mainScreen = null;

// Gestion du clavier
let keyListener = null;

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
  
    // Gestion du background
    let backgroundManager = new BackgroundManager();
    backgroundManager.addLayer(new PermanentRollingBackgroundLayer(new Sprite(imageLoader.getImage("images/background.png")), 30));
    // backgroundManager.addLayer(new StaticBackgroundLayer(new Sprite(imageLoader.getImage("images/background.png"))));

    // Gestion des ennemis
    let waveManager = new WaveManager();
    let enemy = new Enemy(new Sprite(imageLoader.getImage("images/enemyred.png")));
    enemy.sprite.setTileSheet({ x : 24, y : 24 });
    enemy.sprite.addAnimation(new Animation("ROTATE", [ 0, 1, 2, 3, 4, 5 ], 0.25, true));
    enemy.sprite.startAnimation("ROTATE");
    waveManager.addWave(new SingleItemWave(enemy, 320, { x : 320, y : 66 }));
    waveManager.addWave(new SequenceItemWave(enemy, 480, { x : 320, y : 132 }, 2, 5));

    // Gestion du joueur
    let playerSprite = new Sprite(imageLoader.getImage("images/player.png"));
    playerSprite.setTileSheet({ x : 30, y : 16 })
    playerSprite.currentFrame = 9;
    playerSprite.addAnimation(new Animation("TURN_RIGHT", [0, 1, 2, 3, 4, 5, 6, 7, 8], 150 / 1000, false));
    playerSprite.addAnimation(new Animation("TURN_UP", [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 150 / 1000, true));

    scene = new Scene(backgroundManager, waveManager, mainScreen.width, new Player(keyListener, playerSprite));

    gameReady = true;
}

function update(dt) {
    if (!gameReady) return;

    scene.update(dt);
}

function draw(context) {
    if (!gameReady) {
        context.fillStyle = "rgb(255, 255, 255)";
        context.fillRect(1, 1, 400, 100);
        context.fillStyle = "rgb(0, 255, 0)";
        context.fillRect(1, 1, 400 * imageLoader.getLoadedRatio(), 100);
        return;
    }

    scene.draw(context);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
