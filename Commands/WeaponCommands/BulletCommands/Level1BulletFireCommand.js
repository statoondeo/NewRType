class Level1BulletFireCommand extends BaseMultiBulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(gameObject), new Vec2(), this.fireRate));
    }

    getClone(gameObject) {
        return new Level1BulletFireCommand(gameObject, this.fireRate, this.sound);
    }
}