class GreenExplosionGameObject extends ExplosionGameObject {
    constructor(speed) {
        super(Services.get(Services.ASSET).get("Images/greenspark.png"), new Vec2(100), speed);
    }
            
    getClone() {
        return new GreenExplosionGameObject();
    }
}
class MediumGreenExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 30) {
        super(ImageHandler.zoomImage(Services.get(Services.ASSET).get("Images/greenspark.png"), new Vec2(2)), new Vec2(200), speed);
    }
    
    getClone() {
        return new MediumGreenExplosionGameObject(this.speed);
    }
}
