class LifeBonusCommand extends BaseCommand {
    constructor(gameObject, lifeBonus) {
        super(gameObject);
        this.lifeBonus = lifeBonus;
    }

    getClone() {
        return new LifeBonusCommand(this.gameObject, this.lifeBonus);
    }

    execute() {
        if (this.canExecute) {
            Services.get(Services.ASSET).get("Sounds/Correct_06_wav.wav").play();
            this.gameObject.life += this.lifeBonus;
            this.gameObject.life = Tools.clamp(this.gameObject.life, 0, this.gameObject.maxLife);
        }
    }
}
