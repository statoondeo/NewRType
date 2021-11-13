class GreenBulletGameObject extends BulletGameObject {
    constructor(gameObject, playerShip, partition) {
        super(Services.get(Services.ASSET).getImage("Images/greenbullet.png"), new Vec2(32), partition, new Vec2(), 400, 150);
        this.gameObject = gameObject;
        this.playerShip = playerShip;
        this.moveStrategy = new PlayerAimedUniformMoveStrategy(this, this.gameObject, this.playerShip);
        this.dieCommand.addCommand(new PopCommand(this, new GreenExplosionGameObject()));
        this.sound = Services.get(Services.ASSET).getSound("sounds/laser3.mp3");
    }
        
    getClone() {
        return new GreenBulletGameObject(this.gameObject, this.playerShip, this.partition);
    }
}

