class GreenBulletGameObject extends BulletGameObject {
    constructor(gameObject, moveStrategy = null) {
        super(Services.get("ASSET").get("Images/greenbullet.png"), new Vec2(32), gameObject.partition, new Vec2(), 400, 150);
        this.gameObject = gameObject;
        this.moveStrategy = moveStrategy;
        this.dieCommand.addCommand(new PopCommand(this, new GreenExplosionGameObject()));
    }
        
    getClone() {
        let clone = new GreenBulletGameObject(this.gameObject);
        clone.moveStrategy = this.moveStrategy.getClone(clone);
        return clone;
    }
}

