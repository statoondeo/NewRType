class Level1Scene extends BaseScene {
    constructor() {
        super()
    }

    load() {
        super.load();

        let resources = Services.get(Services.ASSET);
        let screen = Services.get(Services.SCREEN);

        // Scene de jeu proprement dite
        let baseSpeed = 120;

        // Métronome
        this.scheduler = new LinearScheduler(baseSpeed, screen.width);
        
        // Gestion du joueur
        let playerShip = new Player1ShipGameObject(new Vec2((screen.width - PlayerShipGameObject.size.x) / 2, (screen.height - PlayerShipGameObject.size.y) / 2));
        this.addPlayerShip(playerShip);

        // On ajoute le HUD
        let hud = new HUDPanelUIElement(playerShip, new Vec2(), false);
        hud = new MiniaturePanelUIElementDecorator(hud, new UIElementDecorator(new Player1ShipMiniatureGameObject()));
        hud = new StartableUIElementDecorator(hud, 2000);
        this.addSynchronizedGameObject(hud); 

        // Ecran de défaite
        let defeatPanel = new BigPanelUIElement(new Vec2(), false);
        defeatPanel.addElement(new SpriteUIElement(Level1DefeatedImage.getInstance()));
        let button = new ButtonUIElement("Rejouer", new SwitchSceneCommand(this, "LEVEL1"));
        button.position.x = (screen.width - 2 * ButtonUIElement.size.x) / 3;
        button.position.y = screen.height * 0.75;
        defeatPanel.addElement(button);
        button = new ButtonUIElement("Menu", new SwitchSceneCommand(this, "MENU"));
        button.position.x = 2 * (screen.width - 2 * ButtonUIElement.size.x) / 3 + ButtonUIElement.size.x;
        button.position.y = screen.height * 0.75;
        defeatPanel.addElement(button);
        defeatPanel.addElement(new SpriteUIElement(Level1DefeatedImage.getInstance()));
        let bigSaucerSprite = new UIElementDecorator(BigSaucerGameObject.getAnimatedSprite());
        bigSaucerSprite.position.x = (screen.width - BigSaucerGameObject.size.x) / 2;
        bigSaucerSprite.position.y = screen.height * 0.15;
        defeatPanel.addElement(bigSaucerSprite);
        defeatPanel = new DelayablePanelUIElementDecorator(defeatPanel, 0.25);
        this.addGameObject(defeatPanel);

        // En cas de mort du joueur
        playerShip.dieCommand.addCommand(new HidePlayerCommand(playerShip));
        playerShip.dieCommand.addCommand(new HidePanelCommand(hud));
        playerShip.dieCommand.addCommand(new ShowPanelCommand(defeatPanel));
        playerShip.dieCommand.addCommand(new PurgePartitionCommand(this.gameObjectsPartitions[GameObjectPartition.GAME_PARTITION]));
        playerShip.dieCommand.addCommand(new StopSchedulerCommand(playerShip, this.scheduler));

        // On enregistre les controles à utiliser
        let inputListener = Services.get(Services.INPUT);
        inputListener.clearCommands();
        inputListener.registerCommand("ArrowUp", new MoveCommand(this.playerShip, new Vec2(0, -1)));
        inputListener.registerCommand("ArrowDown", new MoveCommand(this.playerShip, new Vec2(0, 1)));
        inputListener.registerCommand("ArrowLeft", new MoveCommand(this.playerShip, new Vec2(-1, 0)));
        inputListener.registerCommand("ArrowRight", new MoveCommand(this.playerShip, new Vec2(1, 0)));
        inputListener.registerCommand("Escape", new SwitchSceneCommand(this, "MENU"));
        inputListener.registerCommand("KeyZ", new FireActionCommand(this.playerShip));


        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        this.addGameObject(new BlackStaticBackgroundGameObject());

        // La background principal
        this.addGameObject(new RollingLayer(0.2, baseSpeed, Services.get(Services.ASSET).getImage("Images/background1.png"), new Vec2(-1, 0)));

        // Eléments de décor qui ne vont passer qu'une fois
        this.addSynchronizedGameObject(new OnceLayer(0.3, baseSpeed, resources.getImage("Images/station.png"), 2000, new Vec2(-1, 0)));
        this.addSynchronizedGameObject(new OnceLayer(0.3, baseSpeed, resources.getImage("Images/background2.png"), 8000, new Vec2(-1, 0)));
        this.addSynchronizedGameObject(new OnceLayer(0.5, baseSpeed, resources.getImage("Images/background3.png"), 10000, new Vec2(-1, 0)));

        // Ajout d'obstacles        
        let rockyDecorImage = new RockyDecorImage();
        this.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, screen.width, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));
        this.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, 11000, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));

        // On retourne le décor rocheux pour l'utiliser dans la scène
        this.addSynchronizedGameObject(new DecorsGameObject(ImageHandler.flipImage(rockyDecorImage.image, new Vec2(-1)), 0.9, baseSpeed, 6150, new Vec2(screen.width, 0), false));

        // Gestion des vagues
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 2000, new Vec2(screen.width, screen.height / 5),  1, 8));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 2700, new Vec2(screen.width, 2 * screen.height / 5),  1, 10));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 3200, new Vec2(screen.width, 3 * screen.height / 5),  1, 12));

        // Gestion des bonus
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new SpeedPowerUpGameObject(this.playerShip), 3900, new Vec2(screen.width, (screen.height - SpeedPowerUpGameObject.size.y) / 2), 1, 1));

        // Vagues suivantes
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new WobblerGameObject(playerShip), 4300, new Vec2(-WobblerGameObject.size.x, (screen.height - WobblerGameObject.size.y) / 3), 1, 14));
        this.addSynchronizedGameObject(new AllInCircleSpawnerGameObject(new StarknifeGameObject(), new Vec2(2 * (screen.width - StarknifeGameObject.size.x) / 3, (screen.height - StarknifeGameObject.size.y) / 2), 16, 5800));

        // Boss
        // Ecran de victoire
        let victoryPanel = new BigPanelUIElement(new Vec2(), false);
        victoryPanel.addElement(new SpriteUIElement(Level1VictoryImage.getInstance()));
        button = new ButtonUIElement("Menu", new SwitchSceneCommand(this, "MENU"));
        button.position.x = (screen.width - 2 * ButtonUIElement.size.x) / 3;
        button.position.y = screen.height * 0.75;
        victoryPanel.addElement(button);
        button = new ButtonUIElement("Continuer", new SwitchSceneCommand(this, "MENU"));
        button.position.x = 2 * (screen.width - 2 * ButtonUIElement.size.x) / 3 + ButtonUIElement.size.x;
        button.position.y = screen.height * 0.75;
        victoryPanel.addElement(button);
        let klawSprite = new UIElementDecorator(KlawGameObject.getAnimatedSprite());
        klawSprite.position.x = (screen.width - KlawGameObject.size.x) / 2;
        klawSprite.position.y = screen.height * 0.1;
        victoryPanel.addElement(klawSprite);
        victoryPanel = new DelayablePanelUIElementDecorator(victoryPanel, 0.25);
        this.addGameObject(victoryPanel);

        let bigSaucer = new BigSaucerGameObject(playerShip);
        bigSaucer.moveStrategy = new BezierApexMoveStrategy(bigSaucer, new BigSaucerFinalApex(bigSaucer.size)); 
        bigSaucer.dieCommand.addCommand(new HidePanelCommand(hud));
        bigSaucer.dieCommand.addCommand(new HidePanelCommand(bigSaucer.bossHud));
        bigSaucer.dieCommand.addCommand(new ShowPanelCommand(victoryPanel));
        bigSaucer.dieCommand.addCommand(new PurgePartitionCommand(this.gameObjectsPartitions[GameObjectPartition.GAME_PARTITION]));
        bigSaucer.dieCommand.addCommand(new StopSchedulerCommand(playerShip, this.scheduler));

        this.addSynchronizedGameObject(new OnceSpawnerGameObject(bigSaucer, 6800, new Vec2()));

        // Narration
        let panel = new PanelUIElement(new Vec2(), true);
        panel.addElement(new SpriteUIElement(Level1TitleImage.getInstance()));
        let startableElement = new StartableUIElementDecorator(panel, 1280, 1400);
        this.addSynchronizedGameObject(startableElement); 

        // Narration
        panel = new SmallPanelUIElement(new Vec2(0, screen.height - SmallPanelUIElement.size.y), false);
        panel.addElement(new SpriteUIElement(Level1RareoyArdeas1Image.getInstance()));
        panel = new MiniaturePanelUIElementDecorator(panel, new UIElementDecorator(new Player1ShipMiniatureGameObject()));
        panel = new StartableUIElementDecorator(panel, 1430, 1800);
        this.addSynchronizedGameObject(panel); 

        // Narration
        let bigSaucerMiniature = new UIElementDecorator(new BigSaucerMiniatureGameObject(), true);
        panel = new VerySmallPanelUIElement(new Vec2(screen.width - VerySmallPanelUIElement.size.x, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer1Image.getInstance()));
        panel = new MiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 1700, 2000);
        this.addSynchronizedGameObject(panel); 
        
        // Narration
        panel = new VerySmallPanelUIElement(new Vec2(screen.width - VerySmallPanelUIElement.size.x, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer2Image.getInstance()));
        panel = new MiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 6400, 6600);
        this.addSynchronizedGameObject(panel); 

        this.show();
    }
}
