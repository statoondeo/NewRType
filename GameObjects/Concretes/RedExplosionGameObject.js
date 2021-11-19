class RedExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(Services.get(Services.ASSET).get("Images/redspark.png"), new Vec2(100), speed);
    }
    
    getClone() {
        return new RedExplosionGameObject(this.speed);
    }
}
class PurpleExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(Services.get(Services.ASSET).get("Images/purplespark.png"), new Vec2(100), speed);
    }
    
    getClone() {
        return new PurpleExplosionGameObject(this.speed);
    }
}
class MediumPurpleExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 30) {
        super(ImageHandler.zoomImage(Services.get(Services.ASSET).get("Images/purplespark.png"), new Vec2(2)), new Vec2(200), speed);
    }
    
    getClone() {
        return new MediumRedExplosionGameObject(this.speed);
    }
}
