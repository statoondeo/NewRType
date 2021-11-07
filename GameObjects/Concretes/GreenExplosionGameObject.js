class GreenExplosionGameObject extends ExplosionGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("images/greenspark.png"), new Vec2(100));
    }
            
    getClone() {
        return new GreenExplosionGameObject();
    }
}

