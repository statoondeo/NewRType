class RedBulletGameObject extends BulletGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/redbullet.png"), new Vec2(32), partition, direction, 350, 100);
        this.dieCommand = new PopAndDieCommand(this, new RedExplosionGameObject());
    }
}

