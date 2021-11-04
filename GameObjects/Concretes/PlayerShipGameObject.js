class PlayerShipGameObject extends AnimatedSprite {
    constructor(image, tile, initialPosition) {
        super(image, tile)
        this.speed = 200;
        this.collideBox = new CircleCollideBox(this.position, 0.8 * this.size.x / 2);
        this.layer = 1;
        this.partition = GameObjectPartition.PLAYER_PARTITION;
        this.behaveStrategy = new PlayerControlledBehaveStrategy(this);
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.position.x = initialPosition.x;
        this.position.y = initialPosition.y;
    }
    
    static size = new Vec2(64);
}
