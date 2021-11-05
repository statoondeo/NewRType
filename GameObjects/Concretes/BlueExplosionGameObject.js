class BlueExplosionGameObject extends ExplosionGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/bluespark.png"), new Vec2(100));
    }
}

