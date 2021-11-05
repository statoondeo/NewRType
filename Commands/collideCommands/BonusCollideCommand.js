class BonusCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new BonusCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == GameObjectType.SHIP) {
            this.canExecute = false;
            this.gameObject.bonusCommand.execute();
            this.gameObject.dieCommand.execute();
        }
    }
}
