class DieCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new DieCommand(gameObject);
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.status = GameObjectState.OUTDATED;
        }
    }
}
