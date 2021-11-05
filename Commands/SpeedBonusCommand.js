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
            this.gameObject.speed += this.speedBonus;
        }
    }
}
