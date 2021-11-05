class ExplosionGameObject extends AnimatedSprite {
    constructor(image, size) {
        super(image, size)
        this.type = GameObjectType.NONE;
        this.partition = GameObjectPartition.NEUTRAL_PARTITION;
        this.status = GameObjectState.IDLE;
        this.layer = 1;
        this.addAnimation(new Animation("IDLE", [0, 4, 7, 6, 5, 4, 3, 2, 1, 0], 15 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.totalTtl = 0.150;
    }

    getClone() {
        return new ExplosionGameObject(this.image, this.size.getClone());
    }

    update(dt) {
        super.update(dt);
        this.totalTtl -= dt;
        if (this.totalTtl <= 0) {
            this.status = GameObjectState.OUTDATED;
        }
    }
}

