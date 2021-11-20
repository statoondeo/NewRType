class BlueExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(Services.get("ASSET").get("Images/bluespark.png"), new Vec2(100), speed);
    }

    getClone() {
        return new BlueExplosionGameObject(this.speed);
    }
}
class MediumBlueExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 30) {
        super(ImageHandler.zoomImage(Services.get("ASSET").get("Images/bluespark.png"), new Vec2(2)), new Vec2(200), speed);
    }
    
    getClone() {
        return new MediumBlueExplosionGameObject(this.speed);
    }
}