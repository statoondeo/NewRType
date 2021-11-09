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
        this.addPlayerShip(playerShip);

        // Big Saucer met l'ambia,ce dans la scène
        let bigSaucer = new BigSaucerGameObject(playerShip, new TimedCubeGameObject(playerShip));
        bigSaucer.moveStrategy = new BezierApexMoveStrategy(bigSaucer, new BigSaucerFinalApex(bigSaucer.size)); 
        this.addGameObject(bigSaucer);

        // Panneau principal
        let mainPanel = new BigPanelUIElement(new Vec2(), MainMenuPanelImage.getInstance(), false);
        this.addGameObject(mainPanel);

        // Pour commencer à jouer
        let button = new ButtonUIElement("Jouer", new PlayCommand(mainPanel));
        button.position.x = (screen.width - ButtonUIElement.size.x) / 2;
        button.position.y = screen.height * 0.75;
        mainPanel.addElement(button);

        // Dialogue de Big Saucer
        let panel1 = new BigSaucerSmallPanelUIElement(new Vec2(screen.width - SmallPanelUIElement.size.x, 0), false, mainPanel);
        this.addGameObject(panel1);

        // Dialogue de Rareoy Ardeas
        let panel2 = new RareoyArdeasSmallPanelUIElement(new Vec2(0, screen.height - SmallPanelUIElement.size.x), false, panel1);
        this.addGameObject(panel2);

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
    constructor(mainPanel) {
        super();
        this.panel = mainPanel;
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.panel.hide();
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
