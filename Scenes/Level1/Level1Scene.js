class Level1Scene extends BaseScene {
    constructor() {
        super()
    }

    load(start) {
        super.load(start);

        let resources = Services.get(Services.ASSET);
        let screen = Services.get(Services.SCREEN);

        // Scene de jeu proprement dite
        let baseSpeed = 120;

        // Métronome
        this.scheduler = new LinearScheduler(baseSpeed, start == null || start == 0 ? screen.width : start);

        // Gestion du joueur
        let playerShip = new Player1ShipGameObject(new Vec2((screen.width - PlayerShipGameObject.size.x) / 4, (screen.height - PlayerShipGameObject.size.y) / 2));
        // playerShip.invincible = true;
        this.addPlayerShip(playerShip);
        this.addGameObject(playerShip.flashLayer);
        this.camShake = new CamShake(playerShip);

        // On ajoute le HUD
        let hud = new HUDPanelUIElement(playerShip, new Vec2(), false);
        playerShip.hud = hud;
        hud = new MiniaturePanelUIElementDecorator(hud, new UIElementDecorator(new Player1ShipMiniatureGameObject()));
        hud = new StartableUIElementDecorator(hud, 2400);
        this.addSynchronizedGameObject(hud); 

        // Ecran de défaite
        let defeatPanel = new RedBigPanelUIElement(new Vec2(), false);
        defeatPanel.addElement(new SpriteUIElement(Level1DefeatedImage.getInstance()));
        let button = new ButtonUIElement("Rejouer", new SwitchSceneCommand(this, "LEVEL1", 2101));
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
        defeatPanel = new DelayablePanelUIElementDecorator(defeatPanel, 0.5);
        this.addGameObject(defeatPanel);

        // En cas de mort du joueur
        playerShip.dieCommand.addCommand(new HidePlayerCommand(playerShip));
        playerShip.dieCommand.addCommand(new HidePanelCommand(hud));
        playerShip.dieCommand.addCommand(new ShowPanelCommand(defeatPanel));
        playerShip.dieCommand.addCommand(new PurgePartitionCommand(this.gameObjectsPartitions[GameObjectPartition.GAME_PARTITION]));
        playerShip.dieCommand.addCommand(new StopSchedulerCommand(playerShip, this.scheduler));
        playerShip.dieCommand.addCommand(new SwitchMusicCommand(this, resources.get("Musics/alexander-nakarada-loss.mp3")));

        // assetLoader.add(AssetLoader.SOUND, "Musics/alexander-nakarada-loss.mp3");
        // assetLoader.add(AssetLoader.SOUND, "Musics/alexander-nakarada-we-are-victorious-finale.mp3");

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
        this.addGameObject(new RollingLayer(0.2, baseSpeed, Services.get(Services.ASSET).get("Images/background1.png"), new Vec2(-1, 0)));

        // Eléments de décor qui ne vont passer qu'une fois
        this.addSynchronizedGameObject(new OnceLayer(0.3, baseSpeed, resources.get("Images/station.png"), 2000, new Vec2(-1, 0)));
        this.addSynchronizedGameObject(new OnceLayer(0.3, baseSpeed, resources.get("Images/background2.png"), 8000, new Vec2(-1, 0)));
        this.addSynchronizedGameObject(new OnceLayer(0.5, baseSpeed, resources.get("Images/background3.png"), 10000, new Vec2(-1, 0)));

        // Ajout d'obstacles        
        let rockyDecorImage = new RockyDecorImage();
        this.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, screen.width, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));
        this.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, 11000, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));

        // On retourne le décor rocheux pour l'utiliser dans la scène
        this.addSynchronizedGameObject(new DecorsGameObject(ImageHandler.flipImage(rockyDecorImage.image, new Vec2(-1)), 0.9, baseSpeed, 6150, new Vec2(screen.width, 0), false));

        // Obstacle de 1er plan
        // this.addSynchronizedGameObject(new DecorsGameObject(Soil1DecorImage.getInstance(), 2, baseSpeed, 5000, new Vec2(screen.width, screen.height - Soil1DecorImage.getInstance().height), true));

        // Déroulement de la scène

        // Narration : Titre du niveau
        let panel = new PanelUIElement(new Vec2(), true);
        panel.addElement(new SpriteUIElement(Level1TitleImage.getInstance()));
        let startableElement = new DelayablePanelUIElementDecorator(panel, 1, 3);
        startableElement.show();
        this.addGameObject(startableElement); 

        // Narration : Commandes de jeu
        panel = new SmallPanelUIElement(new Vec2(0, screen.height - SmallPanelUIElement.size.y), false);
        panel.addElement(new SpriteUIElement(Level1RareoyArdeas1Image.getInstance()));
        panel = new MiniaturePanelUIElementDecorator(panel, new UIElementDecorator(new Player1ShipMiniatureGameObject()));
        panel = new StartableUIElementDecorator(panel, 1780, 2100);
        this.addSynchronizedGameObject(panel); 

        // Narration : Big Saucer
        let bigSaucerMiniature = new UIElementDecorator(new BigSaucerMiniatureGameObject(), true);
        panel = new RedVerySmallPanelUIElement(new Vec2(screen.width - VerySmallPanelUIElement.size.x, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer1Image.getInstance()));
        panel = new RedMiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 2120, 2360);
        this.addSynchronizedGameObject(panel); 

        // Gestion des vagues
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 2400, new Vec2(screen.width, screen.height / 7), 0.3, 6));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 2700, new Vec2(screen.width, 2 * screen.height / 7),  0.4, 7));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 2900, new Vec2(screen.width, 3 * screen.height / 7),  0.5, 8));

        // // Gestion des bonus
        this.addSynchronizedGameObject(new OnceSpawnerGameObject(new SpeedPowerUpGameObject(this.playerShip), 3400, new Vec2(screen.width, (screen.height - SpeedPowerUpGameObject.size.y) / 2)));

        // Vagues suivantes
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new WobblerGameObject(playerShip), 4000, new Vec2(-WobblerGameObject.size.x), 0.4, 10));

        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 4900, new Vec2(screen.width, 3 * screen.height / 7), 0.4, 8));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 5200, new Vec2(screen.width, 2 * screen.height / 7),  0.35, 10));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 5400, new Vec2(screen.width, screen.height / 7),  0.3, 12));

        // Narration : Big Saucer
        panel = new RedVerySmallPanelUIElement(new Vec2(screen.width - VerySmallPanelUIElement.size.x, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer2Image.getInstance()));
        panel = new RedMiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 6100, 6500);
        this.addSynchronizedGameObject(panel); 
        
        // Passage de Big Saucer
        let bigSaucer = new BigSaucerGameObject(playerShip);
        this.addSynchronizedGameObject(new OnceSpawnerGameObject(bigSaucer, 6600, new Vec2(), Services.get(Services.ASSET).get("Sounds/Tense_01_wav.wav")));
        this.addGameObject(bigSaucer.flashLayer);

        // Narration : Big Saucer
        panel = new RedVerySmallPanelUIElement(new Vec2(screen.width - VerySmallPanelUIElement.size.x, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer3Image.getInstance()));
        panel = new RedMiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 10000, 10400);
        this.addSynchronizedGameObject(panel); 

        // Gestion des vagues
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 10500, new Vec2(screen.width, screen.height / 7), 0.3, 10));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 10700, new Vec2(screen.width, 2 * screen.height / 7),  0.4, 12));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 11000, new Vec2(screen.width, 3 * screen.height / 7),  0.3, 14));

        // // Gestion des bonus
        this.addSynchronizedGameObject(new OnceSpawnerGameObject(new SpeedPowerUpGameObject(this.playerShip), 11500, new Vec2(screen.width, (screen.height - SpeedPowerUpGameObject.size.y) / 2)));

        let mainCurve = new CompositeCurve();
        let curve = new CompositeCurve(true, 2);
        curve.addCurve(new BezierCurve(5, [ new Vec2(640, 400), new Vec2(640, 736), new Vec2(304, 736), new Vec2(304, 400) ]));
        curve.addCurve(new BezierCurve(5, [ new Vec2(304, 400), new Vec2(304, 64), new Vec2(640, 64), new Vec2(640, 400) ]));
        mainCurve.addCurve(curve);
        mainCurve.addCurve(new BezierCurve(5, [ new Vec2(640, 400), new Vec2(640, 736), new Vec2(-128, 736) ]));
        let ship = new AtomGameObject();
        let moveStrategy = new BezierApexMoveStrategy(ship, mainCurve);
        ship.moveStrategy = moveStrategy;
        this.addSynchronizedGameObject(new AllInCircleSpawnerGameObject(ship, new Vec2(2 * (screen.width - AtomGameObject.size.x) / 3, (screen.height - AtomGameObject.size.y) / 2), 12, 12000));

        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 15500, new Vec2(screen.width, 3 * screen.height / 7), 0.25, 14));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 15650, new Vec2(screen.width, 2 * screen.height / 7),  0.5, 16));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(), 15800, new Vec2(screen.width, screen.height / 7), 0.25, 18));
       
        // Narration
        panel = new RedVerySmallPanelUIElement(new Vec2(screen.width - VerySmallPanelUIElement.size.x, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer4Image.getInstance()));
        panel = new RedMiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 17000, 17600);
        this.addSynchronizedGameObject(panel); 

        // // Boss
        // Ecran de victoire
        let victoryPanel = new BlueBigPanelUIElement(new Vec2(), false);
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
        victoryPanel = new DelayablePanelUIElementDecorator(victoryPanel, 0.5);
        this.addGameObject(victoryPanel);

        bigSaucer = new BigSaucerGameObject(playerShip);
        bigSaucer.moveStrategy = new BezierApexMoveStrategy(bigSaucer, new BigSaucerFinalApex(bigSaucer.size)); 
        bigSaucer.dieCommand.addCommand(new HidePanelCommand(hud));
        bigSaucer.dieCommand.addCommand(new HidePanelCommand(bigSaucer.bossHud));
        bigSaucer.dieCommand.addCommand(new ShowPanelCommand(victoryPanel));
        bigSaucer.dieCommand.addCommand(new PurgePartitionCommand(this.gameObjectsPartitions[GameObjectPartition.GAME_PARTITION]));
        bigSaucer.dieCommand.addCommand(new StopSchedulerCommand(playerShip, this.scheduler));
        bigSaucer.dieCommand.addCommand(new SwitchMusicCommand(this, resources.get("Musics/alexander-nakarada-we-are-victorious-finale.mp3")));

        this.addSynchronizedGameObject(new OnceSpawnerGameObject(bigSaucer, 17700, new Vec2(), Services.get(Services.ASSET).get("Sounds/Tense_01_wav.wav")));
        this.addGameObject(bigSaucer.flashLayer);
 
        // // Démarrage de la musique
        this.music = Services.get(Services.ASSET).get("Musics/bensound-scifi.mp3");

        this.show();
    }
}
