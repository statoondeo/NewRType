class MenuScene extends BaseScene {
    constructor() {
        super();
    }

    load(start) {
        super.load();

        let resources = Services.get("ASSET");
        let screen = Services.get("SCREEN");

        // Scene de jeu proprement dite
        let baseSpeed = 60;

        // Métronome de la scène
        this.scheduler = new LinearScheduler(baseSpeed);

        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        this.addGameObject(new BlackStaticBackgroundGameObject());

        // La background principal
        this.addGameObject(new RollingLayer(0.1, baseSpeed, resources.get("Images/gas2.png"), new Vec2(-1, 0)));

        // Le joueur est remplacé par une bille orange
        let playerShip = new CircleShape("orangered", new Vec2(6));
        playerShip.collideBox = new CircleCollideBox(playerShip.position, 3);
        playerShip.moveStrategy = new MouseControlledMoveStrategy(playerShip);
        playerShip.partition = "PLAYER_PARTITION";
        this.addPlayerShip(playerShip);

        this.camShake = new CamShake(playerShip);

        // Big Saucer met l'ambiance dans la scène
        let bigSaucer = new BigSaucerGameObject(playerShip, new TimedCubeGameObject(playerShip));
        bigSaucer.moveStrategy = new BezierApexMoveStrategy(bigSaucer, new BigSaucerFinalApex(bigSaucer.size)); 
        bigSaucer.bossHud = new UIElement();
        this.addGameObject(bigSaucer);

        // Panneau principal
        let mainPanel = new BigPanelUIElement(new Vec2(), false);
        mainPanel.addElement(new SpriteUIElement(MainMenuPanelImage.createInstance()));
        this.addGameObject(mainPanel);

        // Dialogue de Big Saucer
        let panel1 = new RedSmallPanelUIElement(new Vec2(screen.width - 619, 0), false);
        panel1.addElement(new SpriteUIElement(MainMenuBigSaucerImage.createInstance()));
        panel1 = new RedMiniaturePanelUIElementDecorator(panel1, new UIElementDecorator(new BigSaucerMiniatureGameObject()));
        panel1 = new DelayablePanelUIElementDecorator(panel1, 1);
        this.addGameObject(panel1);

        // Dialogue de Rareoy Ardeas
        let panel2 = new SmallPanelUIElement(new Vec2(0, screen.height - 619), false);
        panel2.addElement(new SpriteUIElement(MainMenuRareoyArdeasImage.createInstance()));
        panel2 = new MiniaturePanelUIElementDecorator(panel2, new UIElementDecorator(new Player1ShipMiniatureGameObject()));
        panel2 = new DelayablePanelUIElementDecorator(panel2, 2.5);
        this.addGameObject(panel2);

        // Pour commencer à jouer
        let button = new ButtonUIElement("Jouer", new PlayCommand(mainPanel, panel1, panel2));
        button.position.x = (screen.width - 321) / 2;
        button.position.y = screen.height * 0.75;
        mainPanel.addElement(button);

        // Début réél du jeu
        button = new ButtonUIElement("Allons-y ...", new SwitchSceneCommand(this, "LEVEL1", 1280));
        button.position.x = (619 - 321) / 2
        button.position.y = 614 * 0.6;
        panel2.addElement(button);

        // Démarrage de la musique
        this.music = resources.get("Musics/bensound-highoctane.mp3");

        // On commence la scène avec l'affichage du panneau principal
        mainPanel.show();

        // On affiche la scène
        this.show();
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
