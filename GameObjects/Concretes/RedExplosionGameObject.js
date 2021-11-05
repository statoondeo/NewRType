class RedExplosionGameObject extends ExplosionGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/redspark.png"), new Vec2(100));
    }
}

