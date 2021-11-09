class BlueBulletGameObject extends BulletGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/bluebullet.png"), new Vec2(32), partition, direction, 450, 200);
        this.dieCommand = new PopAndDieCommand(this, new BlueExplosionGameObject());
    }

    getClone() {
        let clone = new BlueBulletGameObject(this.partition, this.direction.getClone());
        clone.moveStrategy = this.moveStrategy.getClone(clone)
        return clone;
    }
}
