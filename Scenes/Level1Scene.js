class Level1Scene extends BaseScene {
    constructor() {
        super()
    }

    load() {
        super.load();
        
        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        
        // Gestion du joueur
        let playerShip = new Player1ShipGameObject(new Vec2((screen.width - PlayerShipGameObject.size.x) / 2, (screen.height - PlayerShipGameObject.size.y) / 2));
        this.addPlayerShip(playerShip);

        // On enregistre les controles à utiliser
        let inputListener = ServiceLocator.getService(ServiceLocator.KEYBOARD);
        inputListener.clearCommands();
        inputListener.registerCommand("ArrowUp", new MoveCommand(this.playerShip, new Vec2(0, -1)));
        inputListener.registerCommand("ArrowDown", new MoveCommand(this.playerShip, new Vec2(0, 1)));
        inputListener.registerCommand("ArrowLeft", new MoveCommand(this.playerShip, new Vec2(-1, 0)));
        inputListener.registerCommand("ArrowRight", new MoveCommand(this.playerShip, new Vec2(1, 0)));
        inputListener.registerCommand("Escape", new BackToMenuCommand(this.playerShip));
        inputListener.registerCommand("KeyZ", new FireActionCommand(this.playerShip));

        // Scene de jeu proprement dite
        let baseSpeed = 60;

        // Métronome
        this.scheduler = new LinearScheduler(baseSpeed, screen.width);

        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        this.addGameObject(new BlackStaticBackgroundGameObject());

        // La background principal
        this.addGameObject(new Background1GameObject(baseSpeed));

        // Eléments de décor qui ne vont passer qu'une fois
        this.addSynchronizedGameObject(new OnceLayer(0.3, baseSpeed, resources.getImage("Images/background2.png"), 8000, new Vec2(-1, 0)));
        this.addSynchronizedGameObject(new OnceLayer(0.5, baseSpeed, resources.getImage("Images/background3.png"), 10000, new Vec2(-1, 0)));


        // Ajout d'obstacles        
        let rockyDecorImage = new RockyDecorImage();
        // let soilDecorImage = new Soil1DecorImage();
        this.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, screen.width, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));
        // scene.addSynchronizedGameObject(new DecorsGameObject(soilDecorImage.image, 1, baseSpeed, 100, new Vec2(screen.width, screen.height - soilDecorImage.image.height), false));
        this.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, 11000, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));

        // On retourne le décor rocheux pour l'utiliser dans la scène
        this.addSynchronizedGameObject(new DecorsGameObject(ImageHandler.flipImage(rockyDecorImage.image, new Vec2(-1)), 0.9, baseSpeed, 6150, new Vec2(screen.width, 0), false));

        // Gestion des vagues
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 1300, new Vec2(screen.width, screen.height / 5),  1, 8));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 2000, new Vec2(screen.width, 2 * screen.height / 5),  1, 10));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 2500, new Vec2(screen.width, 3 * screen.height / 5),  1, 12));

        // Gestion des bonus
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new SpeedPowerUpGameObject(this.playerShip), 3200, new Vec2(screen.width, (screen.height - SpeedPowerUpGameObject.size.y) / 2), 1, 1));

        // Vagues suivantes
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new WobblerGameObject(playerShip), 3600, new Vec2(-WobblerGameObject.size.x, (screen.height - WobblerGameObject.size.y) / 3), 1, 14));
        this.addSynchronizedGameObject(new AllInCircleSpawnerGameObject(new StarknifeGameObject(), new Vec2(2 * (screen.width - StarknifeGameObject.size.x) / 3, (screen.height - StarknifeGameObject.size.y) / 2), 16, 4800));

        // Boss
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new BigSaucerGameObject(playerShip), 5500, new Vec2(), 1, 1));
    }
}