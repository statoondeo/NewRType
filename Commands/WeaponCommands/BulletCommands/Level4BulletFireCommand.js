class Level4BulletFireCommand extends Level3BulletFireCommand {
    constructor(gameObject, bulletPrototype, fireRate, randomized, sound) {
        super(gameObject, bulletPrototype, fireRate, randomized, sound);
        this.addCommand(new FireRatedFireCommand(gameObject, bulletPrototype, new Vec2(0, -this.bulletPrototype.size.y), fireRate, randomized));
        this.addCommand(new FireRatedFireCommand(gameObject, bulletPrototype, new Vec2(0, this.bulletPrototype.size.y), fireRate, randomized));
    }

    getClone(gameObject) {
        return new Level4BulletFireCommand(gameObject, this.bulletPrototype.getClone(), this.fireRate, this.randomized);
    }
}