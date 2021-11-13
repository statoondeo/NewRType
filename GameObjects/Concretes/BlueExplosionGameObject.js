class BlueExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(Services.get(Services.ASSET).getImage("Images/bluespark.png"), new Vec2(100), speed);
    }

    getClone() {
        return new BlueExplosionGameObject(this.speed);
    }
}

