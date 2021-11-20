class BlueBulletGameObject extends BulletGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(Services.get("ASSET").get("Images/bluebullet.png"), new Vec2(32), partition, direction, 450, 200);
        this.dieCommand.addCommand(new PopCommand(this, new BlueExplosionGameObject()));
    }

    getClone() {
        let clone = new BlueBulletGameObject(this.partition, this.direction.getClone());
        clone.moveStrategy = this.moveStrategy.getClone(clone);
        return clone;
    }
}
class WeaponBlueBulletGameObject extends BlueBulletGameObject {
    constructor(playerShip, angle = 0, offset = new Vec2()) {
        super(playerShip.partition, new Vec2());
        this.speed = this.speed * (0.8 + Math.random() * 0.4);
        this.playerShip = playerShip;
        this.angle = angle;
        this.offset = offset;
        let pt1Abscisse = this.angle > Math.PI / 2 || this.angle < 3 * Math.PI / 2 ? -100 : 100;
        let pt0 = new Vec2(this.playerShip.position.x + this.playerShip.size.x / 2 + this.offset.x, this.playerShip.position.y + this.playerShip.size.y / 2 + this.offset.y);
        let pt1 = new Vec2(pt0.x + 50 * (Math.random() - 0.5), pt0.y + pt1Abscisse * (Math.random() - 0.5));
        let pt2 = new Vec2(pt0.x + Services.get("SCREEN").width * Math.cos(this.angle), pt0.y +  Services.get("SCREEN").width * Math.sin(this.angle));
        this.moveStrategy = new BezierApexMoveStrategy(this, new BezierCurve(1.2, [ pt0, pt1, pt2 ]))
    }

    getClone() {
        return new WeaponBlueBulletGameObject(this.playerShip, this.angle, this.offset);
    }
}

