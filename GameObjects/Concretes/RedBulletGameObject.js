class RedBulletGameObject extends BulletGameObject {
    constructor(partition, direction = new Vec2(), speed = 350) {
        // Paramétrage des bullets 
        super(Services.get(Services.ASSET).get("Images/redbullet.png"), new Vec2(32), partition, direction, speed, 100);
        this.dieCommand.addCommand(new PopCommand(this, new RedExplosionGameObject()));
        this.layer = 0.99;
        this.sound = Services.get(Services.ASSET).get("Sounds/laser1.mp3");
    }

    getClone() {
        return new RedBulletGameObject(this.partition, this.direction.getClone(), this.speed);
    }
}

