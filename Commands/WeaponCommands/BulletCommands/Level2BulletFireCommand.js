class Level2BulletFireCommand extends BaseMultiBulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(gameObject, -Math.PI / 36, new Vec2(0, -10)), new Vec2(), this.fireRate));
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(gameObject, Math.PI / 36, new Vec2(0, -10)), new Vec2(), this.fireRate));
    }

    getClone(gameObject) {
        return new Level2BulletFireCommand(gameObject, this.fireRate, sound);
    }
}