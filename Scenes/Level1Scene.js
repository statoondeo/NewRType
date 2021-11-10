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
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new BigSaucerGameObject(playerShip), 6200, new Vec2(), 1, 1));
        
        // Narration
        let panel = new PanelUIElement(new Vec2(), true);
        panel.addElement(new SpriteUIElement(Level1TitleImage.getInstance()));
        let startableElement = new StartableUIElement(panel, 1280, 1400);
        this.addSynchronizedGameObject(startableElement); 

        // Narration
        panel = new MiniaturePanelUIElement(new SmallPanelUIElement(new Vec2(0, screen.height - SmallPanelUIElement.size.y), true), new UIElementDecorator(new Player1ShipMiniatureGameObject(), true), true);
        panel.addElement(new SpriteUIElement(Level1RareoyArdeas1Image.getInstance()));
        startableElement = new StartableUIElement(panel, 1430, 1600);
        this.addSynchronizedGameObject(startableElement); 
        
        // Narration
        let bigSaucerMiniature = new UIElementDecorator(new BigSaucerMiniatureGameObject(), true);
        panel = new MiniaturePanelUIElement(new VerySmallPanelUIElement(new Vec2(screen.width - StartableVerySmallPanelUIElement.size.x, 0), true), bigSaucerMiniature, true);
        panel.addElement(new SpriteUIElement(Level1BigSaucer1Image.getInstance()));
        startableElement = new StartableUIElement(panel, 1600, 1900);
        this.addSynchronizedGameObject(startableElement); 
     
        // Narration
        panel = new MiniaturePanelUIElement(new VerySmallPanelUIElement(new Vec2(screen.width - StartableVerySmallPanelUIElement.size.x, 0), true), bigSaucerMiniature, true);
        panel.addElement(new SpriteUIElement(Level1BigSaucer2Image.getInstance()));
        startableElement = new StartableUIElement(panel, 6400, 6600);
        this.addSynchronizedGameObject(startableElement); 
    }
}
class Level1RareoyArdeas1Image {
    static createInstance() {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Rareoy Ardeas", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Alors comment ça marche ... ?", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        text = new TextUIElement("On dirait que les flèches permettent", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 310;
        text.draw(context);

        text = new TextUIElement("de diriger ce vaisseau ...", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 340;
        text.draw(context);
        
        text = new TextUIElement("Et que \"W\" permet d'activer le tir!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 400;
        text.draw(context);

        text = new TextUIElement("Voilà, nous sommes prêt au combat!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 480;
        text.draw(context);

        return canvas;
    }

    static instance;

    static getInstance() {
        if (Level1RareoyArdeas1Image.instance == null) {
            Level1RareoyArdeas1Image.instance = Level1RareoyArdeas1Image.createInstance();
        }

        return Level1RareoyArdeas1Image.instance;
    }
}
class Level1TitleImage {
    static createInstance() {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        context.font = "bold 92pt neuropol";
        let width = context.measureText("GUDAÎTURN").width;
        let text = new TextUIElement("GUDAÎTURN", "white", "bold 92pt neuropol");
        text.position.x = (screen.width - width) / 2;
        text.position.y = 300;
        text.draw(context);
        
        let line = text.position;
        let lineWidth = width;

        context.font = "20pt neuropol";
        width = context.measureText("Bastion de Big Saucer").width;
        text = new TextUIElement("Bastion de Big Saucer", "white", "20pt neuropol");
        text.position.x = (screen.width - width) / 2;
        text.position.y = 450;
        text.draw(context);

        context.beginPath();
        context.strokeStyle = "white";
        context.moveTo(line.x, line.y + 130);
        context.lineTo(line.x + lineWidth, line.y + 130);
        context.stroke();

        return canvas;
    }

    static instance;

    static getInstance() {
        if (Level1TitleImage.instance == null) {
            Level1TitleImage.instance = Level1TitleImage.createInstance();
        }

        return Level1TitleImage.instance;
    }
}
class Level1BigSaucer1Image {
    static createInstance() {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Big Saucer", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Et c'est en venant jusqu'ici que tu", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 200;
        text.draw(context);
        
        text = new TextUIElement("penses me faire peur? ... AH AH", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        return canvas;
    }

    static instance;

    static getInstance() {
        if (Level1BigSaucer1Image.instance == null) {
            Level1BigSaucer1Image.instance = Level1BigSaucer1Image.createInstance();
        }

        return Level1BigSaucer1Image.instance;
    }
}
class Level1BigSaucer2Image {
    static createInstance() {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Big Saucer", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Arrrrrrg!!", "white", "bold 18pt neuropol");
        text.position.x = 100;
        text.position.y = 200;
        text.draw(context);
        
        text = new TextUIElement("Faut-il donc tout faire soi-même?", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        return canvas;
    }

    static instance;

    static getInstance() {
        if (Level1BigSaucer2Image.instance == null) {
            Level1BigSaucer2Image.instance = Level1BigSaucer2Image.createInstance();
        }

        return Level1BigSaucer2Image.instance;
    }
}