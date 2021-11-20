class Player2ShipGameObject extends PlayerShipGameObject {
    constructor(initialPosition) {
        super(Services.get("ASSET").get("Images/player2.png"), new Vec2(64), initialPosition)
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 100 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
                        
    getClone() {
        return new Player2ShipGameObject(initialPosition.getClone());
    }
}
