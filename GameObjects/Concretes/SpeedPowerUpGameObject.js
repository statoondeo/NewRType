class SpeedPowerUpGameObject extends BonusGameObject {
    constructor(gameObject) {
        super(gameObject, new BlueSparkGameObject(), new SpeedUpGameObject(), 75);
        this.dieCommand.addCommand(new SpeedBonusCommand(this.gameObject, 50));
        this.dieCommand.addCommand(new UpdatePlayerHudSpeedCommand(this.gameObject));
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new BlueExplosionGameObject(75) ])));
        this.collideCommand = new SpeedBonusCollideCommand(this);
    }
        
    getClone() {
        return new SpeedPowerUpGameObject(this.gameObject);
    }
}
class UpdatePlayerHudSpeedCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.hud.addSpeedBonus();
        }
    }
}
