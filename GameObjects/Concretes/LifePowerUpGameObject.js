class LifePowerUpGameObject extends BonusGameObject {
    constructor(gameObject) {
        super(gameObject, new GreenSparkGameObject(), new LifeUpGameObject(), 75);
        this.dieCommand.addCommand(new LifeBonusCommand(this.gameObject, 200));
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new GreenExplosionGameObject(75) ])));
        this.collideCommand = new LifeBonusCollideCommand(this);
    }

    getClone() {
        return new LifePowerUpGameObject(this.gameObject);
    }
}
