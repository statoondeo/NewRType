class RedBulletGameObject extends BulletGameObject {
    constructor(partition, direction = new Vec2()) {
        // Paramétrage des bullets 
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/redbullet.png"), new Vec2(32), partition, direction, 350, 100);
        this.dieCommand.addCommand(new PopCommand(this, new RedExplosionGameObject()));
        this.layer = 0.99;
    }

    getClone() {
        return new RedBulletGameObject(this.partition, this.direction.getClone());
    }
}

