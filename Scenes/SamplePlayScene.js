class SamplePlayScene extends BaseScene {
    constructor(backgroundManager, waveManager, sceneStart, player) {
        super(backgroundManager, waveManager, sceneStart, player)
    }

    static createInstance(imageLoader, mainScreen) {
        // Gestion du background
        let backgroundManager = new BackgroundManager();
        backgroundManager.addLayer(new PermanentRollingBackgroundLayer(new Sprite(imageLoader.getImage("images/background.png")), 30));

        // Gestion des ennemis
        let redEnemyShip = ShipFactory.createRedEnemyShip(imageLoader, mainScreen);
        let greenEnemyShip =  ShipFactory.createGreenEnemyShip(imageLoader, mainScreen);

        // Gestion des vagues d'ennemis
        let waveManager = new WaveManager();
        waveManager.addWave(new SequenceItemWave(mainScreen, greenEnemyShip, 320, new Vec2(320, -12), 1, 8));
        waveManager.addWave(new SequenceItemWave(mainScreen, redEnemyShip, 480, new Vec2(320, 188), 0.5, 12));

        // Gestion du joueur
        let playerShip = ShipFactory.createPlayerShip(imageLoader, mainScreen, keyListener);

        return new SamplePlayScene(backgroundManager, waveManager, mainScreen.width, playerShip);
    }
}