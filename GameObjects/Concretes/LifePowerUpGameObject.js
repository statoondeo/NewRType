class LifePowerUpGameObject extends BonusGameObject {
    constructor(gameObject) {
        super(gameObject, new GreenSparkGameObject(), new LifeUpGameObject(), 75);
        this.dieCommand.addCommand(new LifeBonusCommand(this.gameObject, 200));
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new GreenExplosionGameObject(75) ])));
        this.collideCommand = new LifeBonusCollideCommand(this);
        this.thrust = new ParticlesThrustGameObject(this, new GreenExplosionGameObject(30), 1);
    }

    update(dt) {
        super.update(dt);
        this.thrust.update(dt);
    }

    getClone() {
        return new LifePowerUpGameObject(this.gameObject);
    }

    static size = new Vec2(200);
}
