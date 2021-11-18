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
            let weapon = Services.get(Services.SCENE).currentScene.playerShip.fireCommand.weapon;
            if (weapon.currentLevel() == 5) {
                this.gameObject.life = this.gameObject.maxLife;
            }
            else {
                Services.get(Services.SCENE).currentScene.playerShip.fireCommand.weapon.levelUp();
            }
        }
    }
}
