class Level1BulletFireCommand extends BaseMultiBulletFireCommand {
    constructor(gameObject, bulletPrototype, fireRate, randomized, sound) {
        super(gameObject, bulletPrototype, fireRate, sound);
        this.addCommand(new FireRatedFireCommand(this.gameObject, this.bulletPrototype, new Vec2(), this.fireRate, randomized));
    }

    getClone(gameObject) {
        return new Level1BulletFireCommand(gameObject, this.bulletPrototype.getClone(), this.fireRate, this.randomized);
    }
}