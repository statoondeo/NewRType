class BulletGameObject extends AnimatedSprite {
    constructor(image, size, partition) {
        super(image, size)
        this.partition = partition;
        this.status = GameObjectState.ACTIVE;
        this.speed = 400;
        this.collideBox = new CircleCollideBox(this.position, 0.8 * this.size.x / 2);
        this.layer = 1;
        this.behaveStrategy = new BaseBehaveStrategy(this, new UniformMoveStrategy(this, new Vec2(1, 0)), new BaseFireStrategy(this));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
}

