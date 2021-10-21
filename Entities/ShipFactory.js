class ShipFactory {
    static createRedEnemyShip(imageLoader, mainScreen) {
        return new Ship(
                    new RectangleSprite("Red", new Vec2(), new Vec2(12, 12)), 
                    new HorizontalLoopingMovePattern(mainScreen, 10, 0.5, 0.5, new Vec2(-1, -1), new Vec2(12, 12)));       
    }
    
    static createGreenEnemyShip(imageLoader, mainScreen) {
        return new Ship(
                new RectangleSprite("Green", new Vec2(), new Vec2(12, 12)), 
                new UniformMovePattern(new Vec2(-32, 20)));     
    }
        
    static createPlayerShip(imageLoader, mainScreen, keyListener) {
        let playerSprite = new Sprite(imageLoader.getImage("images/player.png", new Vec2(mainScreen.width / 2, mainScreen.height / 2)));
        playerSprite.setTileSheet(new Vec2(30, 16));
        let size = playerSprite.getSize();
        playerSprite.currentFrame = 9;
        playerSprite.setPosition(new Vec2((mainScreen.width - size.x) / 2, (mainScreen.height - size.y) / 2));
        return new Ship(playerSprite, new PlayerControlledMovePattern(keyListener, 100));  
    }
}