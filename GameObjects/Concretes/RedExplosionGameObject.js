class RedExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/redspark.png"), new Vec2(100), speed);
    }
    
    getClone() {
        return new RedExplosionGameObject(this.speed);
    }
}

