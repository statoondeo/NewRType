class BlueBulletGameObject extends BulletGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/bluebullet.png"), new Vec2(32), partition, direction, 450, 200);
        this.dieCommand = new PopAndDieCommand(this, new BlueExplosionGameObject());
    }
}

