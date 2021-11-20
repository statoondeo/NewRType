class SpeedBonusCommand extends BaseCommand {
    constructor(gameObject, speedBonus) {
        super(gameObject);
        this.speedBonus = speedBonus;
    }

    getClone() {
        return new SpeedBonusCommand(this.gameObject, this.speedBonus);
    }

    execute() {
        if (this.canExecute) {
            Services.get("ASSET").get("Sounds/Correct_06_wav.wav").play();
            this.gameObject.speed += this.speedBonus;
        }
    }
}
