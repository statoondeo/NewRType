class Level5BulletFireCommand extends Level4BulletFireCommand {
    constructor(gameObject, bulletPrototype, fireRate, randomized, sound) {
        super(gameObject, bulletPrototype, fireRate, randomized, sound);
        let startingPoint = new Vec2(this.gameObject.size.x / 2 , 0);

        let otherBulletPrototype = bulletPrototype.getClone();
        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(-this.frontAngle), Math.sin(-this.frontAngle)));
        this.addCommand(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));

        otherBulletPrototype = bulletPrototype.getClone();
        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(this.frontAngle), Math.sin(this.frontAngle)));
        this.addCommand(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));    
    }

    getClone(gameObject) {
        return new Level5BulletFireCommand(gameObject, this.bulletPrototype.getClone(), this.fireRate, this.randomized);
    }
}

