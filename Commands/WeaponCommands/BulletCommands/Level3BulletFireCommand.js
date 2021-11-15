class Level3BulletFireCommand extends Level2BulletFireCommand {
    constructor(gameObject, bulletPrototype, fireRate, randomized, sound) {
        super(gameObject, bulletPrototype, fireRate, randomized, sound);

        let startingPoint = new Vec2();
        let otherBulletPrototype = bulletPrototype.getClone();

        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(Math.PI - this.rearAngle), Math.sin(Math.PI - this.rearAngle)));
        this.addCommand(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));

        otherBulletPrototype = bulletPrototype.getClone();
        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(Math.PI + this.rearAngle), Math.sin(Math.PI + this.rearAngle)));
        this.addCommand(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));
    }

    getClone(gameObject) {
        return new Level3BulletFireCommand(gameObject, this.bulletPrototype.getClone(), this.fireRate, this.randomized);
    }
}