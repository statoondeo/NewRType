class DealDamageCommand extends BaseCommand {
    constructor(gameObject, amount) {
        super(gameObject);
        this.amount = amount;
    }

    getClone(gameObject) {
        return new DealDamageCommand(gameObject, this.amount);
    }

    execute(otherGameObject) {
        if (this.canExecute) {
            otherGameObject.life -=  this.amount;
            if (otherGameObject.life <= 0) {
                otherGameObject.life = 0;
                otherGameObject.dieCommand.execute();
            }
        }
    }
}
