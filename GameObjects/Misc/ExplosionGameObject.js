class ExplosionGameObject extends AnimatedSprite {
    constructor(image, size, speed = 15) {
        super(image, size)
        this.type = "NONE";
        this.partition = "NEUTRAL_PARTITION";
        this.status = "IDLE";
        this.layer = 0.99;
        this.speed = speed;
        let animationTable = [0, 4, 7, 6, 5, 4, 3, 2, 1, 0];
        this.addAnimation(new Animation("IDLE", animationTable, this.speed / 1000, true));
        this.startAnimation("IDLE", 0);
        this.totalTtl = animationTable.length * this.speed / 1000;
    }

    update(dt) {
        super.update(dt);
        this.totalTtl -= dt;
        if (this.totalTtl <= 0) {
            this.status = "OUTDATED";
        }
    }
}

