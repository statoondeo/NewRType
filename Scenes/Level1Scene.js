class Level1Scene extends BaseScene {
    constructor(scheduler) {
        super(scheduler)
    }

    static createInstance() {
        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);

        // Scene de jeu proprement dite
        let baseSpeed = 60;

        // Scène proprement dite et son métronome
        let scene = new Level1Scene(new LinearScheduler(baseSpeed, screen.width));

        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        scene.addGameObject(new BlackStaticBackgroundGameObject());

        // La background principal
        scene.addGameObject(new Background1GameObject(baseSpeed));

        // Eléments de décor qui ne vont passer qu'une fois
        scene.addSynchronizedGameObject(new OnceLayer(0.3, baseSpeed, resources.getImage("images/background2.png"), 8000, new Vec2(-1, 0)));
        scene.addSynchronizedGameObject(new OnceLayer(0.5, baseSpeed, resources.getImage("images/background3.png"), 10000, new Vec2(-1, 0)));


        // Ajout d'obstacles        
        let rockyDecorImage = new RockyDecorImage();
        // let soilDecorImage = new Soil1DecorImage();
        scene.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, screen.width, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));
        // scene.addSynchronizedGameObject(new DecorsGameObject(soilDecorImage.image, 1, baseSpeed, 100, new Vec2(screen.width, screen.height - soilDecorImage.image.height), false));
        scene.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, 11000, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));

        // On retourne le décor rocheux pour l'utiliser dans la scène
        scene.addSynchronizedGameObject(new DecorsGameObject(ImageHandler.flipImage(rockyDecorImage.image, new Vec2(-1)), 0.9, baseSpeed, 6150, new Vec2(screen.width, 0), false));

        // Gestion du joueur
        let playerShip = new Player1ShipGameObject(new Vec2((screen.width - PlayerShipGameObject.size.x) / 2, (screen.height - PlayerShipGameObject.size.y) / 2));
        scene.addPlayerShip(playerShip);

        // Gestion des vagues
        scene.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 1300, new Vec2(screen.width, screen.height / 5),  1, 8));
        scene.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 2000, new Vec2(screen.width, 2 * screen.height / 5),  1, 10));
        scene.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 2500, new Vec2(screen.width, 3 * screen.height / 5),  1, 12));

        // Gestion des bonus
        scene.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new SpeedPowerUpGameObject(scene.playerShip), 3200, new Vec2(screen.width, (screen.height - SpeedPowerUpGameObject.size.y) / 2), 1, 1));

        // Vagues suivantes
        scene.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new WobblerGameObject(playerShip), 3600, new Vec2(-WobblerGameObject.size.x, (screen.height - WobblerGameObject.size.y) / 3), 1, 14));
        scene.addSynchronizedGameObject(new AllInCircleSpawnerGameObject(new StarknifeGameObject(), new Vec2(2 * (screen.width - StarknifeGameObject.size.x) / 3, (screen.height - StarknifeGameObject.size.y) / 2), 16, 4800));

        // Boss
        scene.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new BigSaucerGameObject(playerShip), 5500, new Vec2(), 1, 1));


        // Scene complète
        return scene;
    }
}