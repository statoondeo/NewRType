class RedExplosionGameObject extends ExplosionGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/redspark.png"), new Vec2(100), 15);
    }
    
    getClone() {
        return new RedExplosionGameObject();
    }
}

