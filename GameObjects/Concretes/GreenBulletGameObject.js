class GreenBulletGameObject extends BulletGameObject {
    constructor(gameObject, playerShip, partition) {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/greenbullet.png"), new Vec2(32), partition, new Vec2(), 400, 150);
        this.gameObject = gameObject;
        this.playerShip = playerShip;
        this.moveStrategy = new PlayerAimedUniformMoveStrategy(this, this.gameObject, this.playerShip);
        this.dieCommand = new PopAndDieCommand(this, new GreenExplosionGameObject());
    }
        
    getClone() {
        return new GreenBulletGameObject(this.gameObject, this.playerShip, this.partition);
    }
}

