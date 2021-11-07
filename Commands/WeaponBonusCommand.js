class WeaponBonusCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new WeaponBonusCommand(gameObject);
    }

    execute() {
        if (this.canExecute) {
            ServiceLocator.getService(ServiceLocator.SCENE).currentScene.playerShip.fireCommand.weapon.levelUp();
        }
    }
}
