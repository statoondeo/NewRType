class GameObjectFactory {
    static createStarknifeShip() {
        // Services nécessaires
        let mainScreen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let resourceService = ServiceLocator.getService(ServiceLocator.RESOURCE);

        let sprite = new AnimatedSprite(resourceService.getImage("images/starknife.png"), new Vec2(64, 64));
        sprite.collideBox = new CircleCollideBox(sprite.position, sprite.size.x / 2)
        sprite.speed = 200;
        sprite.layer = 1;
        sprite.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        sprite.startAnimation("IDLE", 0);
        
        return sprite;       
    }
            
    static createPlayerShip() {
        // Services nécessaires
        let mainScreen = ServiceLocator.getService(ServiceLocator.SCREEN);
        let resourceService = ServiceLocator.getService(ServiceLocator.RESOURCE);

        // // Avec un placeholder
        // let playerSprite = new Sprite(new ShapeVisual("LightBlue", new Vec2(64, 64))); 

        // // Avec une image fixe
        // let playerSprite = new Sprite(new ImageVisual(resourceService.getImage("images/player2.png")));

        // Avec une tilesheet d'animation
        let playerShip = new AnimatedSprite(resourceService.getImage("images/player1.png"), new Vec2(64, 64));
        playerShip.position = new Vec2((mainScreen.width - playerShip.size.x) / 2, (mainScreen.height - playerShip.size.y) / 2);
        playerShip.collideBox = new CircleCollideBox(playerShip.position, playerShip.size.x / 2)
        playerShip.speed = 200;
        playerShip.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        playerShip.startAnimation("IDLE", 0);


        // Vaisseau controlé par le joueur
        playerShip.moveCommand = new PlayerControlledMoveCommand(playerShip);
        playerShip.layer = 1;

        // Tir de base
        playerShip.fireCommand = new SampleFireCommand(playerShip, 0.05);

        // retour de la game entity ainsi créée
        return playerShip;  
    }
}