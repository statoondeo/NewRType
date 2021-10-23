class ShipFactory {
    static createRedEnemyShip(initialVector) {
        return new Ship(
                    new RectangleSprite("Red", new Vec2(), new Vec2(14, 12)), 
                    new HorizontalLoopingMovePattern(10, initialVector, 45, 3, new Vec2(12, 12)));       
    }
    
    static createGreenEnemyShip() {
        return new Ship(
                new RectangleSprite("Green", new Vec2(), new Vec2(16, 12)), 
                new UniformMovePattern(new Vec2(-32, 20)));     
    }
        
    static createPlayerShip() {;
        let mainScreen = ServiceLocator.getService(ServiceLocator.SCREEN);

        let playerSprite = new RectangleSprite("Blue", new Vec2(), new Vec2(20, 12))
        let size = playerSprite.getSize();
        playerSprite.setPosition(new Vec2((mainScreen.width - size.x) / 2, (mainScreen.height - size.y) / 2));
        return new Ship(playerSprite, new PlayerControlledMovePattern(100));  
    }
}