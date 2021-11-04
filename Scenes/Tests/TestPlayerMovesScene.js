class TestPlayerMovesScene extends BaseScene {
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
        // let scheduler = new LinearScheduler(baseSpeed, screen.width);
        let scheduler = new AdaptativeScheduler(baseSpeed, screen.width);
        let scene = new TestPlayerMovesScene(scheduler);

        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        let shape = new RectShape("Black");
        shape.position = new Vec2(0, 0);
        shape.size = new Vec2(screen.width, screen.height);
        scene.addGameObject(new StaticLayer(0, shape));
        scene.addGameObject(new RollingLayer(0.1, baseSpeed, resources.getImage("images/background.png"), new Vec2(-1, 0)));

        // Ajout d'obstacles
        let image1 = resources.getImage("images/rock7.png")
        let image2 = resources.getImage("images/rock11.png")
        let image3 = resources.getImage("images/rock8.png")
        let image4 = resources.getImage("images/rock9.png")
        let image5 = resources.getImage("images/rock10.png")

        let totalWidth = image1.width + image2.width + image3.width + image4.width + image5.width;
        let imageX = 0;

        // Constitution d'une image intermédiaire pour une manipulation unique de l'ensemble
        let imageAssembler = new ImageAssembler(new Vec2(totalWidth, screen.height), new Vec2(1, 1));
        imageAssembler.addImage(image1, new Vec2(imageX, screen.height - image1.height));
        imageX += image1.width;
        imageAssembler.addImage(image2, new Vec2(imageX, screen.height - image2.height));
        imageX += image2.width;
        imageAssembler.addImage(image3, new Vec2(imageX, screen.height - image3.height));
        imageX += image3.width;
        imageAssembler.addImage(image4, new Vec2(imageX, screen.height - image4.height));
        imageX += image4.width;
        imageAssembler.addImage(image5, new Vec2(imageX, screen.height - image5.height));
        imageAssembler.assemble()

        // On cré le gameObject associé et on l'ajoute à la scène
        let obstacle = new DecorsGameObject(imageAssembler.getAssembledImage(), 0.7, baseSpeed, screen.width, new Vec2(screen.width, 0), false);
        scheduler.register(obstacle);
        scene.addGameObject(obstacle);

        // Gestion du joueur
        let playerShip = new AnimatedSprite(resources.getImage("images/player1.png"), new Vec2(64));
        playerShip.partition = GameObjectPartition.PLAYER_PARTITION;
        playerShip.status = GameObjectState.ACTIVE;
        playerShip.position.x = (screen.width - playerShip.size.x) / 2;
        playerShip.position.y = (screen.height - playerShip.size.y) / 2;
        playerShip.speed = 200;
        playerShip.behaveStrategy = new PlayerControlledMoveStrategy(playerShip, new Vec2());
        playerShip.collideBox = new CircleCollideBox(playerShip.position, playerShip.size.x / 2)
        playerShip.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        playerShip.startAnimation("IDLE", 0);

        // On ajoute le vaisseau du joueur à la scène
        scene.addPlayerShip(playerShip);

        // Scene retournée
        return scene;
    }
}