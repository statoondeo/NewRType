class Player2ShipGameObject extends PlayerShipGameObject {
    constructor(initialPosition) {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/player2.png"), new Vec2(64), initialPosition)
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 100 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
                        
    getClone() {
        return new Player2ShipGameObject(initialPosition.getClone());
    }
}
