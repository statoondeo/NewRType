class StarknifeGameObject extends EnemyShipGameObject {
    constructor() {
        // Paramétrage du vaisseau ennemi
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/starknife.png"), new Vec2(64), 400, 100)
        this.behaveStrategy = new BaseBehaveStrategy(this, new SinWaveMoveStrategy(this, new Vec2(-1, 0), 800), new BaseFireStrategy(this));
        this.behaveStrategy.fireCommand = new AsapFireCommand(new FireCommand(this, new RedBulletGameObject(this.partition, new Vec2(-1, 0)), new Vec2(), 3));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.dieCommand = new PopAndDieCommand(this, new RedExplosionGameObject());
    }

    static size = new Vec2(64);
}

