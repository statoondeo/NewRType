class WobblerGameObject extends EnemyShipGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/wobbler.png"), new Vec2(64), 600, 150);
        this.behaveStrategy = new BaseBehaveStrategy(this, new SinWaveMoveStrategy(this, new Vec2(-1, 0), 100), new BaseFireStrategy(this));
        this.behaveStrategy.fireCommand = new AsapFireCommand(new PlayerAimedFireCommand(new FireCommand(this, new GreenBulletGameObject(this.partition, new Vec2(-1, 0)), new Vec2(), 2)));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.dieCommand = new PopAndDieCommand(this, new GreenExplosionGameObject());
    }

    static size = new Vec2(64);
}
