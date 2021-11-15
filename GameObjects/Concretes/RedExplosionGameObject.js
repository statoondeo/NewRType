class RedExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(Services.get(Services.ASSET).get("Images/redspark.png"), new Vec2(100), speed);
    }
    
    getClone() {
        return new RedExplosionGameObject(this.speed);
    }
}

