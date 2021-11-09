class GreenExplosionGameObject extends ExplosionGameObject {
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/greenspark.png"), new Vec2(100));
    }
            
    getClone() {
        return new GreenExplosionGameObject();
    }
}

