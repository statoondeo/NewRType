class WeaponPowerUpGameObject extends BonusGameObject {
    constructor(gameObject) {
        super(gameObject, new PurpleSparkGameObject(), new WeaponUpGameObject(), 75);
        this.dieCommand.addCommand(new WeaponBonusCommand(this.gameObject));
        this.dieCommand.addCommand(new UpdatePlayerHudWeaponCommand(this.gameObject));
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new PurpleExplosionGameObject(75) ])));
        this.collideCommand = new WeaponBonusCollideCommand(this);
    }

    getClone() {
        return new WeaponPowerUpGameObject(this.gameObject);
    }

    static size = new Vec2(200);
}
class UpdatePlayerHudWeaponCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.hud.addWeaponBonus();
        }
    }
}