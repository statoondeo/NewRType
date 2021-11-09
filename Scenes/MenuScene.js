class MenuScene extends BaseScene {
    constructor(scheduler) {
        super(scheduler)
    }

    static createInstance() {
        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);

        // Scene de jeu proprement dite
        let baseSpeed = 60;

        // Scène proprement dite et son métronome
        let scene = new MenuScene(new DummyScheduler());

        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        scene.addGameObject(new BlackStaticBackgroundGameObject());

        // La background principal
        scene.addGameObject(new RollingLayer(0.1, baseSpeed, resources.getImage("images/gas2.png"), new Vec2(-1, 0)));

        let playerShip = new CircleShape("orangered", new Vec2(6));
        playerShip.collideBox = new CircleCollideBox(playerShip.position, 3);
        playerShip.moveStrategy = new MouseControlledMoveStrategy(playerShip);
        scene.addGameObject(playerShip);

        let bigSaucer = new BigSaucerGameObject(playerShip, new TimedCubeGameObject(playerShip));
        bigSaucer.moveStrategy = new BezierApexMoveStrategy(bigSaucer, new BigSaucerFinalApex(bigSaucer.size)); 
        scene.addGameObject(bigSaucer);

        scene.addGameObject(new PanelUIElement());

        let baseAxe = 200;
        let text = new TextUIElement("Raphael DUCHOSSOY (Gamecodeur.fr)", "white", "bold 26pt neuropol");
        text.position.x = baseAxe; //(screen.width - text.size.x) / 2;
        text.position.y = screen.height * 0.25;
        scene.addGameObject(text);

        text = new TextUIElement("SPACE", "white", "bold 148pt neuropol");
        text.position.x = baseAxe; //(screen.width - text.size.x) / 2;
        text.position.y = screen.height * 0.3;
        scene.addGameObject(text);

        text = new TextUIElement("Battle Ships", "white", "bold 84pt neuropol");
        text.position.x = baseAxe; //(screen.width - text.size.x) / 2;
        text.position.y = screen.height * 0.5;
        scene.addGameObject(text);

        text = new TextUIElement("Pour la survie de la terre face aux envahisseurs Alienoïdes, qui veulent la conquérir depuis des années ...", "white", "9.5pt neuropol");
        text.position.x = baseAxe; //(screen.width - text.size.x) / 2;
        text.position.y = screen.height * 0.65;
        scene.addGameObject(text);

        let button = new ButtonUIElement("Jouer");
        button.position.x = (screen.width - button.sprite.size.x) / 2;
        button.position.y = screen.height * 0.75;
        scene.addGameObject(button);

        // Scene complète
        return scene;
    }
}