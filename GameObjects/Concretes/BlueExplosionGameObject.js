class BlueExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(Services.get(Services.ASSET).get("Images/bluespark.png"), new Vec2(100), speed);
    }

    getClone() {
        return new BlueExplosionGameObject(this.speed);
    }
}

