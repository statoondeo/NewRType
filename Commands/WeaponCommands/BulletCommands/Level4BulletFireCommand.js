class Level4BulletFireCommand extends Level2BulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(this.gameObject, 7 * Math.PI / 6, new Vec2(-this.gameObject.size.x, 0)), new Vec2(), this.fireRate));
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(this.gameObject, 5 * Math.PI / 6, new Vec2(-this.gameObject.size.x, 0)), new Vec2(), this.fireRate));
    }

    getClone(gameObject) {
        return new Level4BulletFireCommand(gameObject, this.fireRate, this.sound);
    }
}