class SpeedUpGameObject extends AnimatedSprite {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/speedup.png"), new Vec2(64))
        this.collideBox = new CircleCollideBox(this.position, 0.8 * this.size.x / 2);
        this.layer = 1;
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
}
