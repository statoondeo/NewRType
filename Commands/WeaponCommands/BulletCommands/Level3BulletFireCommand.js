class Level3BulletFireCommand extends Level2BulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);
        this.command = new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(this.gameObject, Math.PI, new Vec2(-this.gameObject.size.x, 0)), new Vec2(), this.fireRate);
        this.addCommand(this.command);
        this.baseAngle = Math.PI;
        this.angle = Math.PI;
        this.angleAmplitude = Math.PI / 4;
        this.angleSpeed = 0.25;
    }

    update(dt) {
        super.update(dt);
        this.angle += this.angleSpeed * dt;
        if ((this.angle > this.baseAngle + this.angleAmplitude) || (this.angle < this.baseAngle - this.angleAmplitude)) {
            this.angleSpeed *= -1;
        }
        this.angle = Tools.clamp(this.angle, this.baseAngle - this.angleAmplitude, this.baseAngle + this.angleAmplitude);
        this.command.prototype = new WeaponBlueBulletGameObject(this.gameObject, this.angle, new Vec2(-this.gameObject.size.x / 2, -10));
    }

    getClone(gameObject) {
        return new Level3BulletFireCommand(gameObject, this.fireRate, this.sound);
    }
}