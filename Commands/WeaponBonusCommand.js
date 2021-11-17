class WeaponBonusCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new WeaponBonusCommand(gameObject);
    }

    execute() {
        if (this.canExecute) {
            Services.get(Services.ASSET).get("Sounds/Correct_08_wav.wav").play();
            Services.get(Services.SCENE).currentScene.playerShip.fireCommand.weapon.levelUp();
        }
    }
}
