class BlueExplosionGameObject extends ExplosionGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/bluespark.png"), new Vec2(100));
    }

    getClone() {
        return new BlueExplosionGameObject();
    }
}

