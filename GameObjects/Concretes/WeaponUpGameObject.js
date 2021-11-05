class WeaponUpGameObject extends AnimatedSprite {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/powerup.png"), new Vec2(64));
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.layer = 1;
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 80 / 1000, true));
        this.startAnimation("IDLE", 0);
    }

    static size = new Vec2(64);
}
