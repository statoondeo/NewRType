class GreenBulletGameObject extends BulletGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/greenbullet.png"), new Vec2(32), partition, direction, 400, 150);
        this.dieCommand = new PopAndDieCommand(this, new GreenExplosionGameObject());
    }
}

