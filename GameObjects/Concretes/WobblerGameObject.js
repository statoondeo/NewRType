class WobblerGameObject extends EnemyShipGameObject {
    constructor(playerShip) {
        super(Services.get(Services.ASSET).getImage("Images/wobbler.png"), new Vec2(64), 600, 150);
        this.playerShip = playerShip;
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(1, 0), 100);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, new GreenBulletGameObject(this, this.playerShip, this.partition), new Vec2(), 2));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
                
    getClone() {
        return new WobblerGameObject(this.playerShip);
    }

    update(dt) {
        super.update(dt);
    }

    static size = new Vec2(64);
}
