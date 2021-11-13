class GreenExplosionGameObject extends ExplosionGameObject {
    constructor() {
        super(Services.get(Services.ASSET).getImage("Images/greenspark.png"), new Vec2(100));
    }
            
    getClone() {
        return new GreenExplosionGameObject();
    }
}

