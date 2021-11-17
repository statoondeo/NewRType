class Level4BulletFireCommand extends Level3BulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(gameObject, 0, new Vec2(0, -10)), new Vec2(), this.fireRate));
    }

    getClone(gameObject) {
        return new Level4BulletFireCommand(gameObject, this.fireRate, this.sound);
    }
}