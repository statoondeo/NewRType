class StarknifeGameObject extends AnimatedSprite {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/starknife.png"), new Vec2(64))
        this.partition = GameObjectPartition.GAME_PARTITION;
        this.status = GameObjectState.ACTIVE;
        this.speed = 100;
        this.collideBox = new CircleCollideBox(this.position, 0.8 * this.size.x / 2);
        this.layer = 1;
        this.behaveStrategy = new BaseBehaveStrategy(this, new SinWaveMoveStrategy(this, new Vec2(-1, 0), 300), new BaseFireStrategy(this));
        this.behaveStrategy.fireCommand = new EnemyFireCommand(this, new RedBulletGameObject(this.partition), 3);
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
    }

    static size = new Vec2(64);
}

