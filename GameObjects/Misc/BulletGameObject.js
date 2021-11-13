class BulletGameObject extends AnimatedSprite {
    constructor(image, size, partition, direction, speed, damageAmount) {
        super(image, size)
        this.type = GameObjectType.MISSILE;
        this.partition = partition;
        this.status = GameObjectState.ACTIVE;
        this.speed = speed;
        this.damageAmount = damageAmount;
        this.direction = direction;
        this.collideBox = new CircleCollideBox(this.position, 0.6 * this.size.x / 2, new Vec2(0.3 * this.size.x / 2, 0.3 * this.size.y / 2));
        this.layer = 0.990;
        this.moveStrategy = new UniformMoveStrategy(this, direction);
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.collideCommand = new MissileCollideCommand(this);
        this.dealDamageCommand = new DealDamageCommand(this, damageAmount);
        this.dieCommand.addCommand(new DieCommand(this));
    }

    fire() {
        this.sound.play();
    }
}

