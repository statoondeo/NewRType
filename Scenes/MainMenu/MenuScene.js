class MenuScene extends BaseScene {
    constructor() {
        super();
    }

    load() {
        super.load();

        let resources = ServiceLocator.getService(ServiceLocator.RESOURCE);
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);

        // Scene de jeu proprement dite
        let baseSpeed = 60;

        // Métronome de la scène
        this.scheduler = new LinearScheduler(baseSpeed);

        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        this.addGameObject(new BlackStaticBackgroundGameObject());

        // La background principal
        this.addGameObject(new RollingLayer(0.1, baseSpeed, resources.getImage("Images/gas2.png"), new Vec2(-1, 0)));

        // Le joueur est remplacé par une bille orange
        let playerShip = new CircleShape("orangered", new Vec2(6));
        playerShip.collideBox = new CircleCollideBox(playerShip.position, 3);
        playerShip.moveStrategy = new MouseControlledMoveStrategy(playerShip);
        playerShip.partition = GameObjectPartition.PLAYER_PARTITION;
        this.addPlayerShip(playerShip);

        // Big Saucer met l'ambia,ce dans la scène
        let bigSaucer = new BigSaucerGameObject(playerShip, new TimedCubeGameObject(playerShip));
        bigSaucer.moveStrategy = new BezierApexMoveStrategy(bigSaucer, new BigSaucerFinalApex(bigSaucer.size)); 
        this.addGameObject(bigSaucer);

        // Panneau principal
        let mainPanel = new BigPanelUIElement(new Vec2(), false);
        mainPanel.addElement(new SpriteUIElement(MainMenuPanelImage.getInstance()));
        this.addGameObject(mainPanel);

        // Dialogue de Big Saucer
        let panel1 = new DelayableSmallPanelUIElement(new BigSaucerMiniatureGameObject(), new Vec2(screen.width - SmallPanelUIElement.size.x, 0), false, 1);
        panel1.addElement(new SpriteUIElement(MainMenuBigSaucerImage.getInstance()));
        this.addGameObject(panel1);

        // Dialogue de Rareoy Ardeas
        let panel2 = new DelayableSmallPanelUIElement(new Player1ShipMiniatureGameObject(), new Vec2(0, screen.height - SmallPanelUIElement.size.x), false, 4);
        panel2.addElement(new SpriteUIElement(MainMenuRareoyArdeasImage.getInstance()));
        this.addGameObject(panel2);

        // Pour commencer à jouer
        let button = new ButtonUIElement("Jouer", new PlayCommand(mainPanel, panel1, panel2));
        button.position.x = (screen.width - ButtonUIElement.size.x) / 2;
        button.position.y = screen.height * 0.75;
        mainPanel.addElement(button);

        // Début réél du jeu
        button = new ButtonUIElement("Allons-y ...", new Play2Command(panel1, panel2));
        button.position.x = (SmallPanelUIElement.size.x - ButtonUIElement.size.x) / 2
        button.position.y = SmallPanelUIElement.size.y * 0.6;
        panel2.addElement(button);

        // On commence la scène avec l'affichage du panneau principal
        mainPanel.show();
    }
}
class PlayCommand extends BaseCommand {
    constructor(mainPanel, startablePanel1, startablePanel2) {
        super();
        this.panel = mainPanel;
        this.startablePanel1 = startablePanel1;
        this.startablePanel2 = startablePanel2;
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.panel.hide();
            this.startablePanel1.show();
            this.startablePanel2.show();
        }
    }
}
class Play2Command extends BaseCommand {
    constructor(bigSaucerPanel, rareoyArdeasPanel) {
        super();
        this.bigSaucerPanel = bigSaucerPanel;
        this.rareoyArdeasPanel = rareoyArdeasPanel;
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.bigSaucerPanel.hide();
            this.rareoyArdeasPanel.hide();
            ServiceLocator.getService(ServiceLocator.SCENE).setCurrent("LEVEL1");
        }
    }
}
