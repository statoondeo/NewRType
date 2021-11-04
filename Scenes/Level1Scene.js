class Level1Scene extends BaseScene {
    constructor(scheduler) {
        super(scheduler)
    }

    update(dt) {
        super.update(dt);
    }

    static createInstance() {
        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);

        // Scene de jeu proprement dite
        let baseSpeed = 60;

        // Métronome de la scène
        let scheduler = new LinearScheduler(baseSpeed, screen.width);

        // Scène proprement dite
        let scene = new Level1Scene(scheduler);

        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        scene.addGameObject(new BlackStaticBackgroundGameObject());

        // La background principal
        scene.addGameObject(new Background1GameObject(baseSpeed));

        // Eléments de décor qui ne vont passer qu'une fois
        let layer = new OnceLayer(0.3, baseSpeed, resources.getImage("images/background2.png"), 8000, new Vec2(-1, 0));
        scheduler.register(layer);
        scene.addGameObject(layer);

        layer = new OnceLayer(0.7, baseSpeed, resources.getImage("images/background3.png"), 10000, new Vec2(-1, 0));
        scheduler.register(layer);
        scene.addGameObject(layer);

        // Ajout d'obstacles        
        let rockyDecorImage = new RockyDecorImage();
        let obstacle = new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, screen.width, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false);
        scheduler.register(obstacle);
        scene.addGameObject(obstacle);

        obstacle = new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, 11000, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false);
        scheduler.register(obstacle);
        scene.addGameObject(obstacle);

        let imageFlipper = new ImageAssembler(new Vec2(rockyDecorImage.image.width, rockyDecorImage.image.height), new Vec2(1, -1));
        imageFlipper.addImage(rockyDecorImage.image, new Vec2());
        imageFlipper.assemble();
        let flippedImage = imageFlipper.getAssembledImage();

        obstacle = new DecorsGameObject(flippedImage, 0.9, baseSpeed, 6150, new Vec2(screen.width, 0), false);
        scheduler.register(obstacle);
        scene.addGameObject(obstacle);

        // Gestion du joueur
        scene.addPlayerShip(new PlayerShipGameObject(resources.getImage("images/player1.png"), new Vec2(64), new Vec2((screen.width - PlayerShipGameObject.size.x) / 2, (screen.height - PlayerShipGameObject.size.y) / 2)));

        // Vague #1
        let wave = new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 1280, new Vec2(screen.width, (screen.height - StarknifeGameObject.size.y) / 3),  1, 8);
        scheduler.register(wave);
        scene.addGameObject(wave);

        // Vague #2
        wave = new TimeSequenceSpawnerGameObject(new WobblerGameObject(), 2560, new Vec2(screen.width, 2 * (screen.height - WobblerGameObject.size.y) / 3), 1, 12);
        scheduler.register(wave);
        scene.addGameObject(wave);

        // Gestion du bonus
        wave = new TimeSequenceSpawnerGameObject(new SpeedPowerUpGameObject(), 3200, new Vec2(screen.width, (screen.height - SpeedPowerUpGameObject.size.y) / 2), 1, 1);
        scheduler.register(wave);
        scene.addGameObject(wave);

        // Scene complète
        return scene;
    }
}