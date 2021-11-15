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
            otherGameObject.damage(this.amount);
        }
    }
}
class TakeDamageCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new TakeDamageCommand(gameObject);
    }

    execute(amount) {
        if (this.canExecute) {
            this.gameObject.damage(amount);
        }
    }
}
