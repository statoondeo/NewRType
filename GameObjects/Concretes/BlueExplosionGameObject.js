class BlueExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/bluespark.png"), new Vec2(100), speed);
    }

    getClone() {
        return new BlueExplosionGameObject(this.speed);
    }
}

