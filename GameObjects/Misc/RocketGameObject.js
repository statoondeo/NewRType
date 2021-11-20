class RocketGameObject extends AnimatedSprite {
    constructor(image, size, partition, direction, speed, damageAmount) {
        super(image, size)
        this.type = "MISSILE";
        this.partition = partition;
        this.status = "ACTIVE";
        this.speed = speed;
        this.damageAmount = damageAmount;
        this.direction = direction;
        this.collideBox = new CircleCollideBox(this.position, this.size.x / 2);
        this.layer = 1;
        this.moveStrategy = new RocketApexMoveStrategy(this);
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 25 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.collideCommand = new MissileCollideCommand(this);
        this.dealDamageCommand = new DealDamageCommand(this, damageAmount);
        this.dieCommand = new DieCommand(this);
    }
}

