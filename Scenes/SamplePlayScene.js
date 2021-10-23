class SamplePlayScene extends BaseScene {
    constructor(foregroundManager, backgroundManager, waveManager, sceneStart, player) {
        super(foregroundManager, backgroundManager, waveManager, sceneStart, player)
    }

    static createInstance() {
        let imageLoader = ServiceLocator.getService(ServiceLocator.RESOURCE);
        let mainScreen = ServiceLocator.getService(ServiceLocator.SCREEN);

        // Gestion du background
        let backgroundManager = new LayerManager();
        backgroundManager.addLayer(new RollingLayer(0.25, new Sprite(imageLoader.getImage("images/background.png"))));
        backgroundManager.addLayer(new RollingLayer(0.5, new Sprite(imageLoader.getImage("images/background2.png"))));
        let obstacleLayer = new ObstaclesLayer(1);
        obstacleLayer.addObstacle(new Obstacle(new RectangleSprite("Gray", new Vec2(), new Vec2(320, 30)), 320, new Vec2(320, 0)));
        obstacleLayer.addObstacle(new Obstacle(new RectangleSprite("Gray", new Vec2(), new Vec2(60, 60)), 450, new Vec2(320, 0)));
        backgroundManager.addLayer(obstacleLayer);

        // Gestion des ennemis
        let redEnemyShip = ShipFactory.createRedEnemyShip(new Vec2(-1, -1));

        // Gestion des vagues d'ennemis
        let waveManager = new WaveManager();
        // waveManager.addWave(new SequenceItemWave(greenEnemyShip, 320, new Vec2(320, -12), 1, 8));
        // waveManager.addWave(new SingleItemWave(redEnemyShip, new HorizontalLoopingMovePattern(10, new Vec2(-1, -1), 40, 2, redEnemyShip.getSize()), 160, new Vec2(320, 188)));
        waveManager.addWave(new SequenceItemWave(redEnemyShip, new HorizontalLoopingMovePattern(10, new Vec2(-1, -1), 40, 2, redEnemyShip.getSize()), 320, new Vec2(320, 188), 0.8, 12));

        // Gestion du joueur
        let playerShip = ShipFactory.createPlayerShip();
        playerShip.setMovepattern(new PlayerControlledMovePattern(100));

        return new SamplePlayScene(new LayerManager(), backgroundManager, waveManager, mainScreen.width, playerShip);
    }
}