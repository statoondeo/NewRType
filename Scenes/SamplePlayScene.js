class SamplePlayScene extends BaseScene {
    constructor(scheduler) {
        super(scheduler)
    }

    update(dt) {
        super.update(dt);
    }

    static createInstance() {
        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);

        // Métronome de la scène en cours de construction
        // Ici, le temps sera linéaire (toujours le même) et son avancement sera de 60 pixel par seconde environ
        let baseSceneSpeed = 60;
        let scheduler = new LinearScheduler(baseSceneSpeed, screen.width);

        // Scene de jeu proprement dite
        let scene = new SamplePlayScene(scheduler);

        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        let shape = new RectShape("Black");
        shape.position = new Vec2(0, 0);
        shape.size = new Vec2(screen.width, screen.height);
        scene.addGameObject(new StaticLayer(0, shape));
        scene.addGameObject(new RollingLayer(0.1, baseSceneSpeed, resources.getImage("images/background.png"), new Vec2(-1, 0)));
        let layer = new OnceLayer(0.3, baseSceneSpeed, resources.getImage("images/background2.png"), 2000, new Vec2(-1, 0));
        scheduler.register(layer);
        scene.addGameObject(layer);
        layer = new OnceLayer(0.5, baseSceneSpeed, resources.getImage("images/background3.png"), 4000, new Vec2(-1, 0));
        scheduler.register(layer);
        scene.addGameObject(layer);

        // Ajout d'obstacles
        let obstacle = new DecorsGameObject(resources.getImage("images/rock7.png"), 0.7, baseSceneSpeed, 1280, new Vec2(screen.width, 484), false);
        scheduler.register(obstacle);
        scene.addGameObject(obstacle);

        obstacle = new DecorsGameObject(resources.getImage("images/rock11.png"), 0.7, baseSceneSpeed, 2210, new Vec2(screen.width, 393), false);
        scheduler.register(obstacle);
        scene.addGameObject(obstacle);
        
        obstacle = new DecorsGameObject(resources.getImage("images/rock8.png"), 0.7, baseSceneSpeed, 2840, new Vec2(screen.width, 456), false);
        scheduler.register(obstacle);
        scene.addGameObject(obstacle);
        
        obstacle = new DecorsGameObject(resources.getImage("images/rock10.png"), 0.7, baseSceneSpeed, 3380, new Vec2(screen.width, 403), false);
        scheduler.register(obstacle);
        scene.addGameObject(obstacle);
                
        obstacle = new DecorsGameObject(resources.getImage("images/rock9.png"), 0.7, baseSceneSpeed, 3750, new Vec2(screen.width, 628), false);
        scheduler.register(obstacle);
        scene.addGameObject(obstacle);

        // // Remplacement des obstacles par un canvas hors champ
        // let offscreenCanvas = document.createElement("canvas");
        // offscreenCanvas.width = 1771;
        // offscreenCanvas.height = 800;
        // let offscreenContext = offscreenCanvas.getContext("2d");

        // let previousX = 0;
        // let image = resources.getImage("images/rock7.png");
        // offscreenContext.drawImage(image, previousX, screen.height - image.height, image.width, image.height);

        // previousX += image.width;
        // image = resources.getImage("images/rock11.png");
        // offscreenContext.drawImage(image, previousX, screen.height - image.height, image.width, image.height);

        // // previousX += image.width;
        // // image = resources.getImage("images/rock8.png");
        // // offscreenContext.drawImage(image, previousX, screen.height - image.height, image.width, image.height);

        // // previousX += image.width;
        // // image = resources.getImage("images/rock10.png");
        // // offscreenContext.drawImage(image, previousX, screen.height - image.height, image.width, image.height);

        // // previousX += image.width;
        // // image = resources.getImage("images/rock9.png");
        // // offscreenContext.drawImage(image, previousX, screen.height - image.height, image.width, image.height);
        // // offscreenCanvas.width = previousX;

        // let obstacle = new DecorsGameObject(offscreenCanvas, 0.7, baseSceneSpeed, 1280, new Vec2(screen.width, 0), false);
        // scene.addGameObject(obstacle);

        // Gestion du terrain du niveau proprement dit
        let terrain = new DecorsGameObject(resources.getImage("images/tech_bottom_single.png"), 1, baseSceneSpeed, 1600, new Vec2(screen.width, 672), true);
        scheduler.register(terrain);
        scene.addGameObject(terrain);

        terrain = new DecorsGameObject(resources.getImage("images/tech_bottom_end_left.png"), 1, baseSceneSpeed, 1856, new Vec2(screen.width, 672), true);
        scheduler.register(terrain);
        scene.addGameObject(terrain);

        terrain = new DecorsGameObject(resources.getImage("images/tech_bottom_tile.png"), 1, baseSceneSpeed, 1984, new Vec2(screen.width, 672), true);
        scheduler.register(terrain);
        scene.addGameObject(terrain);

        terrain = new DecorsGameObject(resources.getImage("images/tech_bottom_tile2.png"), 1, baseSceneSpeed, 2240, new Vec2(screen.width, 672), true);
        scheduler.register(terrain);
        scene.addGameObject(terrain);

        terrain = new DecorsGameObject(resources.getImage("images/tech_bottom_tile.png"), 1, baseSceneSpeed, 2496, new Vec2(screen.width, 672), true);
        scheduler.register(terrain);
        scene.addGameObject(terrain);

        terrain = new DecorsGameObject(resources.getImage("images/tech_bottom_end_right.png"), 1, baseSceneSpeed, 2752, new Vec2(screen.width, 672), true);
        scheduler.register(terrain);
        scene.addGameObject(terrain);

        // Gestion du joueur
        let playerShip = GameObjectFactory.createPlayerShip();
        scene.addGameObject(playerShip);

        // Gestion des ennemis
        let starknifeShip = GameObjectFactory.createStarknifeShip(playerShip);

        // // Gestion des vagues d'ennemis
        let wave = new TimeSequenceSpawnerGameObject(starknifeShip, new HorizontalLoopingMoveCommand(starknifeShip, new Vec2(-1, 1), 300, 1), 1280, new Vec2(1280, 36), 1, 16);
        scheduler.register(wave);
        scene.addGameObject(wave);

        // Scene retournée
        return scene;
    }
}