class BlueBulletGameObject extends BulletGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(Services.get(Services.ASSET).getImage("Images/bluebullet.png"), new Vec2(32), partition, direction, 450, 200);
        this.dieCommand.addCommand(new PopCommand(this, new BlueExplosionGameObject()));
        this.sound = Services.get(Services.ASSET).getSound("sounds/laser4.mp3");
    }

    getClone() {
        return new BlueBulletGameObject(this.partition, this.direction.getClone());;
    }
}

