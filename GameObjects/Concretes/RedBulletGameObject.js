class RedBulletGameObject extends BulletGameObject {
    constructor(partition, direction = new Vec2()) {
        // Paramétrage des bullets 
        super(Services.get(Services.ASSET).get("Images/redbullet.png"), new Vec2(32), partition, direction, 350, 100);
        this.dieCommand.addCommand(new PopCommand(this, new RedExplosionGameObject()));
        this.layer = 0.99;
        this.sound = Services.get(Services.ASSET).get("sounds/laser1.mp3");
    }

    getClone() {
        return new RedBulletGameObject(this.partition, this.direction.getClone());
    }
}

